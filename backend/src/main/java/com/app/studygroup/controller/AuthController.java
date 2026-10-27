package com.app.studygroup.controller;

import com.app.studygroup.dto.AuthResponse;
import com.app.studygroup.dto.LoginRequest;
import com.app.studygroup.dto.RegisterRequest;
import com.app.studygroup.dto.UserDto;
import com.app.studygroup.service.UserOperations;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for frontend client interaction (Phase 3 & Phase 4).
 * Interacts via standard JSON format and manages HttpSession session tracking.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8080"}, allowCredentials = "true")
public class AuthController {

    private final UserOperations userOperations;

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String email) {
        String normalized = email != null ? email.trim().toLowerCase() : "";
        var userOpt = userOperations.getUserByEmail(normalized);
        boolean exists = userOpt.isPresent();
        return ResponseEntity.ok(Map.of(
                "exists", exists,
                "email", normalized,
                "role", exists ? (userOpt.get().getRole() != null ? userOpt.get().getRole() : "student") : "",
                "name", exists ? userOpt.get().getName() : "",
                "message", exists
                        ? "Account found for " + userOpt.get().getName() + " (" + userOpt.get().getRole() + ")."
                        : "No account registered with this email. Please create an account first."
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest servletRequest
    ) {
        AuthResponse response = userOperations.register(request);
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        // Bind to session for session tracking
        HttpSession session = servletRequest.getSession(true);
        userOperations.storeUserInSession(session, response.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/mentor/register")
    public ResponseEntity<AuthResponse> registerMentor(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest servletRequest
    ) {
        request.setRole("mentor");
        AuthResponse response = userOperations.register(request);
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        HttpSession session = servletRequest.getSession(true);
        userOperations.storeUserInSession(session, response.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest
    ) {
        AuthResponse response = userOperations.login(request);
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        // Phase 4: Implement session tracking using HttpSession
        HttpSession session = servletRequest.getSession(true);
        userOperations.storeUserInSession(session, response.getUser());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/mentor/login")
    public ResponseEntity<AuthResponse> loginMentor(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest
    ) {
        request.setRole("mentor");
        AuthResponse response = userOperations.login(request);
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        HttpSession session = servletRequest.getSession(true);
        userOperations.storeUserInSession(session, response.getUser());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/session")
    public ResponseEntity<AuthResponse> getSessionUser(HttpServletRequest servletRequest) {
        HttpSession session = servletRequest.getSession(false);
        if (session != null) {
            return userOperations.getUserFromSession(session)
                    .map(user -> ResponseEntity.ok(AuthResponse.builder()
                            .success(true)
                            .message("Active session retrieved: " + session.getId())
                            .user(user)
                            .build()))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                            AuthResponse.builder()
                                    .success(false)
                                    .message("No active authenticated session.")
                                    .user(null)
                                    .build()
                    ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                AuthResponse.builder()
                        .success(false)
                        .message("No active session found.")
                        .user(null)
                        .build()
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(HttpServletRequest servletRequest) {
        HttpSession session = servletRequest.getSession(false);
        if (session != null) {
            userOperations.invalidateSession(session);
        }
        return ResponseEntity.ok(AuthResponse.builder()
                .success(true)
                .message("Logged out and session invalidated.")
                .user(null)
                .build());
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable String id) {
        return userOperations.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body((UserDto) null));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userOperations.getAllUsers());
    }

    @PostMapping("/user/{id}/groups")
    public ResponseEntity<UserDto> updateGroups(@PathVariable String id, @RequestBody Map<String, List<String>> payload) {
        List<String> groupIds = payload.getOrDefault("joinedGroups", List.of());
        UserDto updated = userOperations.updateJoinedGroups(id, groupIds);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/admin/users")
    public ResponseEntity<?> getAdminUsers(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (!userOperations.hasAdminPrivileges(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied. Administrator privileges required."));
        }
        return ResponseEntity.ok(userOperations.getAllUsers());
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<?> deleteUserAsAdmin(@PathVariable String id, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (!userOperations.hasAdminPrivileges(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied. Administrator privileges required."));
        }
        userOperations.deleteUserByAdmin(id, session);
        return ResponseEntity.ok(Map.of("success", true, "message", "User removed by administrator."));
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<?> getAdminSystemStats(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (!userOperations.hasAdminPrivileges(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied. Administrator privileges required."));
        }
        return ResponseEntity.ok(userOperations.getSystemStatistics());
    }
}
