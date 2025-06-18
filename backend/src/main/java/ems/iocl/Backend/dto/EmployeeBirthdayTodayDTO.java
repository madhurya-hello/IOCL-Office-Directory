package ems.iocl.Backend.dto;

public class EmployeeBirthdayTodayDTO {
    private Long empId;
    private String name;
    private String phone;
    private String email;

    // Constructors
    public EmployeeBirthdayTodayDTO() {
    }

    public EmployeeBirthdayTodayDTO(Long empId, String name, String phone, String email) {
        this.empId = empId;
        this.name = name;
        this.phone = phone;
        this.email = email;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
