package com.example.hackathon.exception;

import com.example.hackathon.dto.ApiErrorDto;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiErrorDto> handleResourceNotFound(ResourceNotFoundException ex) {
		return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	@ExceptionHandler(InsufficientStockException.class)
	public ResponseEntity<ApiErrorDto> handleInsufficientStock(InsufficientStockException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@ExceptionHandler(ConflictException.class)
	public ResponseEntity<ApiErrorDto> handleConflict(ConflictException ex) {
		return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiErrorDto> handleValidation(MethodArgumentNotValidException ex) {
		String message = ex.getBindingResult().getFieldErrors().stream()
				.map(FieldError::getDefaultMessage)
				.collect(Collectors.joining(", "));
		return buildResponse(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiErrorDto> handleGeneric(Exception ex) {
		return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur interne");
	}

	private ResponseEntity<ApiErrorDto> buildResponse(HttpStatus status, String message) {
		ApiErrorDto body = ApiErrorDto.builder()
				.message(message)
				.error(status.getReasonPhrase())
				.status(status.value())
				.build();
		return ResponseEntity.status(status).body(body);
	}
}
