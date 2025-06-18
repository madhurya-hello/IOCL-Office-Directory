package ems.iocl.Backend.dto;

public class DivisionEmployeeCountDTO {
    private String division;
    private long noOfEmployees;

    public DivisionEmployeeCountDTO(String division, long noOfEmployees) {
        this.division = division;
        this.noOfEmployees = noOfEmployees;
    }

    // Getters and Setters
    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public long getNoOfEmployees() {
        return noOfEmployees;
    }

    public void setNoOfEmployees(long noOfEmployees) {
        this.noOfEmployees = noOfEmployees;
    }
}