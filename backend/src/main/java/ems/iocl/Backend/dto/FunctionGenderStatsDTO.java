// Create a new file FunctionGenderStatsDTO.java
package ems.iocl.Backend.dto;

public class FunctionGenderStatsDTO {
    private String function;
    private long noOfMales;
    private long noOfFemales;

    public FunctionGenderStatsDTO(String function, long noOfMales, long noOfFemales) {
        this.function = function;
        this.noOfMales = noOfMales;
        this.noOfFemales = noOfFemales;
    }

    // Getters and Setters
    public String getFunction() {
        return function;
    }

    public void setFunction(String function) {
        this.function = function;
    }

    public long getNoOfMales() {
        return noOfMales;
    }

    public void setNoOfMales(long noOfMales) {
        this.noOfMales = noOfMales;
    }

    public long getNoOfFemales() {
        return noOfFemales;
    }

    public void setNoOfFemales(long noOfFemales) {
        this.noOfFemales = noOfFemales;
    }
}
