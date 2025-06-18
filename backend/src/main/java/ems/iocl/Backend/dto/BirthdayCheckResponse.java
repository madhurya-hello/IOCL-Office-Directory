package ems.iocl.Backend.dto;

public class BirthdayCheckResponse {
    private boolean isBirthday;

    public BirthdayCheckResponse(boolean isBirthday) {
        this.isBirthday = isBirthday;
    }

    // Getters and Setters
    public boolean isBirthday() {
        return isBirthday;
    }

    public void setBirthday(boolean birthday) {
        isBirthday = birthday;
    }
}