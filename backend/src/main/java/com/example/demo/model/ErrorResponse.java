package com.example.demo.model;

public class ErrorResponse {
    private int statusCode;
    private String message;
    private String details;
    private Exception exception;

    // Constructors
    public ErrorResponse() {}

    public ErrorResponse(int statusCode, String message, Exception exception) {
        this.statusCode = statusCode;
        this.message = message;
        this.details = exception.getMessage();
        this.exception = exception;
        
        System.out.println(exception);
    }

    // Getters and Setters
    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getDetails() {
    	return details;
    }
    
    public void setDetails(String details) {
    	this.details = details;
    }

    public Exception getException() {
        return exception;
    }

    public void setException(Exception exception) {
        this.exception = exception;
    }
}
