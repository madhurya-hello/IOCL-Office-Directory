package ems.iocl.Backend.entity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "Application")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "app_id")
    private Long appId;

    @Column(name = "app_name")
    private String appName;

    @Column(name = "app_logo_link")
    private String appLogoLink;

    @ManyToMany(mappedBy = "applications")
    private Set<Employee> employees;

    // Constructors
    public Application() {
        // Default constructor required by JPA
    }

    public Application(String appName, String appLogoLink) {
        this.appName = appName;
        this.appLogoLink = appLogoLink;
    }

    public Application(Long appId, String appName, String appLogoLink, Set<Employee> employees) {
        this.appId = appId;
        this.appName = appName;
        this.appLogoLink = appLogoLink;
        this.employees = employees;
    }

    // Getters and Setters
    public Long getAppId() {
        return appId;
    }

    public void setAppId(Long appId) {
        this.appId = appId;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getAppLogoLink() {
        return appLogoLink;
    }

    public void setAppLogoLink(String appLogoLink) {
        this.appLogoLink = appLogoLink;
    }

    public Set<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(Set<Employee> employees) {
        this.employees = employees;
    }


    @Override
    public String toString() {
        return "Application{" +
                "appId=" + appId +
                ", appName='" + appName + '\'' +
                ", appLogoLink='" + appLogoLink + '\'' +
                '}';
    }
}