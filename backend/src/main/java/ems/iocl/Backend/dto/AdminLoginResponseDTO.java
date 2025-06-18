package ems.iocl.Backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AdminLoginResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String photoLink;

    @JsonProperty("isAdmin")
    private boolean admin;

    // Constructor
    public AdminLoginResponseDTO(Long id, String name, String email, String photoLink, boolean admin) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.photoLink = photoLink;
        this.admin = admin;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhotoLink() { return photoLink; }
    public void setPhotoLink(String photoLink) { this.photoLink = photoLink; }

    @JsonProperty("isAdmin")
    public boolean isAdmin() { return admin; }

    public void setAdmin(boolean admin) { this.admin = admin; }
}