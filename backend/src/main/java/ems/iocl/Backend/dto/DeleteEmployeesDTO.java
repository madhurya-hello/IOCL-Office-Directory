package ems.iocl.Backend.dto;

import java.util.List;

public class DeleteEmployeesDTO {
    private List<Long> ids;

    // Getters and Setters
    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }
}