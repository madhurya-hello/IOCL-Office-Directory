package ems.iocl.Backend.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class EmployeeRequestsDTO {
    private Long requestId;
    private Long empId;
    private String empNo;
    private String name;
    private String requestDate; // Changed to String
    private String mobile;
    private String email;
    private String message;

    // Update constructor
    public EmployeeRequestsDTO(Long requestId, Long empId, String empNo, String name,
                               LocalDateTime requestDate, String mobile, String email,
                               String message) {
        this.requestId = requestId;
        this.empId = empId;
        this.empNo = empNo;
        this.name = name;
        this.requestDate = formatDateTime(requestDate);
        this.mobile = mobile;
        this.email = email;
        this.message = message;
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a");
        return dateTime.format(formatter);
    }

    // Getters and setters
    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public Long getEmpId() {
        return empId;
    }

    public void setEmpId(Long empId) {
        this.empId = empId;
    }

    public String getEmpNo() {
        return empNo;
    }

    public void setEmpNo(String empNo) {
        this.empNo = empNo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(String requestDate) {
        this.requestDate = requestDate;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}