package ems.iocl.Backend.dto;

public class LoginResponseDTO {
    private String name;
    private String email;
    private String password; // Note: Be careful with returning passwords!
    private String photoLink;

    // Constructor
    public LoginResponseDTO(String name, String email, String password, String photoLink) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.photoLink = photoLink;
    }

    // Getters and Setters
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhotoLink() {
        return photoLink;
    }

    public void setPhotoLink(String photoLink) {
        this.photoLink = photoLink;
    }
}