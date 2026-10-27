package com.app.studygroup.exception;

import com.app.studygroup.dto.AuthResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Centralized exception handler for REST controllers.
 * Addresses Phase 2: Structured Programming and Reliability
 * (Implement exception handling for invalid inputs).
 */
@RestControllerAdvice(basePackages = "com.app.studygroup.controller")
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<AuthResponse> handleInvalidInput(InvalidInputException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                AuthResponse.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .user(null)
                        .build()
        );
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<AuthResponse> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                AuthResponse.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .user(null)
                        .build()
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<AuthResponse> handleAuthenticationError(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                AuthResponse.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .user(null)
                        .build()
        );
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<AuthResponse> handleUnauthorizedAccess(UnauthorizedAccessException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                AuthResponse.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .user(null)
                        .build()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AuthResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        String firstError = errors.values().stream().findFirst().orElse("Validation failed.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                AuthResponse.builder()
                        .success(false)
                        .message(firstError)
                        .user(null)
                        .build()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AuthResponse> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                AuthResponse.builder()
                        .success(false)
                        .message("An unexpected error occurred: " + ex.getMessage())
                        .user(null)
                        .build()
        );
    }
}
