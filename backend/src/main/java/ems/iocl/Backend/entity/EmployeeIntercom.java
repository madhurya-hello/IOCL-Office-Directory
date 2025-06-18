package ems.iocl.Backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "employee_intercom")
public class EmployeeIntercom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "emp_no", nullable = false, unique = true)
    private String empNo;

    @Column(name = "intercom")
    private Integer intercom;

    @Column(name = "grade")
    private String grade;

    @Column(name = "floor")
    private Integer floor;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "designation")
    private String designation;

    @Column(name = "parent_division")
    private String parentDivision;

    @Column(name = "job_function")
    private String function;

    @Column(name = "collar_worker")
    private String collarWorker;

    @Column(name = "phone")
    private String phone;

    @Column(name = "location")
    private String location;

    @Column(name = "status")
    private String status;

    // Constructors
    public EmployeeIntercom() {
    }

    public EmployeeIntercom(String empNo) {
        this.empNo = empNo;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmpNo() {
        return empNo;
    }

    public void setEmpNo(String empNo) {
        this.empNo = empNo;
    }

    public Integer getIntercom() {
        return intercom;
    }

    public void setIntercom(Integer intercom) {
        this.intercom = intercom;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getParentDivision() {
        return parentDivision;
    }

    public void setParentDivision(String parentDivision) {
        this.parentDivision = parentDivision;
    }

    public String getFunction() {
        return function;
    }

    public void setFunction(String function) {
        this.function = function;
    }

    public String getCollarWorker() {
        return collarWorker;
    }

    public void setCollarWorker(String collarWorker) {
        this.collarWorker = collarWorker;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}