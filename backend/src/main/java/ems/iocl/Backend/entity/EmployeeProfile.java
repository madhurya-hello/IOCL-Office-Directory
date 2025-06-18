package ems.iocl.Backend.entity;


import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "EmployeeProfile")
public class EmployeeProfile {
    @Id
    @Column(name = "emp_id")
    private Long empId;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "gender")
    private String gender;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "emp_photo_link")
    private String empPhotoLink;

    @OneToOne
    @MapsId
    @JoinColumn(name = "emp_id")
    private Employee employee;

    // Constructors, Getters and Setters
    public EmployeeProfile() {
    }

    public EmployeeProfile(LocalDate birthDate, String gender, String bloodGroup, String empPhotoLink) {
        this.birthDate = birthDate;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.empPhotoLink = empPhotoLink;
    }

    public Long getEmpId() {
        return empId;
    }

    public void setEmpId(Long empId) {
        this.empId = empId;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getEmpPhotoLink() {
        return empPhotoLink;
    }

    public void setEmpPhotoLink(String empPhotoLink) {
        this.empPhotoLink = empPhotoLink;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
