package ems.iocl.Backend.dto;

import java.time.LocalDate;

public class EmployeeBirthdayDTO {
    private Long id;  // Add this field
    private String name;
    private String email;
    private LocalDate birthDate;
    private String photoLink;

    public EmployeeBirthdayDTO(Long id, String name, String email, LocalDate birthDate, String photoLink) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.birthDate = birthDate;
        this.photoLink = photoLink;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getPhotoLink() {
        return photoLink;
    }

    public void setPhotoLink(String photoLink) {
        this.photoLink = photoLink;
    }
}