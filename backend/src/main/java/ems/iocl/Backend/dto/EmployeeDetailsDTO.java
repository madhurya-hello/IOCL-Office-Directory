package ems.iocl.Backend.dto;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeeDetailsDTO {
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
    private LocalDate birthDate;
    private String bloodGroup;
    private String parentDivision;
    private String city;
    private double workingHours;
    private String collarWorker;
    private String workSchedule;
    private String email;
    private String phone;
    private String address;
    private boolean isAdmin;
    private String password;
    private String status;
    private boolean logged;
    private LocalDateTime lastLogged;


    public EmployeeDetailsDTO(String empNo, String title, String firstName, String lastName,
                              String gender, String location, String function, String subgroupCode,
                              String subgroup, String designation, LocalDate birthDate,
                              String bloodGroup, String parentDivision, String city,
                              double workingHours, String collarWorker, String workSchedule,
                              String email, String phone, String address, boolean isAdmin,
                              String password, String status) {
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
        this.isAdmin = isAdmin;
        this.password = password;
        this.status = status;
    }

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

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
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

    public double getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(double workingHours) {
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

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
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

    public boolean isLogged() {
        return logged;
    }

    public void setLogged(boolean logged) {
        this.logged = logged;
    }

    public LocalDateTime getLastLogged() {
        return lastLogged;
    }

    public void setLastLogged(LocalDateTime lastLogged) {
        this.lastLogged = lastLogged;
    }
}