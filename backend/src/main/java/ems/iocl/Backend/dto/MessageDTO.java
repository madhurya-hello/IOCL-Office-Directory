package ems.iocl.Backend.dto;

import java.time.LocalDateTime;

public class MessageDTO {
    private String message;
    private LocalDateTime timestamp;

    // Constructors
    public MessageDTO() {
    }

    public MessageDTO(String message, LocalDateTime timestamp) {
        this.message = message;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}