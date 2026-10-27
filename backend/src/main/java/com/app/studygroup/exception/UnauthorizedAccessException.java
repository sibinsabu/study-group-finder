package com.app.studygroup.exception;

/**
 * Exception thrown when an unauthenticated request attempts to access protected pages/resources.
 * Addresses Phase 4: Restrict dashboard access without login.
 */
public class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException(String message) {
        super(message);
    }

    public UnauthorizedAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
