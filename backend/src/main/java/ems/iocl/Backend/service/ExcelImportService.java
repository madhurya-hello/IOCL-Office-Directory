package ems.iocl.Backend.service;

import ems.iocl.Backend.dto.EmployeeCreateDTO;
import ems.iocl.Backend.entity.Employee;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class ExcelImportService {

    @Autowired
    private EmployeeService employeeService;

    public List<Employee> importEmployeesFromExcel(MultipartFile file) throws IOException {
        List<EmployeeCreateDTO> employeeDTOs = parseExcelFile(file);
        List<Employee> createdEmployees = new ArrayList<>();

        int batchSize = 50;
        for (int i = 0; i < employeeDTOs.size(); i += batchSize) {
            List<EmployeeCreateDTO> batch = employeeDTOs.subList(i, Math.min(i + batchSize, employeeDTOs.size()));

            for (EmployeeCreateDTO dto : batch) {
                try {
                    Employee employee = employeeService.createEmployee(dto);
                    createdEmployees.add(employee);
                } catch (Exception e) {
                    System.err.println("Error creating employee: " + e.getMessage());
                }
            }

            // Small pause between batches
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        return createdEmployees;
    }

    private List<EmployeeCreateDTO> parseExcelFile(MultipartFile file) throws IOException {
        List<EmployeeCreateDTO> employeeDTOs = new ArrayList<>();

        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        Iterator<Row> rowIterator = sheet.iterator();

        // Skip header row
        if (rowIterator.hasNext()) {
            rowIterator.next();
        }

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            EmployeeCreateDTO dto = new EmployeeCreateDTO();

            // Map Excel columns to DTO fields
            // Adjust column indexes based on your Excel structure
            dto.setEmpNo(getStringValue(row.getCell(0)));
            dto.setFirstName(getStringValue(row.getCell(1)));
            dto.setLastName(getStringValue(row.getCell(2)));

            // Handle birth date conversion from Excel numeric date
            Cell birthDateCell = row.getCell(3);
            if (birthDateCell != null) {
                if (birthDateCell.getCellType() == CellType.NUMERIC) {
                    dto.setBirthDate(convertExcelDateToLocalDate(birthDateCell.getNumericCellValue()));
                } else {
                    try {
                        dto.setBirthDate(LocalDate.parse(getStringValue(birthDateCell)));
                    } catch (DateTimeParseException e) {
                        // Handle invalid date format
                        System.err.println("Invalid date format in Excel: " + getStringValue(birthDateCell));
                    }
                }
            }

            // Continue mapping all fields...
            dto.setGender(getStringValue(row.getCell(4)));
            dto.setBloodGroup(getStringValue(row.getCell(5)));
            dto.setTitle(getStringValue(row.getCell(6)));
            dto.setDesignation(getStringValue(row.getCell(7)));
            dto.setFunction(getStringValue(row.getCell(8)));
            dto.setSubgroupCode(getStringValue(row.getCell(9)));
            dto.setSubgroup(getStringValue(row.getCell(10)));
            dto.setParentDivision(getStringValue(row.getCell(11)));
            dto.setLocation(getStringValue(row.getCell(12)));
            dto.setCity(getStringValue(row.getCell(13)));
            dto.setAdmin(Boolean.parseBoolean(getStringValue(row.getCell(14))));
            dto.setPassword(getStringValue(row.getCell(15)));
            dto.setEmail(getStringValue(row.getCell(16)));
            dto.setPhone(getStringValue(row.getCell(17)));
            dto.setAddress(getStringValue(row.getCell(18)));
            dto.setCollarWorker(getStringValue(row.getCell(19)));
            dto.setWorkSchedule(getStringValue(row.getCell(20)));
            dto.setWorkingHours(getStringValue(row.getCell(21)));
            dto.setStatus(getStringValue(row.getCell(22)));

            employeeDTOs.add(dto);
        }

        workbook.close();
        return employeeDTOs;
    }

    private LocalDate convertExcelDateToLocalDate(double excelDate) {
        // Excel dates are stored as days since 1900 (Windows) or 1904 (Mac)
        // This assumes Windows Excel (1900-based)
        LocalDate baseDate = LocalDate.of(1899, 12, 30); // Excel's epoch (with 1900 bug)
        long days = (long) excelDate;
        return baseDate.plusDays(days);
    }

    private String getStringValue(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                cell.setCellType(CellType.STRING);
                return cell.getStringCellValue();
                //return String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }
}
