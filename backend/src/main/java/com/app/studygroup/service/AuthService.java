package com.app.studygroup.service;

import com.app.studygroup.dto.AuthResponse;
import com.app.studygroup.dto.LoginRequest;
import com.app.studygroup.dto.RegisterRequest;
import com.app.studygroup.dto.UserDto;
import com.app.studygroup.exception.AuthenticationException;
import com.app.studygroup.exception.InvalidInputException;
import com.app.studygroup.exception.UserAlreadyExistsException;
import com.app.studygroup.model.User;
import com.app.studygroup.repository.UserRepository;
import com.app.studygroup.util.ValidationUtil;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service implementation for user operations, implementing UserOperations interface.
 * Addresses Phase 1, Phase 2, and Phase 4:
 * - String handling validation
 * - Custom exception handling
 * - Session tracking integration
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService implements UserOperations {

    public static final String SESSION_USER_KEY = "currentUser";
    public static final String SESSION_EMAIL_KEY = "userEmail";
    public static final String SESSION_LOGIN_TIME_KEY = "loginTime";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void validateRegistration(RegisterRequest request) throws InvalidInputException {
        if (request == null) {
            throw new InvalidInputException("Registration request cannot be null.");
        }
        ValidationUtil.validateName(request.getName());
        ValidationUtil.validateEmail(request.getEmail());
        ValidationUtil.validatePassword(request.getPassword());
    }

    @Override
    public void validateLogin(LoginRequest request) throws InvalidInputException {
        if (request == null) {
            throw new InvalidInputException("Login request cannot be null.");
        }
        String id = request.getEffectiveIdentifier();
        if (id == null || id.trim().isEmpty()) {
            throw new InvalidInputException("Email or Username is required.");
        }
        ValidationUtil.validatePassword(request.getPassword());
    }

    @Override
    public AuthResponse register(RegisterRequest request) throws InvalidInputException, UserAlreadyExistsException {
        // Phase 1 & 2: String handling validation
        validateRegistration(request);

        String normalizedEmail = ValidationUtil.validateEmail(request.getEmail());
        String effectiveUsername = request.getUsername() != null && !request.getUsername().trim().isEmpty()
                ? request.getUsername().trim()
                : normalizedEmail.split("@")[0];

        // Phase 2 & 4: Check for duplicate user & throw UserAlreadyExistsException
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new UserAlreadyExistsException("An account with email " + normalizedEmail + " already exists.");
        }
        if (userRepository.existsByUsername(effectiveUsername)) {
            throw new UserAlreadyExistsException("An account with username '" + effectiveUsername + "' already exists.");
        }

        // Determine role: student or mentor
        boolean isMentor = "mentor".equalsIgnoreCase(request.getRole());
        String role = isMentor ? "mentor" : "student";

        // University resolution
        String university = request.getUniversity();
        if (university == null || university.trim().isEmpty()) {
            if (normalizedEmail.contains("@") && normalizedEmail.contains(".edu")) {
                String domain = normalizedEmail.substring(normalizedEmail.indexOf("@") + 1);
                university = domain.replace(".edu", "").toUpperCase();
            } else {
                university = isMentor ? "Academic Faculty & Mentors" : "University Scholar";
            }
        }

        // Avatar pool
        String avatar = isMentor
                ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80"
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80";

        String title = request.getTitle();
        if (isMentor && (title == null || title.isBlank())) {
            title = "Senior Academic Mentor";
        }

        String expertise = request.getExpertise();
        if (isMentor && (expertise == null || expertise.isBlank())) {
            expertise = "Computer Science, Data Structures & System Architecture";
        }

        String bio = request.getBio();
        if (bio == null || bio.isBlank()) {
            bio = isMentor
                    ? "Certified Academic Mentor committed to student excellence, collaborative problem-solving, and study group facilitation."
                    : "Passionate student preparing for midterms and collaborative study sprints.";
        }

        Integer experienceYears = request.getExperienceYears();
        if (isMentor && experienceYears == null) {
            experienceYears = 3;
        }

        // Create new User entity with hashed password (Phase 1: constructors and methods)
        User newUser = User.builder()
                .name(request.getName().trim())
                .username(effectiveUsername)
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .university(university.trim())
                .role(role)
                .expertise(expertise)
                .title(title)
                .bio(bio)
                .experienceYears(experienceYears)
                .linkedInOrWebsite(request.getLinkedInOrWebsite())
                .rating(isMentor ? 5.0 : 4.8)
                .avatar(avatar)
                .joinedGroups(new ArrayList<>(List.of("1", "2"))) // Default starter groups
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(newUser);
        log.info("Registered new user: {} ({}) with role: {}", savedUser.getEmail(), savedUser.getUsername(), savedUser.getRole());

        // Simultaneously auto-save all users to users_data.json on disk
        syncUsersToJsonFile();

        String successMsg = isMentor
                ? "Mentor registration successful! Welcome to StudySphere Mentor Network."
                : "Registration successful! Welcome to StudySphere.";

        return AuthResponse.builder()
                .success(true)
                .message(successMsg)
                .user(UserDto.fromEntity(savedUser))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) throws InvalidInputException, AuthenticationException {
        // Phase 1 & 2: Validate input format
        validateLogin(request);

        String identifier = request.getEffectiveIdentifier();

        // Query by email or username
        Optional<User> optionalUser = userRepository.findByEmailOrUsername(identifier);
        if (optionalUser.isEmpty()) {
            throw new AuthenticationException("No account registered with '" + identifier + "'. Please create an account before logging in.");
        }

        User user = optionalUser.get();

        // Phase 4: Validate password against BCrypt hash
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthenticationException("Incorrect password credentials. Please verify your password and try again.");
        }

        // Role check if specified (admin accounts bypass role restrictions)
        if (request.getRole() != null && !request.getRole().isBlank()) {
            String expectedRole = request.getRole().trim().toLowerCase();
            String actualRole = user.getRole() != null ? user.getRole().toLowerCase() : "student";
            if (!"admin".equals(actualRole)) {
                if ("mentor".equals(expectedRole) && !"mentor".equals(actualRole)) {
                    throw new AuthenticationException("This account is registered as a Student. Please switch to the Student portal to sign in.");
                }
                if ("student".equals(expectedRole) && !"student".equals(actualRole)) {
                    throw new AuthenticationException("This account is registered as an Academic Mentor. Please switch to the Mentor portal to sign in.");
                }
            }
        }

        boolean isAdmin = "admin".equalsIgnoreCase(user.getRole());
        boolean isMentor = "mentor".equalsIgnoreCase(user.getRole());
        String welcomeMsg = isAdmin
                ? "Admin login successful! Welcome back, Administrator " + user.getName() + "."
                : (isMentor
                    ? "Mentor login successful! Welcome back, Mentor " + user.getName() + "."
                    : "Login successful! Welcome back, " + user.getName() + ".");

        log.info("User logged in successfully: {} ({})", user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .success(true)
                .message(welcomeMsg)
                .user(UserDto.fromEntity(user))
                .build();
    }

    @Override
    public void storeUserInSession(HttpSession session, UserDto user) {
        if (session != null && user != null) {
            // Phase 4: Core session tracking attributes as per specifications
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());
            session.setAttribute("name", user.getName());
            session.setAttribute("role", user.getRole());
            session.setAttribute("isAdmin", user.isAdmin());
            session.setAttribute("privileges", user.getPrivileges() != null ? user.getPrivileges() : List.of());
            session.setAttribute(SESSION_USER_KEY, user);
            session.setAttribute(SESSION_EMAIL_KEY, user.getEmail());
            session.setAttribute(SESSION_LOGIN_TIME_KEY, LocalDateTime.now());
            // Session expires after 30 minutes of inactivity
            session.setMaxInactiveInterval(1800);
            log.info("Stored user {} (id={}, username={}, role={}) with adminPrivileges={} in HTTP Session id: {}", 
                    user.getEmail(), user.getId(), user.getUsername(), user.getRole(), user.isAdmin(), session.getId());
        }
    }

    @Override
    public Optional<UserDto> getUserFromSession(HttpSession session) {
        if (session == null) {
            return Optional.empty();
        }
        Object userObj = session.getAttribute(SESSION_USER_KEY);
        if (userObj instanceof UserDto userDto) {
            return Optional.of(userDto);
        }
        return Optional.empty();
    }

    @Override
    public void invalidateSession(HttpSession session) {
        if (session != null) {
            String sessionId = session.getId();
            session.invalidate();
            log.info("Invalidated HTTP Session id: {}", sessionId);
        }
    }

    @Override
    public Optional<UserDto> getUserById(String id) {
        return userRepository.findById(id).map(UserDto::fromEntity);
    }

    @Override
    public Optional<UserDto> getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase()).map(UserDto::fromEntity);
    }

    @Override
    public Optional<UserDto> getUserByUsername(String username) {
        return userRepository.findByUsername(username.trim()).map(UserDto::fromEntity);
    }

    @Override
    public UserDto updateJoinedGroups(String userId, List<String> groupIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidInputException("User not found with id: " + userId));

        user.setJoinedGroups(groupIds);
        User updated = userRepository.save(user);
        syncUsersToJsonFile();
        return UserDto.fromEntity(updated);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::fromEntity)
                .toList();
    }

    @PostConstruct
    public void initDefaultAdminAndSync() {
        // Automatically ensure default admin account exists with requested credentials and full admin privileges
        String adminEmail = "sibinkulathingal@gmail.com";
        String adminPass = "iuad5939";
        List<String> adminPrivileges = List.of(
                "ALL_PRIVILEGES",
                "MANAGE_USERS",
                "MANAGE_CIRCLES",
                "SYSTEM_ADMIN",
                "AUDIT_ACCESS"
        );

        Optional<User> existing = userRepository.findByEmail(adminEmail);
        if (existing.isPresent()) {
            User user = existing.get();
            user.setName("Sibin Kulathingal");
            user.setUsername("sibinkulathingal");
            user.setRole("admin");
            user.setPrivileges(adminPrivileges);
            user.setPassword(passwordEncoder.encode(adminPass));
            user.setUniversity("Kristu Jayanti Deemed to be University");
            user.setTitle("System Administrator & Academic Lead");
            userRepository.save(user);
            log.info("Initialized default admin account: {} with full admin privileges: {}", adminEmail, adminPrivileges);
        } else {
            User admin = User.builder()
                    .name("Sibin Kulathingal")
                    .username("sibinkulathingal")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPass))
                    .university("Kristu Jayanti Deemed to be University")
                    .role("admin")
                    .privileges(adminPrivileges)
                    .title("System Administrator & Academic Lead")
                    .bio("System Administrator and Lead Academic Coordinator.")
                    .rating(5.0)
                    .avatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80")
                    .joinedGroups(new ArrayList<>(List.of("1", "2")))
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
            log.info("Created default admin account: {} with full admin privileges: {}", adminEmail, adminPrivileges);
        }

        syncUsersToJsonFile();
    }

    @Override
    public boolean hasAdminPrivileges(HttpSession session) {
        if (session == null) return false;
        Object role = session.getAttribute("role");
        Object isAdmin = session.getAttribute("isAdmin");
        return Boolean.TRUE.equals(isAdmin) || "admin".equalsIgnoreCase(String.valueOf(role));
    }

    @Override
    public void deleteUserByAdmin(String targetUserId, HttpSession session) {
        if (!hasAdminPrivileges(session)) {
            throw new AuthenticationException("Administrative privileges required to perform this action.");
        }
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new InvalidInputException("User not found with id: " + targetUserId));
        if ("admin".equalsIgnoreCase(target.getRole()) && "sibinkulathingal@gmail.com".equalsIgnoreCase(target.getEmail())) {
            throw new InvalidInputException("The primary administrator account cannot be deleted.");
        }
        userRepository.delete(target);
        log.info("Admin deleted user id={}", targetUserId);
        syncUsersToJsonFile();
    }

    @Override
    public java.util.Map<String, Object> getSystemStatistics() {
        List<User> all = userRepository.findAll();
        long totalUsers = all.size();
        long mentors = all.stream().filter(u -> "mentor".equalsIgnoreCase(u.getRole())).count();
        long students = all.stream().filter(u -> "student".equalsIgnoreCase(u.getRole())).count();
        long admins = all.stream().filter(u -> "admin".equalsIgnoreCase(u.getRole())).count();

        return java.util.Map.of(
                "totalUsers", totalUsers,
                "mentors", mentors,
                "students", students,
                "admins", admins,
                "totalCircles", 6,
                "systemStatus", "HEALTHY",
                "serverEngine", "Apache Tomcat / Jakarta Servlet 6.0"
        );
    }

    /**
     * Automatically writes all registered users to users_data.json on disk
     * simultaneously whenever a new user registers or updates.
     */
    public synchronized void syncUsersToJsonFile() {
        try {
            List<UserDto> users = getAllUsers();
            StringBuilder sb = new StringBuilder();
            sb.append("[\n");
            for (int i = 0; i < users.size(); i++) {
                UserDto u = users.get(i);
                sb.append("  {\n");
                sb.append("    \"id\": \"").append(escapeJson(u.getId())).append("\",\n");
                sb.append("    \"name\": \"").append(escapeJson(u.getName())).append("\",\n");
                sb.append("    \"username\": \"").append(escapeJson(u.getUsername())).append("\",\n");
                sb.append("    \"email\": \"").append(escapeJson(u.getEmail())).append("\",\n");
                sb.append("    \"university\": \"").append(escapeJson(u.getUniversity())).append("\",\n");
                sb.append("    \"avatar\": \"").append(escapeJson(u.getAvatar())).append("\",\n");
                sb.append("    \"role\": \"").append(escapeJson(u.getRole())).append("\",\n");
                sb.append("    \"expertise\": ").append(u.getExpertise() != null ? "\"" + escapeJson(u.getExpertise()) + "\"" : "null").append(",\n");
                sb.append("    \"title\": ").append(u.getTitle() != null ? "\"" + escapeJson(u.getTitle()) + "\"" : "null").append(",\n");
                sb.append("    \"bio\": ").append(u.getBio() != null ? "\"" + escapeJson(u.getBio()) + "\"" : "null").append(",\n");
                sb.append("    \"experienceYears\": ").append(u.getExperienceYears() != null ? u.getExperienceYears() : "null").append(",\n");
                sb.append("    \"rating\": ").append(u.getRating() != null ? u.getRating() : 5.0).append(",\n");

                sb.append("    \"joinedGroups\": [");
                if (u.getJoinedGroups() != null && !u.getJoinedGroups().isEmpty()) {
                    for (int j = 0; j < u.getJoinedGroups().size(); j++) {
                        sb.append("\"").append(escapeJson(u.getJoinedGroups().get(j))).append("\"");
                        if (j < u.getJoinedGroups().size() - 1) sb.append(", ");
                    }
                }
                sb.append("],\n");

                sb.append("    \"createdAt\": ").append(u.getCreatedAt() != null ? "\"" + u.getCreatedAt() + "\"" : "null").append("\n");
                sb.append("  }");
                if (i < users.size() - 1) {
                    sb.append(",");
                }
                sb.append("\n");
            }
            sb.append("]\n");

            String jsonContent = sb.toString();

            // Support both direct running inside /backend or from root directory
            Path[] targetPaths = new Path[] {
                Paths.get("src/main/resources/users_data.json"),
                Paths.get("backend/src/main/resources/users_data.json"),
                Paths.get("target/classes/users_data.json"),
                Paths.get("../frontend/users_data.json"),
                Paths.get("frontend/users_data.json")
            };

            for (Path path : targetPaths) {
                try {
                    Path parent = path.getParent();
                    if (parent != null && Files.exists(parent)) {
                        Files.writeString(path, jsonContent, StandardCharsets.UTF_8,
                                StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
                        log.debug("Auto-saved users to: {}", path.toAbsolutePath());
                    }
                } catch (Exception ignored) {
                }
            }
        } catch (Exception e) {
            log.warn("Failed to auto-save users to JSON file: {}", e.getMessage());
        }
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}
