package ems.iocl.Backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "EmployeeJob")
public class EmployeeJob {
    @Id
    @Column(name = "emp_id")
    private Long empId;

    @Column(name = "title")
    private String title;

    @Column(name = "designation")
    private String designation;

    @Column(name = "job_function")
    private String function;

    @Column(name = "subgroup_code")
    private String subgroupCode;

    @Column(name = "subgroup")
    private String subgroup;

    @Column(name = "parent_division")
    private String parentDivision;

    @Column(name = "location")
    private String location;

    @Column(name = "city")
    private String city;

    @Column(name = "isAdmin")
    private boolean isAdmin;

    @Column(name = "password")
    private String password;

    @OneToOne
    @MapsId
    @JoinColumn(name = "emp_id")
    private Employee employee;

    // Constructors
    public EmployeeJob() {
        // Default constructor required by JPA
    }

    public EmployeeJob(String title, String designation, String function, String subgroupCode,
                       String subgroup, String parentDivision, String location, String city,
                       boolean isAdmin, String password) {
        this.title = title;
        this.designation = designation;
        this.function = function;
        this.subgroupCode = subgroupCode;
        this.subgroup = subgroup;
        this.parentDivision = parentDivision;
        this.location = location;
        this.city = city;
        this.isAdmin = isAdmin;
        this.password = password;
    }

    public EmployeeJob(Long empId, String title, String designation, String function,
                       String subgroupCode, String subgroup, String parentDivision,
                       String location, String city, boolean isAdmin, String password,
                       Employee employee) {
        this.empId = empId;
        this.title = title;
        this.designation = designation;
        this.function = function;
        this.subgroupCode = subgroupCode;
        this.subgroup = subgroup;
        this.parentDivision = parentDivision;
        this.location = location;
        this.city = city;
        this.isAdmin = isAdmin;
        this.password = password;
        this.employee = employee;
    }

    // Getters and Setters
    public Long getEmpId() {
        return empId;
    }

    public void setEmpId(Long empId) {
        this.empId = empId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getFunction() {
        return function;
    }

    public void setFunction(String function) {
        this.function = function;
    }

    public String getSubgroupCode() {
        return subgroupCode;
    }

    public void setSubgroupCode(String subgroupCode) {
        this.subgroupCode = subgroupCode;
    }

    public String getSubgroup() {
        return subgroup;
    }

    public void setSubgroup(String subgroup) {
        this.subgroup = subgroup;
    }

    public String getParentDivision() {
        return parentDivision;
    }

    public void setParentDivision(String parentDivision) {
        this.parentDivision = parentDivision;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }


    @Override
    public String toString() {
        return "EmployeeJob{" +
                "empId=" + empId +
                ", title='" + title + '\'' +
                ", designation='" + designation + '\'' +
                ", function='" + function + '\'' +
                ", subgroupCode='" + subgroupCode + '\'' +
                ", subgroup='" + subgroup + '\'' +
                ", parentDivision='" + parentDivision + '\'' +
                ", location='" + location + '\'' +
                ", city='" + city + '\'' +
                ", isAdmin=" + isAdmin +
                '}';
    }
}