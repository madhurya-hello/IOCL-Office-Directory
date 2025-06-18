package ems.iocl.Backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "birthday_seen")
public class BirthdaySeen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "emp_id", referencedColumnName = "emp_id", nullable = false)
    private Employee employee;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    // Constructors
    public BirthdaySeen() {
    }

    public BirthdaySeen(Employee employee, LocalDate birthDate, LocalDate expiryDate) {
        this.employee = employee;
        this.birthDate = birthDate;
        this.expiryDate = expiryDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }
}