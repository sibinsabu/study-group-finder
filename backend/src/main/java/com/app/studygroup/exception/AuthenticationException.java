package com.app.studygroup.exception;

/**
 * Exception thrown when authentication fails due to incorrect credentials
 * or non-existent user account.
 * Addresses Phase 2: Structured Programming and Reliability.
 */
public class AuthenticationException extends RuntimeException {
    public AuthenticationException(String message) {
        super(message);
    }

    public AuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}
