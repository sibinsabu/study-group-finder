package com.app.studygroup.util;

import com.app.studygroup.exception.InvalidInputException;

import java.util.regex.Pattern;

/**
 * Utility class providing core string-handling validation logic in Java.
 * Addresses Phase 1 (Basic validation logic in Java / string handling)
 * and Phase 2 (Validation and exception handling for invalid inputs).
 */
public final class ValidationUtil {

    // RFC 5322 compatible email pattern for string handling validation
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    private static final int MIN_PASSWORD_LENGTH = 6;
    private static final int MIN_NAME_LENGTH = 2;

    private ValidationUtil() {
        // Prevent instantiation of utility class
    }

    /**
     * Validates user full name using Java String handling methods.
     *
     * @param name input name
     * @return trimmed and sanitized name
     * @throws InvalidInputException if name is null, blank, or too short
     */
    public static String validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new InvalidInputException("Full name cannot be blank or empty.");
        }
        String sanitized = name.trim();
        if (sanitized.length() < MIN_NAME_LENGTH) {
            throw new InvalidInputException("Name must contain at least " + MIN_NAME_LENGTH + " characters.");
        }
        if (sanitized.length() > 60) {
            throw new InvalidInputException("Name cannot exceed 60 characters.");
        }
        return sanitized;
    }

    /**
     * Validates email address using Java String operations and regular expressions.
     *
     * @param email input email
     * @return trimmed, lowercase normalized email
     * @throws InvalidInputException if email is null, empty, or fails syntax check
     */
    public static String validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new InvalidInputException("Email address is required and cannot be blank.");
        }
        String normalized = email.trim().toLowerCase();
        if (!EMAIL_PATTERN.matcher(normalized).matches()) {
            throw new InvalidInputException("Invalid email format. Please provide a valid address (e.g., student@university.edu).");
        }
        return normalized;
    }

    /**
     * Validates password strength and format.
     *
     * @param password input password string
     * @return unchanged validated password
     * @throws InvalidInputException if password is null or below minimum length
     */
    public static String validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            throw new InvalidInputException("Password cannot be empty.");
        }
        if (password.length() < MIN_PASSWORD_LENGTH) {
            throw new InvalidInputException("Password must be at least " + MIN_PASSWORD_LENGTH + " characters long.");
        }
        return password;
    }

    /**
     * Validates all registration parameters combined.
     */
    public static void validateRegistrationInputs(String name, String email, String password) {
        validateName(name);
        validateEmail(email);
        validatePassword(password);
    }

    /**
     * Validates login credentials format.
     */
    public static void validateLoginInputs(String email, String password) {
        validateEmail(email);
        validatePassword(password);
    }
}
