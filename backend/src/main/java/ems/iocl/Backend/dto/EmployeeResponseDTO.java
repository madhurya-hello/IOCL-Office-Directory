package ems.iocl.Backend.dto;

import java.time.LocalDate;

public class EmployeeResponseDTO {
    private Long id;
    private String empId;
    private String name;
    private String email;
    private String designation;
    private String division;
    private String function;
    private String workerType;
    private String avatarColor;
    private String phone;
    private String gender;
    private LocalDate dob;
    private String address;
    private String city;
    private String location;
    private String subgroup;
    private String subgroupCode;
    private String title;
    private String bloodGroup;
    private String workSchedule;
    private String workingHours;

    // Constructor
    public EmployeeResponseDTO(
            Long id,
            String empId,
            String name,
            String email,
            String designation,
            String division,
            String function,
            String workerType,
            String avatarColor,
            String phone,
            String gender,
            LocalDate dob,
            String address,
            String city,
            String location,
            String subgroup,
            String subgroupCode,
            String title,
            String bloodGroup,
            String workSchedule,
            String workingHours) {
        this.id = id;
        this.empId = empId;
        this.name = name;
        this.email = email;
        this.designation = designation;
        this.division = division;
        this.function = function;
        this.workerType = workerType;
        this.avatarColor = avatarColor;
        this.phone = phone;
        this.gender = gender;
        this.dob = dob;
        this.address = address;
        this.city = city;
        this.location = location;
        this.subgroup = subgroup;
        this.subgroupCode = subgroupCode;
        this.title = title;
        this.bloodGroup = bloodGroup;
        this.workSchedule = workSchedule;
        this.workingHours = workingHours;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
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

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getFunction() {
        return function;
    }

    public void setFunction(String function) {
        this.function = function;
    }

    public String getWorkerType() {
        return workerType;
    }

    public void setWorkerType(String workerType) {
        this.workerType = workerType;
    }

    public String getAvatarColor() {
        return avatarColor;
    }

    public void setAvatarColor(String avatarColor) {
        this.avatarColor = avatarColor;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSubgroup() {
        return subgroup;
    }

    public void setSubgroup(String subgroup) {
        this.subgroup = subgroup;
    }

    public String getSubgroupCode() {
        return subgroupCode;
    }

    public void setSubgroupCode(String subgroupCode) {
        this.subgroupCode = subgroupCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getWorkSchedule() {
        return workSchedule;
    }

    public void setWorkSchedule(String workSchedule) {
        this.workSchedule = workSchedule;
    }

    public String getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(String workingHours) {
        this.workingHours = workingHours;
    }
}