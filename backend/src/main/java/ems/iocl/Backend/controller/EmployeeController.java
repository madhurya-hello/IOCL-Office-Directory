package ems.iocl.Backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin; 
import org.springframework.web.bind.annotation.RestController;

import ems.iocl.Backend.dto.*;
import ems.iocl.Backend.entity.*;
import ems.iocl.Backend.repository.EmployeeRepository;
import ems.iocl.Backend.repository.EmployeeRequestsRepository;
import ems.iocl.Backend.service.EmployeeService;
import ems.iocl.Backend.service.ExcelImportService;
import ems.iocl.Backend.service.OTPService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ExcelImportService excelImportService;

    @Autowired
    private OTPService otpService;

    @Autowired
    private EmployeeRequestsRepository employeeRequestsRepository;

    @PostMapping
    public ResponseEntity<?> createEmployee(@Valid @RequestBody EmployeeCreateDTO employeeDTO, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        try {
            Employee createdEmployee = employeeService.createEmployee(employeeDTO);
            EmployeeResponseDTO responseDTO = convertToResponseDTO(createdEmployee);
            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private EmployeeResponseDTO convertToResponseDTO(Employee employee) {
        // Generate random color for avatar
        String[] colors = {"#E74694", "#00B4D8", "#FF9E00", "#2EC4B6", "#E71D36", "#FF9F1C"};
        String randomColor = colors[(int)(Math.random() * colors.length)];

        return new EmployeeResponseDTO(
                employee.getEmpId(),
                employee.getEmpNo(),
                employee.getFirstName() + " " + employee.getLastName(),
                employee.getEmployeeContact() != null ? employee.getEmployeeContact().getEmail() : null,
                employee.getEmployeeJob() != null ? employee.getEmployeeJob().getDesignation() : null,
                employee.getEmployeeJob() != null ? employee.getEmployeeJob().getParentDivision() : null,
                employee.getEmployeeJob() != null ? employee.getEmployeeJob().getFunction() : null,
                employee.getEmployeeStatus() != null ? employee.getEmployeeStatus().getCollarWorker() : null,
                randomColor,
                employee.getEmployeeContact() != null ? employee.getEmployeeContact().getPhone() : null,
                employee.getEmployeeProfile() != null ? employee.getEmployeeProfile().getGender() : null,
                employee.getEmployeeProfile() != null ? employee.getEmployeeProfile().getBirthDate() : null,
                employee.getEmployeeContact() != null ? employee.getEmployeeContact().getAddress() : null,
                employee.getEmployeeJob() != null ? employee.getEmployeeJob().getCity() : null,
                employee.getEmployeeJob() != null ? employee.getEmployeeJob().getLocation() : null,
                employee.getEmployeeJob() != null ? employee.getEmployeeJob().getSubgroup() : null,
                employee.getEmployeeJob() != null ? employee.getEmployeeJob().getSubgroupCode() : null,
                employee.getEmployeeJob() != null ? employee.getEmployeeJob().getTitle() : null,
                employee.getEmployeeProfile() != null ? employee.getEmployeeProfile().getBloodGroup() : null,
                employee.getEmployeeStatus() != null ? employee.getEmployeeStatus().getWorkSchedule() : null,
                employee.getEmployeeStatus() != null ? employee.getEmployeeStatus().getWorkingHours() : null
        );
    }


    @GetMapping("/getEmpByMonth")
    public ResponseEntity<List<EmployeeBirthdayDTO>> getEmployeesByBirthMonth(
            @RequestParam int month) {
        try {
            List<EmployeeBirthdayDTO> employees = employeeService.getEmployeesByBirthMonth(month);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/import")
    public ResponseEntity<?> importEmployees(@RequestParam("file") MultipartFile file) {
        try {
            List<Employee> createdEmployees = excelImportService.importEmployeesFromExcel(file);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully imported " + createdEmployees.size() + " employees");
            response.put("employees", createdEmployees);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing Excel file: " + e.getMessage());
        }
    }

    @PutMapping("/moveToRecycleBin")
    public ResponseEntity<?> moveToRecycleBin(@RequestParam Long id) {
        try {
            employeeService.moveToRecycleBin(id);
            return ResponseEntity.ok().body(Map.of("message", "Employee moved to recycle bin successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to move employee to recycle bin"));
        }
    }

    // In EmployeeController.java
    @PutMapping("/restoreFromRecycleBin")
    public ResponseEntity<?> restoreFromRecycleBin(@RequestBody RestoreEmployeesDTO restoreRequest) {
        try {
            List<EmployeeListDTOtwo> restoredEmployees = employeeService.restoreFromRecycleBin(restoreRequest.getIds());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully restored employees from recycle bin");
            response.put("restoredEmployees", restoredEmployees);
            response.put("restoredCount", restoredEmployees.size());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to restore employees from recycle bin"));
        }
    }

    // In EmployeeController.java
    @DeleteMapping("/deleteForever")
    public ResponseEntity<?> deleteEmployeesForever(@RequestBody DeleteEmployeesDTO deleteRequest) {
        try {
            int deletedCount = employeeService.deleteEmployeesForever(deleteRequest.getIds());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Employees permanently deleted successfully");
            response.put("deletedCount", deletedCount);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to permanently delete employees"));
        }
    }

    // In EmployeeController.java
    @GetMapping("/getEmployeeChunk")
    public ResponseEntity<List<EmployeeListDTO>> getAllEmployees(
            @RequestParam(defaultValue = "1") int chunk) {
        try {
            List<EmployeeListDTO> employees = employeeService.getEmployeesByChunk(chunk);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/totalChunks")
    public ResponseEntity<Map<String, Integer>> getTotalChunks() {
        try {
            int totalChunks = employeeService.getTotalChunks();
            Map<String, Integer> response = new HashMap<>();
            response.put("totalChunks", totalChunks);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // In EmployeeController.java
    @GetMapping("/getLineChartData")
    public ResponseEntity<List<FunctionGenderStatsDTO>> getFunctionGenderStats() {
        try {
            List<FunctionGenderStatsDTO> stats = employeeService.getFunctionGenderStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // In EmployeeController.java
    // In EmployeeController.java
    @GetMapping("/getPieChartData")
    public ResponseEntity<List<DivisionEmployeeCountDTO>> getBloodGroupEmployeeCounts() {
        try {
            List<DivisionEmployeeCountDTO> stats = employeeService.getBloodGroupEmployeeCounts();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // In EmployeeController.java
    @GetMapping("/getRecycledData")
    public ResponseEntity<List<RecycledEmployeeDTO>> getRecycledEmployees() {
        try {
            List<RecycledEmployeeDTO> recycledEmployees = employeeService.getRecycledEmployees();
            return ResponseEntity.ok(recycledEmployees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // In EmployeeController.java
    @GetMapping("/getSpecificData")
    public ResponseEntity<?> getEmployeeDetails(@RequestParam Long id) {
        try {
            EmployeeDetailsDTO employeeDetails = employeeService.getEmployeeDetails(id);
            return ResponseEntity.ok(employeeDetails);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch employee details"));
        }
    }

    @PutMapping("/updateEmployee")
    public ResponseEntity<?> updateEmployee(
            @RequestParam Long id,
            @Valid @RequestBody EmployeeUpdateDTO updateDTO,
            BindingResult result) {
        try {
            EmployeeListDTOtwo responseDTO = employeeService.updateEmployee(id, updateDTO);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update employee"));
        }
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(
            @RequestParam Long id,
            @Valid @RequestBody ChangePasswordDTO changePasswordDTO) {

        try {
            employeeService.changePassword(id, changePasswordDTO);
            return ResponseEntity.ok().body(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to change password"));
        }
    }

    @PostMapping("/loginAdmin")
    public ResponseEntity<?> loginAdmin(@Valid @RequestBody AdminLoginDTO loginDTO) {
        try {
            AdminLoginResponseDTO response = employeeService.loginAdmin(loginDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed"));
        }
    }

    @PostMapping("/loginEmployee")
    public ResponseEntity<?> loginEmployee(@Valid @RequestBody AdminLoginDTO loginDTO) {
        try {
            AdminLoginResponseDTO response = employeeService.loginEmployee(loginDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed"));
        }
    }

    @PostMapping("/sendAdminOTP")
    public ResponseEntity<?> sendAdminOTP(@Valid @RequestBody OTPRequestDTO otpRequest) {
        try {
            OTPResponseDTO response = otpService.sendOTPToAdmin(otpRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send OTP"));
        }
    }

    @PostMapping("/sendEmployeeOTP")
    public ResponseEntity<?> sendEmployeeOTP(@Valid @RequestBody OTPRequestDTO otpRequest) {
        try {
            OTPResponseDTO response = otpService.sendOTPToEmployee(otpRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send OTP"));
        }
    }

    @PostMapping("/verifyOTP")
    public ResponseEntity<?> verifyOTP(@Valid @RequestBody VerifyOTPDTO verifyOTPDTO) {
        try {
            boolean isValid = otpService.verifyOTP(verifyOTPDTO.getEmpId(), verifyOTPDTO.getOtp());
            if (isValid) {
                return ResponseEntity.ok().body(Map.of(
                        "message", "OTP verified successfully",
                        "status", "success"
                ));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid OTP or OTP expired"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to verify OTP"));
        }
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        try {
            employeeService.resetPassword(forgotPasswordDTO.getEmpId(), forgotPasswordDTO.getNewPassword());
            return ResponseEntity.ok().body(Map.of(
                    "message", "Password reset successfully",
                    "status", "success"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to reset password"));
        }
    }

    @PostMapping("/requestUpdate")
    public ResponseEntity<?> requestUpdate(
            @RequestParam Long id,
            @RequestBody EmployeeUpdateDTO updateDTO) {

        try {
            // Create and save the request
            EmployeeRequests request = new EmployeeRequests();
            request.setEmpId(id);
            request.setEmpNo(updateDTO.getEmpNo());
            request.setTitle(updateDTO.getTitle());
            request.setFirstName(updateDTO.getFirstName());
            request.setLastName(updateDTO.getLastName());
            request.setGender(updateDTO.getGender());
            request.setLocation(updateDTO.getLocation());
            request.setFunction(updateDTO.getFunction());
            request.setSubgroupCode(updateDTO.getSubgroupCode());
            request.setSubgroup(updateDTO.getSubgroup());
            request.setDesignation(updateDTO.getDesignation());
            request.setBirthDate(updateDTO.getBirthDate().toString());
            request.setBloodGroup(updateDTO.getBloodGroup());
            request.setParentDivision(updateDTO.getParentDivision());
            request.setCity(updateDTO.getCity());
            request.setWorkingHours(updateDTO.getWorkingHours());
            request.setCollarWorker(updateDTO.getCollarWorker());
            request.setWorkSchedule(updateDTO.getWorkSchedule());
            request.setEmail(updateDTO.getEmail());
            request.setPhone(updateDTO.getPhone());
            request.setAddress(updateDTO.getAddress());
            request.setIsAdmin(updateDTO.isAdmin());
            request.setPassword(updateDTO.getPassword());
            request.setStatus(updateDTO.getStatus());
            request.setMessage(updateDTO.getMessage()); // Add this line

            employeeRequestsRepository.save(request);

            return ResponseEntity.ok().body(Map.of(
                    "message", "Update request submitted successfully",
                    "requestId", request.getRequestId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to submit update request"));
        }
    }

    @GetMapping("/requestsData")
    public ResponseEntity<List<EmployeeRequestsDTO>> getAllEmployeeRequests() {
        try {
            List<EmployeeRequestsDTO> requests = employeeService.getAllEmployeeRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/requestsDataSpecific")
    public ResponseEntity<?> getEmployeeRequestDetails(@RequestParam Long requestId) {
        try {
            EmployeeRequestDetailsDTO requestDetails = employeeService.getEmployeeRequestDetails(requestId);
            return ResponseEntity.ok(requestDetails);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch request details"));
        }
    }

    @GetMapping("/recycleCount")
    public ResponseEntity<Map<String, Long>> getRecycledEmployeesCount() {
        try {
            long count = employeeService.getRecycledEmployeesCount();
            Map<String, Long> response = new HashMap<>();
            response.put("recycleCount", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/requestCount")
    public ResponseEntity<Map<String, Long>> getEmployeeRequestsCount() {
        try {
            long count = employeeService.getEmployeeRequestsCount();
            Map<String, Long> response = new HashMap<>();
            response.put("requestsCount", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/deleteRequest")
    public ResponseEntity<?> deleteRequest(@RequestParam Long requestId) {
        try {
            employeeService.deleteRequest(requestId);
            return ResponseEntity.ok().body(Map.of(
                    "message", "Request deleted successfully",
                    "requestId", requestId
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete request"));
        }
    }

    @GetMapping("/myRequestStatus")
    public ResponseEntity<Map<String, String>> getRequestStatus(@RequestParam("emp_id") Long empId) {
        try {
            Map<String, String> response = employeeService.getRequestStatus(empId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch request status"));
        }
    }

    @PostMapping("/setRequestStatus")
    public ResponseEntity<?> setRequestStatus(@Valid @RequestBody RequestStatusDTO requestStatusDTO) {
        try {
            RequestState updatedState = employeeService.setRequestStatus(
                    requestStatusDTO.getEmp_id(),
                    requestStatusDTO.getR_status(),
                    requestStatusDTO.getR_message()
            );

            Map<String, String> response = new HashMap<>();
            response.put("message", "Request status updated successfully");
            response.put("emp_id", updatedState.getEmpId().toString());
            response.put("r_status", updatedState.getStatus());
            response.put("r_message", updatedState.getMessage());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update request status: " + e.getMessage()));
        }
    }

    @DeleteMapping("/deleteMyRequestStatus")
    public ResponseEntity<?> deleteRequestStatus(@RequestParam Long empId) {
        try {
            employeeService.deleteRequestStatus(empId);
            return ResponseEntity.ok().body(Map.of(
                    "message", "Request status deleted successfully",
                    "empId", empId.toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete request status: " + e.getMessage()));
        }
    }

    @PostMapping("/addNewIntercomData")
    public ResponseEntity<?> addOrUpdateIntercomData(@RequestBody EmployeeIntercomDTO intercomDTO) {
        try {
            EmployeeIntercom result = employeeService.addOrUpdateIntercomData(intercomDTO);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong while saving intercom data"));
        }
    }


    // In EmployeeController.java
    @GetMapping("/intercomData")
    public ResponseEntity<List<EmployeeIntercomResponseDTO>> getAllIntercomData() {
        try {
            List<EmployeeIntercomResponseDTO> intercomData = employeeService.getAllIntercomData();
            return ResponseEntity.ok(intercomData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/updateIntercomData")
    public ResponseEntity<?> updateIntercomData(
            @RequestParam Long id,
            @RequestBody EmployeeIntercomDTO intercomDTO) {
        try {
            intercomDTO.setId(id);
            EmployeeIntercom updatedIntercom = employeeService.updateIntercomData(intercomDTO);
            return ResponseEntity.ok(updatedIntercom);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update intercom data"));
        }
    }

    @DeleteMapping("/deleteIntercomBulk")
    public ResponseEntity<?> deleteIntercomBulk(@RequestBody DeleteIntercomBulkDTO deleteRequest) {
        try {
            int deletedCount = employeeService.deleteIntercomBulk(deleteRequest.getIds());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Intercom records deleted successfully");
            response.put("deletedCount", deletedCount);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete intercom records"));
        }
    }


    // Intercom Excel
    @PostMapping("/importIntercomBulk")
    public ResponseEntity<?> importIntercomBulk(@RequestParam("file") MultipartFile file) {
        try {
            List<EmployeeIntercom> importedIntercoms = employeeService.importIntercomBulkFromExcel(file);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully imported " + importedIntercoms.size() + " intercom records");
            response.put("intercoms", importedIntercoms);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing Excel file: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to import intercom data: " + e.getMessage());
        }
    }

    @GetMapping("/getAllEmployees")
    public ResponseEntity<List<EmployeeListDTOtwo>> getAllEmployees() {
        try {
            List<EmployeeListDTOtwo> employees = employeeService.getAllEmployees();
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/moveMultipleToRecycleBin")
    public ResponseEntity<?> moveMultipleToRecycleBin(@RequestBody DeleteEmployeesDTO deleteRequest) {
        try {
            int movedCount = employeeService.moveMultipleToRecycleBin(deleteRequest.getIds());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully moved employees to recycle bin");
            response.put("movedCount", movedCount);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to move employees to recycle bin"));
        }
    }

}
