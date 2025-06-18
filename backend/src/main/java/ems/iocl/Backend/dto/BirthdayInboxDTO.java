package ems.iocl.Backend.dto;

import java.time.LocalDateTime;

public class BirthdayInboxDTO {
    private Long empId;
    private String name;
    private String message;
    private LocalDateTime timestamp;
    private int unreadCount;

    // Constructors
    public BirthdayInboxDTO() {
    }

    public BirthdayInboxDTO(Long empId, String name, String message, LocalDateTime timestamp, int unreadCount) {
        this.empId = empId;
        this.name = name;
        this.message = message;
        this.timestamp = timestamp;
        this.unreadCount = unreadCount;
    }

    // Getters and Setters
    public Long getEmpId() {
        return empId;
    }

    public void setEmpId(Long empId) {
        this.empId = empId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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

    public int getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(int unreadCount) {
        this.unreadCount = unreadCount;
    }
}