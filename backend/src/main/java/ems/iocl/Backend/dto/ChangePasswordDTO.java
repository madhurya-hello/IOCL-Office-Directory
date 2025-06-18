package ems.iocl.Backend.dto;

public class ChangePasswordDTO {
    private String current;
    private String newPassword;

    // Getters and setters
    public String getCurrent() {
        return current;
    }

    public void setCurrent(String current) {
        this.current = current;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}