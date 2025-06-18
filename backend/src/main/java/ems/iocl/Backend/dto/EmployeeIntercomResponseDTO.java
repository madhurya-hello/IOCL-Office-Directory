package ems.iocl.Backend.dto;

public class EmployeeIntercomResponseDTO {
    private Long id;
    private String empNo;
    private String name;
    private String email;
    private String designation;
    private String division;
    private String function;
    private String workerType;
    private String phone;
    private String grade;
    private Integer floor;
    private String location;
    private Integer intercom;
    private String status;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmpNo() { return empNo; }
    public void setEmpNo(String empNo) { this.empNo = empNo; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getDivision() { return division; }
    public void setDivision(String division) { this.division = division; }
    public String getFunction() { return function; }
    public void setFunction(String function) { this.function = function; }
    public String getWorkerType() { return workerType; }
    public void setWorkerType(String workerType) { this.workerType = workerType; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Integer getIntercom() { return intercom; }
    public void setIntercom(Integer intercom) { this.intercom = intercom; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}