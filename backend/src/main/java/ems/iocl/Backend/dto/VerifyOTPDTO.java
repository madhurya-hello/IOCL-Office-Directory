package ems.iocl.Backend.dto;

public class VerifyOTPDTO {
    private Long empId;
    private String otp;

    // Getters and Setters
    public Long getEmpId() { return empId; }
    public void setEmpId(Long empId) { this.empId = empId; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
