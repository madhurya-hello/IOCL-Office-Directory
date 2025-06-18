package ems.iocl.Backend.dto;

public class RequestStatusDTO {
    private Long emp_id;
    private String r_status;
    private String r_message;

    // Getters and Setters
    public Long getEmp_id() {
        return emp_id;
    }

    public void setEmp_id(Long emp_id) {
        this.emp_id = emp_id;
    }

    public String getR_status() {
        return r_status;
    }

    public void setR_status(String r_status) {
        this.r_status = r_status;
    }

    public String getR_message() {
        return r_message;
    }

    public void setR_message(String r_message) {
        this.r_message = r_message;
    }
}