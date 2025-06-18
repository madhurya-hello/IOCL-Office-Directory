package ems.iocl.Backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "request_state")
public class RequestState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "emp_id")
    private Long empId;

    @Column(name = "r_status")
    private String status;

    @Column(name = "r_message")
    private String message;

    // Constructors
    public RequestState() {
    }

    public RequestState(Long empId, String status, String message) {
        this.empId = empId;
        this.status = status;
        this.message = message;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmpId() {
        return empId;
    }

    public void setEmpId(Long empId) {
        this.empId = empId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}