package ems.iocl.Backend.dto;

import java.time.LocalDateTime;

public class EmployeeRequestDetailsDTO {
    private String empNo;
    private String title;
    private String firstName;
    private String lastName;
    private String gender;
    private String location;
    private String function;
    private String subgroupCode;
    private String subgroup;
    private String designation;
    private String birthDate;
    private String bloodGroup;
    private String parentDivision;
    private String city;
    private Double workingHours;
    private String collarWorker;
    private String workSchedule;
    private String email;
    private String phone;
    private String address;
    private String password;
    private String status;
    private boolean admin;
    private LocalDateTime lastLogged;
    private String message;

    // Constructor
    public EmployeeRequestDetailsDTO(String empNo, String title, String firstName, String lastName,
                                     String gender, String location, String function, String subgroupCode,
                                     String subgroup, String designation, String birthDate, String bloodGroup,
                                     String parentDivision, String city, Double workingHours, String collarWorker,
                                     String workSchedule, String email, String phone, String address,
                                     String password, String status, boolean admin, LocalDateTime lastLogged, String message) {
        this.empNo = empNo;
        this.title = title;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.location = location;
        this.function = function;
        this.subgroupCode = subgroupCode;
        this.subgroup = subgroup;
        this.designation = designation;
        this.birthDate = birthDate;
        this.bloodGroup = bloodGroup;
        this.parentDivision = parentDivision;
        this.city = city;
        this.workingHours = workingHours;
        this.collarWorker = collarWorker;
        this.workSchedule = workSchedule;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.password = password;
        this.status = status;
        this.admin = admin;
        this.lastLogged = lastLogged;
        this.message = message;
    }

    // Getters and Setters
    public String getEmpNo() {
        return empNo;
    }

    public void setEmpNo(String empNo) {
        this.empNo = empNo;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getParentDivision() {
        return parentDivision;
    }

    public void setParentDivision(String parentDivision) {
        this.parentDivision = parentDivision;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Double getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(Double workingHours) {
        this.workingHours = workingHours;
    }

    public String getCollarWorker() {
        return collarWorker;
    }

    public void setCollarWorker(String collarWorker) {
        this.collarWorker = collarWorker;
    }

    public String getWorkSchedule() {
        return workSchedule;
    }

    public void setWorkSchedule(String workSchedule) {
        this.workSchedule = workSchedule;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public LocalDateTime getLastLogged() {
        return lastLogged;
    }

    public void setLastLogged(LocalDateTime lastLogged) {
        this.lastLogged = lastLogged;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
