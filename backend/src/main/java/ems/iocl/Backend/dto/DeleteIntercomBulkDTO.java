package ems.iocl.Backend.dto;

import java.util.List;

public class DeleteIntercomBulkDTO {
    private List<Long> ids;

    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }
}
