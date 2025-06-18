package ems.iocl.Backend.entity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "Resources")
public class Resources {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "res_id")
    private Long resId;

    @Column(name = "res_name")
    private String resName;

    @Column(name = "res_logo_link")
    private String resLogoLink;

    @ManyToMany(mappedBy = "resources")
    private Set<Employee> employees;

    // Constructors
    public Resources() {
        // Default constructor
    }

    public Resources(String resName, String resLogoLink) {
        this.resName = resName;
        this.resLogoLink = resLogoLink;
    }

    public Resources(Long resId, String resName, String resLogoLink, Set<Employee> employees) {
        this.resId = resId;
        this.resName = resName;
        this.resLogoLink = resLogoLink;
        this.employees = employees;
    }

    // Getters and Setters
    public Long getResId() {
        return resId;
    }

    public void setResId(Long resId) {
        this.resId = resId;
    }

    public String getResName() {
        return resName;
    }

    public void setResName(String resName) {
        this.resName = resName;
    }

    public String getResLogoLink() {
        return resLogoLink;
    }

    public void setResLogoLink(String resLogoLink) {
        this.resLogoLink = resLogoLink;
    }

    public Set<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(Set<Employee> employees) {
        this.employees = employees;
    }

    @Override
    public String toString() {
        return "Resources{" +
                "resId=" + resId +
                ", resName='" + resName + '\'' +
                ", resLogoLink='" + resLogoLink + '\'' +
                '}';
    }
}