package ems.iocl.Backend.dto;

public class ForgotPasswordDTO {
    private Long empId;
    private String newPassword;

    // Getters and Setters
    public Long getEmpId() { return empId; }
    public void setEmpId(Long empId) { this.empId = empId; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}