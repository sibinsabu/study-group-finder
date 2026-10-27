package com.app.studygroup.service;

import com.app.studygroup.dto.AuthResponse;
import com.app.studygroup.dto.LoginRequest;
import com.app.studygroup.dto.RegisterRequest;
import com.app.studygroup.dto.UserDto;
import com.app.studygroup.exception.AuthenticationException;
import com.app.studygroup.exception.InvalidInputException;
import com.app.studygroup.exception.UserAlreadyExistsException;
import jakarta.servlet.http.HttpSession;

import java.util.List;
import java.util.Optional;

/**
 * Interface defining contract for user operations.
 * Addresses Phase 2: Structured Programming and Reliability
 * ("Create an interface for user operations e.g., validation/authentication").
 */
public interface UserOperations {

    /**
     * Registers a new user with validation and persistence.
     *
     * @param request user registration details
     * @return AuthResponse with operation status and user details
     * @throws InvalidInputException      if inputs fail validation
     * @throws UserAlreadyExistsException  if email or username already taken
     */
    AuthResponse register(RegisterRequest request) throws InvalidInputException, UserAlreadyExistsException;

    /**
     * Authenticates a user given email/username and password credentials.
     *
     * @param request login credentials
     * @return AuthResponse with operation status and user details
     * @throws InvalidInputException   if inputs are empty
     * @throws AuthenticationException if credentials do not match
     */
    AuthResponse login(LoginRequest request) throws InvalidInputException, AuthenticationException;

    /**
     * Validates registration inputs using Java string handling methods.
     */
    void validateRegistration(RegisterRequest request) throws InvalidInputException;

    /**
     * Validates login inputs using Java string handling methods.
     */
    void validateLogin(LoginRequest request) throws InvalidInputException;

    /**
     * Binds user object to HTTP Session for state tracking.
     */
    void storeUserInSession(HttpSession session, UserDto user);

    /**
     * Retrieves authenticated user from HTTP Session.
     */
    Optional<UserDto> getUserFromSession(HttpSession session);

    /**
     * Invalidates HTTP Session upon logout.
     */
    void invalidateSession(HttpSession session);

    /**
     * Find user by unique ID.
     */
    Optional<UserDto> getUserById(String id);

    /**
     * Find user by email address.
     */
    Optional<UserDto> getUserByEmail(String email);

    /**
     * Find user by username.
     */
    Optional<UserDto> getUserByUsername(String username);

    /**
     * Updates list of joined study group IDs for a user.
     */
    UserDto updateJoinedGroups(String userId, List<String> groupIds);

    /**
     * Retrieves all registered users.
     */
    List<UserDto> getAllUsers();

    /**
     * Checks if the given HTTP session holds administrative privileges.
     */
    boolean hasAdminPrivileges(HttpSession session);

    /**
     * Delete user by ID (requires admin privileges).
     */
    void deleteUserByAdmin(String targetUserId, HttpSession session);

    /**
     * Get system statistics (total users, mentors, students, circles).
     */
    java.util.Map<String, Object> getSystemStatistics();
}
