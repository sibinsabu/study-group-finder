package com.app.studygroup.exception;

/**
 * Exception thrown when user input fails client or server-side validation checks
 * (e.g. empty fields, invalid email format, weak password).
 * Addresses Phase 2: Exception handling for invalid inputs.
 */
public class InvalidInputException extends RuntimeException {
    public InvalidInputException(String message) {
        super(message);
    }

    public InvalidInputException(String message, Throwable cause) {
        super(message, cause);
    }
}
