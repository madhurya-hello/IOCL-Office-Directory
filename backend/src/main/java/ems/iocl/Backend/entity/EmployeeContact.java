package ems.iocl.Backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "EmployeeContact")
public class EmployeeContact {
    @Id
    @Column(name = "emp_id")
    private Long empId;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @OneToOne
    @MapsId
    @JoinColumn(name = "emp_id")
    private Employee employee;

    // Constructors
    public EmployeeContact() {
        // Default constructor required by JPA
    }

    public EmployeeContact(String email, String phone, String address) {
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    public EmployeeContact(Long empId, String email, String phone, String address, Employee employee) {
        this.empId = empId;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.employee = employee;
    }

    // Getters and Setters
    public Long getEmpId() {
        return empId;
    }

    public void setEmpId(Long empId) {
        this.empId = empId;
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

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    // toString() method
    @Override
    public String toString() {
        return "EmployeeContact{" +
                "empId=" + empId +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                '}'; // Excluding employee to avoid circular references
    }
}
