package ems.iocl.Backend.entity;


import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emp_id")
    private Long empId;

    @Column(name = "emp_no", unique = true)
    private String empNo;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @OneToOne(mappedBy = "employee", cascade = CascadeType.ALL)
    private EmployeeProfile employeeProfile;

    @OneToOne(mappedBy = "employee", cascade = CascadeType.ALL)
    private EmployeeJob employeeJob;

    @OneToOne(mappedBy = "employee", cascade = CascadeType.ALL)
    private EmployeeContact employeeContact;

    @OneToOne(mappedBy = "employee", cascade = CascadeType.ALL)
    private EmployeeStatus employeeStatus;

    @OneToMany(mappedBy = "receiver")
    private Set<BirthdayMessage> receivedBirthdayMessages = new HashSet<>();

    @OneToMany(mappedBy = "sender")
    private Set<BirthdayMessage> sentBirthdayMessages = new HashSet<>();

    @OneToMany(mappedBy = "employee")
    private Set<BirthdaySeen> birthdaySeenRecords = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "Emp_App",
            joinColumns = @JoinColumn(name = "emp_id"),
            inverseJoinColumns = @JoinColumn(name = "app_id")
    )
    private Set<Application> applications = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "Emp_Res",
            joinColumns = @JoinColumn(name = "emp_id"),
            inverseJoinColumns = @JoinColumn(name = "res_id")
    )
    private Set<Resources> resources = new HashSet<>();

    // Constructors
    public Employee() {
    }

    public Employee(String empNo, String firstName, String lastName) {
        this.empNo = empNo;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and Setters
    public Long getEmpId() {
        return empId;
    }

    public void setEmpId(Long empId) {
        this.empId = empId;
    }

    public String getEmpNo() {
        return empNo;
    }

    public void setEmpNo(String empNo) {
        this.empNo = empNo;
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

    public EmployeeProfile getEmployeeProfile() {
        return employeeProfile;
    }

    public void setEmployeeProfile(EmployeeProfile employeeProfile) {
        this.employeeProfile = employeeProfile;
    }

    public EmployeeJob getEmployeeJob() {
        return employeeJob;
    }

    public void setEmployeeJob(EmployeeJob employeeJob) {
        this.employeeJob = employeeJob;
    }

    public EmployeeContact getEmployeeContact() {
        return employeeContact;
    }

    public void setEmployeeContact(EmployeeContact employeeContact) {
        this.employeeContact = employeeContact;
    }

    public EmployeeStatus getEmployeeStatus() {
        return employeeStatus;
    }

    public void setEmployeeStatus(EmployeeStatus employeeStatus) {
        this.employeeStatus = employeeStatus;
    }

    public Set<Application> getApplications() {
        return applications;
    }

    public void setApplications(Set<Application> applications) {
        this.applications = applications;
    }

    public Set<Resources> getResources() {
        return resources;
    }

    public void setResources(Set<Resources> resources) {
        this.resources = resources;
    }

    public Set<BirthdayMessage> getReceivedBirthdayMessages() {
        return receivedBirthdayMessages;
    }

    public void setReceivedBirthdayMessages(Set<BirthdayMessage> receivedBirthdayMessages) {
        this.receivedBirthdayMessages = receivedBirthdayMessages;
    }

    public Set<BirthdayMessage> getSentBirthdayMessages() {
        return sentBirthdayMessages;
    }

    public void setSentBirthdayMessages(Set<BirthdayMessage> sentBirthdayMessages) {
        this.sentBirthdayMessages = sentBirthdayMessages;
    }

    public Set<BirthdaySeen> getBirthdaySeenRecords() {
        return birthdaySeenRecords;
    }

    public void setBirthdaySeenRecords(Set<BirthdaySeen> birthdaySeenRecords) {
        this.birthdaySeenRecords = birthdaySeenRecords;
    }

}
