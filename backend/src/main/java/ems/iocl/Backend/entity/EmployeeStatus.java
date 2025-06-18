package ems.iocl.Backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "EmployeeStatus")
public class EmployeeStatus {
    @Id
    @Column(name = "emp_id")
    private Long empId;

    @Column(name = "collar_worker")
    private String collarWorker;

    @Column(name = "work_schedule")
    private String workSchedule;

    @Column(name = "working_hours")
    private String workingHours;

    @Column(name = "status")
    private String status;

    @Column(name = "isDeleted")
    private boolean isDeleted;

    @Column(name = "deleted_on")
    private LocalDate deletedOn;

    @Column(name = "otp")
    private String otp;

    @Column(name = "otp_expiry")
    private LocalDateTime otpExpiry;

    @Column(name = "logged")
    private boolean logged;

    @Column(name = "last_logged")
    private LocalDateTime lastLogged;

    @OneToOne
    @MapsId
    @JoinColumn(name = "emp_id")
    private Employee employee;

    // Constructors
    public EmployeeStatus() {
        // Default constructor required by JPA
    }

    public EmployeeStatus(String collarWorker, String workSchedule, String workingHours, String status, boolean isDeleted) {
        this.collarWorker = collarWorker;
        this.workSchedule = workSchedule;
        this.workingHours = workingHours;
        this.status = status;
        this.isDeleted = isDeleted;
    }

    public EmployeeStatus(Long empId, String collarWorker, String workSchedule, String workingHours, String status, boolean isDeleted, Employee employee) {
        this.empId = empId;
        this.collarWorker = collarWorker;
        this.workSchedule = workSchedule;
        this.workingHours = workingHours;
        this.status = status;
        this.isDeleted = isDeleted;
        this.employee = employee;
    }

    // Getters and Setters
    public Long getEmpId() {
        return empId;
    }

    public void setEmpId(Long empId) {
        this.empId = empId;
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

    public String getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(String workingHours) {
        this.workingHours = workingHours;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public LocalDate getDeletedOn() {
        return deletedOn;
    }

    public void setDeletedOn(LocalDate deletedOn) {
        this.deletedOn = deletedOn;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(LocalDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
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

    @Override
    public String toString() {
        return "EmployeeStatus{" +
                "empId=" + empId +
                ", collarWorker='" + collarWorker + '\'' +
                ", workSchedule='" + workSchedule + '\'' +
                ", workingHours='" + workingHours + '\'' +
                ", status='" + status + '\'' +
                ", isDeleted=" + isDeleted +
                '}';
    }
}
