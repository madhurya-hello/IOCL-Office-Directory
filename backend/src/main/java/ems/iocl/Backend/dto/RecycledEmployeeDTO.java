package ems.iocl.Backend.dto;

import java.time.LocalDate;

public class RecycledEmployeeDTO {
    private Long id;
    private String empNo;
    private String name;
    private LocalDate deletedOn;
    private String designation;
    private String type;
    private boolean selected;

    // Constructor
    public RecycledEmployeeDTO(Long id, String empNo, String name, LocalDate deletedOn,
                               String designation, String type) {
        this.id = id;
        this.empNo = empNo;
        this.name = name;
        this.deletedOn = deletedOn;
        this.designation = designation;
        this.type = type;
        this.selected = false;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getEmpNo() {
        return empNo;
    }

    public String getName() {
        return name;
    }

    public LocalDate getDeletedOn() {
        return deletedOn;
    }

    public String getDesignation() {
        return designation;
    }

    public String getType() {
        return type;
    }

    public boolean isSelected() {
        return selected;
    }
}
