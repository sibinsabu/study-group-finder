package com.app.studygroup.exception;

/**
 * Exception thrown when a user attempts to register with an email/username that is already in use.
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }

    public UserAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
