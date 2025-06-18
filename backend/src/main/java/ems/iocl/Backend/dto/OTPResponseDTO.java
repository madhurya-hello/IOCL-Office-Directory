package ems.iocl.Backend.dto;

public class OTPResponseDTO {
    private Long empId;
    private String message;
    private String status;

    // Constructors
    public OTPResponseDTO() {}

    public OTPResponseDTO(Long empId, String message, String status) {
        this.empId = empId;
        this.message = message;
        this.status = status;
    }

    // Getters and Setters
    public Long getEmpId() { return empId; }
    public void setEmpId(Long empId) { this.empId = empId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}