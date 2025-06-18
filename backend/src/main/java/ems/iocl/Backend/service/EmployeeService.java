package ems.iocl.Backend.service;

import ems.iocl.Backend.dto.*;
import ems.iocl.Backend.entity.*;
import ems.iocl.Backend.repository.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeRequestsRepository employeeRequestsRepository;

    @Autowired
    private BirthdayMessageRepository birthdayMessageRepository;

    @Autowired
    private BirthdaySeenRepository birthdaySeenRepository;

    @Autowired
    private RequestStateRepository requestStateRepository;

    @Transactional
    public Employee createEmployee(EmployeeCreateDTO employeeDTO) {
        // Check if employee with same empNo already exists
        if (employeeRepository.findByEmpNo(employeeDTO.getEmpNo()) != null) {
            throw new RuntimeException("Employee with empNo " + employeeDTO.getEmpNo() + " already exists");
        }

        // Create main Employee entity with required fields
        Employee employee = new Employee();
        employee.setEmpNo(employeeDTO.getEmpNo());
        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());

        // Create and set EmployeeProfile with default values for null fields
        EmployeeProfile profile = new EmployeeProfile();
        profile.setBirthDate(employeeDTO.getBirthDate() != null ? employeeDTO.getBirthDate() : LocalDate.now());
        profile.setGender(employeeDTO.getGender() != null ? employeeDTO.getGender() : "");
        profile.setBloodGroup(employeeDTO.getBloodGroup() != null ? employeeDTO.getBloodGroup() : "");
        profile.setEmployee(employee);
        employee.setEmployeeProfile(profile);

        // Create and set EmployeeJob with default values
        EmployeeJob job = new EmployeeJob();
        job.setTitle(employeeDTO.getTitle() != null ? employeeDTO.getTitle() : "");
        job.setDesignation(employeeDTO.getDesignation() != null ? employeeDTO.getDesignation() : "");
        job.setFunction(employeeDTO.getFunction() != null ? employeeDTO.getFunction() : "");
        job.setSubgroupCode(employeeDTO.getSubgroupCode() != null ? employeeDTO.getSubgroupCode() : "");
        job.setSubgroup(employeeDTO.getSubgroup() != null ? employeeDTO.getSubgroup() : "");
        job.setParentDivision(employeeDTO.getParentDivision() != null ? employeeDTO.getParentDivision() : "");
        job.setLocation(employeeDTO.getLocation() != null ? employeeDTO.getLocation() : "");
        job.setCity(employeeDTO.getCity() != null ? employeeDTO.getCity() : "");
        job.setAdmin(employeeDTO.isAdmin());
        job.setPassword(employeeDTO.getPassword() != null ? employeeDTO.getPassword() : "");
        job.setEmployee(employee);
        employee.setEmployeeJob(job);

        // Create and set EmployeeContact with default values
        EmployeeContact contact = new EmployeeContact();
        contact.setEmail(employeeDTO.getEmail() != null ? employeeDTO.getEmail() : "");
        contact.setPhone(employeeDTO.getPhone() != null ? employeeDTO.getPhone() : "");
        contact.setAddress(employeeDTO.getAddress() != null ? employeeDTO.getAddress() : "");
        contact.setEmployee(employee);
        employee.setEmployeeContact(contact);

        // Create and set EmployeeStatus with default values
        EmployeeStatus status = new EmployeeStatus();
        status.setCollarWorker(employeeDTO.getCollarWorker() != null ? employeeDTO.getCollarWorker() : "");
        status.setWorkSchedule(employeeDTO.getWorkSchedule() != null ? employeeDTO.getWorkSchedule() : "");
        status.setWorkingHours(employeeDTO.getWorkingHours() != null ? employeeDTO.getWorkingHours() : "0");
        status.setStatus(employeeDTO.getStatus() != null ? employeeDTO.getStatus() : "active");
        status.setDeleted(false);
        status.setEmployee(employee);
        employee.setEmployeeStatus(status);

        // Save the employee
        return employeeRepository.save(employee);
    }

    public Employee login(String email, String password) {
        Employee employee = employeeRepository.findByEmail(email);

        if (employee == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        EmployeeJob job = employee.getEmployeeJob();
        if (job == null) {
            throw new RuntimeException("User job information not found");
        }

        if (!job.isAdmin()) {
            throw new RuntimeException("User is not an admin");
        }

        if (!job.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return employee;
    }

    public List<EmployeeBirthdayDTO> getEmployeesByBirthMonth(int month) {
        List<Employee> employees = employeeRepository.findByBirthMonth(month);

        return employees.stream()
                .map(employee -> {
                    String fullName = employee.getFirstName() + " " + employee.getLastName();
                    String email = employee.getEmployeeContact() != null ?
                            employee.getEmployeeContact().getEmail() : null;
                    LocalDate birthDate = employee.getEmployeeProfile() != null ?
                            employee.getEmployeeProfile().getBirthDate() : null;
                    String photoLink = employee.getEmployeeProfile() != null ?
                            employee.getEmployeeProfile().getEmpPhotoLink() : null;

                    return new EmployeeBirthdayDTO(
                            employee.getEmpId(),  // Add employee ID
                            fullName,
                            email,
                            birthDate,
                            photoLink
                    );
                })
                .collect(Collectors.toList());
    }

    // In EmployeeService.java
    @Transactional
    public void moveToRecycleBin(Long empId) {
        // First check if employee exists
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + empId));

        // Update isDeleted flag and set deletedOn date
        employeeRepository.softDeleteEmployee(empId, LocalDate.now());
    }

    // In EmployeeService.java
    @Transactional
    public List<EmployeeListDTOtwo> restoreFromRecycleBin(List<Long> employeeIds) {
        if (employeeIds == null || employeeIds.isEmpty()) {
            throw new IllegalArgumentException("Employee IDs list cannot be empty");
        }

        int restoredCount = employeeRepository.restoreEmployees(employeeIds);
        if (restoredCount == 0) {
            throw new RuntimeException("No employees were restored");
        }

        List<Employee> restoredEmployees = employeeRepository.findAllById(employeeIds);

        return restoredEmployees.stream()
                .map(employee -> {
                    String[] colors = {"#E74694", "#00B4D8", "#FF9E00", "#2EC4B6", "#E71D36", "#FF9F1C"};
                    String randomColor = colors[(int)(Math.random() * colors.length)];

                    return new EmployeeListDTOtwo(
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
                            employee.getEmployeeStatus() != null ? employee.getEmployeeStatus().getWorkingHours() : null,
                            employee.getEmployeeStatus() != null ? employee.getEmployeeStatus().getStatus() : null,
                            employee.getEmployeeJob() != null ? employee.getEmployeeJob().isAdmin() : false
                    );
                })
                .collect(Collectors.toList());
    }

    // In EmployeeService.java
    @Transactional
    public int deleteEmployeesForever(List<Long> employeeIds) {
        if (employeeIds == null || employeeIds.isEmpty()) {
            throw new IllegalArgumentException("Employee IDs list cannot be empty");
        }

        // First delete the related entities (order matters due to foreign key constraints)
        employeeRepository.deleteEmployeeStatuses(employeeIds);
        employeeRepository.deleteEmployeeProfiles(employeeIds);
        employeeRepository.deleteEmployeeJobs(employeeIds);
        employeeRepository.deleteEmployeeContacts(employeeIds);

        // Then delete the employees
        employeeRepository.deleteAllByEmpIdIn(employeeIds);

        return employeeIds.size();
    }

    // In EmployeeService.java
    public List<EmployeeListDTO> getEmployeesByChunk(int chunk) {
        // Calculate page number (chunk starts from 1)
        int pageNumber = chunk - 1;
        int pageSize = 50;

        // Get paginated results
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        List<Employee> employees = employeeRepository.findAllActiveEmployees(pageable);

        return employees.stream()
                .map(employee -> {
                    // Generate random color for avatar
                    String[] colors = {"#E74694", "#00B4D8", "#FF9E00", "#2EC4B6", "#E71D36", "#FF9F1C"};
                    String randomColor = colors[(int)(Math.random() * colors.length)];

                    return new EmployeeListDTO(
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
                })
                .collect(Collectors.toList());
    }

    public int getTotalChunks() {
        long totalEmployees = employeeRepository.countActiveEmployees();
        return (int) Math.ceil((double) totalEmployees / 50);
    }

    // In EmployeeService.java
    public List<FunctionGenderStatsDTO> getFunctionGenderStats() {
        List<Object[]> results = employeeRepository.getFunctionGenderStats();

        return results.stream()
                .map(result -> new FunctionGenderStatsDTO(
                        (String) result[0],  // function
                        ((Number) result[1]).longValue(),  // noOfMales
                        ((Number) result[2]).longValue()   // noOfFemales
                ))
                .collect(Collectors.toList());
    }

    // In EmployeeService.java
    public List<DivisionEmployeeCountDTO> getDivisionEmployeeCounts() {
        List<Object[]> results = employeeRepository.getDivisionEmployeeCounts();

        return results.stream()
                .map(result -> new DivisionEmployeeCountDTO(
                        (String) result[0],  // division (parentDivision)
                        ((Number) result[1]).longValue()  // noOfEmployees
                ))
                .collect(Collectors.toList());
    }

    // In EmployeeService.java
    public List<RecycledEmployeeDTO> getRecycledEmployees() {
        List<Employee> deletedEmployees = employeeRepository.findAllDeletedEmployees();

        return deletedEmployees.stream()
                .map(employee -> {
                    String fullName = employee.getFirstName() + " " + employee.getLastName();
                    String designation = employee.getEmployeeJob() != null ?
                            employee.getEmployeeJob().getDesignation() : null;
                    String collarWorker = employee.getEmployeeStatus() != null ?
                            employee.getEmployeeStatus().getCollarWorker() : null;
                    LocalDate deletedOn = employee.getEmployeeStatus() != null ?
                            employee.getEmployeeStatus().getDeletedOn() : null;

                    return new RecycledEmployeeDTO(
                            employee.getEmpId(),
                            employee.getEmpNo(),
                            fullName,
                            deletedOn,
                            designation,
                            collarWorker
                    );
                })
                .collect(Collectors.toList());
    }

    // In EmployeeService.java
    public EmployeeDetailsDTO getEmployeeDetails(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        EmployeeProfile profile = employee.getEmployeeProfile();
        EmployeeJob job = employee.getEmployeeJob();
        EmployeeContact contact = employee.getEmployeeContact();
        EmployeeStatus status = employee.getEmployeeStatus();

        EmployeeDetailsDTO dto = new EmployeeDetailsDTO(
                employee.getEmpNo(),
                job != null ? job.getTitle() : null,
                employee.getFirstName(),
                employee.getLastName(),
                profile != null ? profile.getGender() : null,
                job != null ? job.getLocation() : null,
                job != null ? job.getFunction() : null,
                job != null ? job.getSubgroupCode() : null,
                job != null ? job.getSubgroup() : null,
                job != null ? job.getDesignation() : null,
                profile != null ? profile.getBirthDate() : null,
                profile != null ? profile.getBloodGroup() : null,
                job != null ? job.getParentDivision() : null,
                job != null ? job.getCity() : null,
                status != null ? parseWorkingHours(status.getWorkingHours()) : 0.0,
                status != null ? status.getCollarWorker() : null,
                status != null ? status.getWorkSchedule() : null,
                contact != null ? contact.getEmail() : null,
                contact != null ? contact.getPhone() : null,
                contact != null ? contact.getAddress() : null,
                job != null ? job.isAdmin() : false,
                job != null ? job.getPassword() : null,
                status != null ? status.getStatus() : null
        );

        // Add the new fields
        if (status != null) {
            dto.setLogged(status.isLogged());
            dto.setLastLogged(status.getLastLogged());
        } else {
            dto.setLogged(false);
            dto.setLastLogged(null);
        }

        return dto;
    }

    private double parseWorkingHours(String workingHours) {
        if (workingHours == null || workingHours.isEmpty()) {
            return 0.0;
        }
        try {
            return Double.parseDouble(workingHours.replaceAll("[^0-9.]", ""));
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    // In EmployeeService.java
    public List<DivisionEmployeeCountDTO> getBloodGroupEmployeeCounts() {
        List<Object[]> results = employeeRepository.getBloodGroupEmployeeCounts();

        return results.stream()
                .map(result -> new DivisionEmployeeCountDTO(
                        result[0] != null && !result[0].toString().trim().isEmpty() ? result[0].toString() : "NA",
                        ((Number) result[1]).longValue()  // noOfEmployees
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeListDTOtwo updateEmployee(Long id, EmployeeUpdateDTO updateDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));


        // Check if employee with same empNo already exists (excluding current employee)
        Employee existingWithEmpNo = employeeRepository.findByEmpNo(updateDTO.getEmpNo());
        if (existingWithEmpNo != null && !existingWithEmpNo.getEmpId().equals(id)) {
            throw new RuntimeException("Employee with empNo " + updateDTO.getEmpNo() + " already exists");
        }

        // Update basic employee info
        employee.setEmpNo(updateDTO.getEmpNo());
        employee.setFirstName(updateDTO.getFirstName());
        employee.setLastName(updateDTO.getLastName());

        // Update EmployeeProfile
        EmployeeProfile profile = employee.getEmployeeProfile();
        if (profile == null) {
            profile = new EmployeeProfile();
            profile.setEmployee(employee);
            employee.setEmployeeProfile(profile);
        }
        profile.setBirthDate(updateDTO.getBirthDate());
        profile.setGender(updateDTO.getGender());
        profile.setBloodGroup(updateDTO.getBloodGroup());

        // Update EmployeeJob
        EmployeeJob job = employee.getEmployeeJob();
        if (job == null) {
            job = new EmployeeJob();
            job.setEmployee(employee);
            employee.setEmployeeJob(job);
        }
        job.setTitle(updateDTO.getTitle());
        job.setDesignation(updateDTO.getDesignation());
        job.setFunction(updateDTO.getFunction());
        job.setSubgroupCode(updateDTO.getSubgroupCode());
        job.setSubgroup(updateDTO.getSubgroup());
        job.setParentDivision(updateDTO.getParentDivision());
        job.setLocation(updateDTO.getLocation());
        job.setCity(updateDTO.getCity());
        job.setAdmin(updateDTO.isAdmin());

        // Update EmployeeContact
        EmployeeContact contact = employee.getEmployeeContact();
        if (contact == null) {
            contact = new EmployeeContact();
            contact.setEmployee(employee);
            employee.setEmployeeContact(contact);
        }
        contact.setEmail(updateDTO.getEmail());
        contact.setPhone(updateDTO.getPhone());
        contact.setAddress(updateDTO.getAddress());

        // Update EmployeeStatus
        EmployeeStatus status = employee.getEmployeeStatus();
        if (status == null) {
            status = new EmployeeStatus();
            status.setEmployee(employee);
            employee.setEmployeeStatus(status);
        }
        status.setCollarWorker(updateDTO.getCollarWorker());
        status.setWorkSchedule(updateDTO.getWorkSchedule());
        status.setWorkingHours(String.valueOf(updateDTO.getWorkingHours()));
        status.setStatus(updateDTO.getStatus());

        // Save the updated employee
        Employee updatedEmployee = employeeRepository.save(employee);

        // Convert to EmployeeListDTOtwo
        String[] colors = {"#E74694", "#00B4D8", "#FF9E00", "#2EC4B6", "#E71D36", "#FF9F1C"};
        String randomColor = colors[(int)(Math.random() * colors.length)];

        return new EmployeeListDTOtwo(
                updatedEmployee.getEmpId(),
                updatedEmployee.getEmpNo(),
                updatedEmployee.getFirstName() + " " + updatedEmployee.getLastName(),
                updatedEmployee.getEmployeeContact() != null ? updatedEmployee.getEmployeeContact().getEmail() : null,
                updatedEmployee.getEmployeeJob() != null ? updatedEmployee.getEmployeeJob().getDesignation() : null,
                updatedEmployee.getEmployeeJob() != null ? updatedEmployee.getEmployeeJob().getParentDivision() : null,
                updatedEmployee.getEmployeeJob() != null ? updatedEmployee.getEmployeeJob().getFunction() : null,
                updatedEmployee.getEmployeeStatus() != null ? updatedEmployee.getEmployeeStatus().getCollarWorker() : null,
                randomColor,
                updatedEmployee.getEmployeeContact() != null ? updatedEmployee.getEmployeeContact().getPhone() : null,
                updatedEmployee.getEmployeeProfile() != null ? updatedEmployee.getEmployeeProfile().getGender() : null,
                updatedEmployee.getEmployeeProfile() != null ? updatedEmployee.getEmployeeProfile().getBirthDate() : null,
                updatedEmployee.getEmployeeContact() != null ? updatedEmployee.getEmployeeContact().getAddress() : null,
                updatedEmployee.getEmployeeJob() != null ? updatedEmployee.getEmployeeJob().getCity() : null,
                updatedEmployee.getEmployeeJob() != null ? updatedEmployee.getEmployeeJob().getLocation() : null,
                updatedEmployee.getEmployeeJob() != null ? updatedEmployee.getEmployeeJob().getSubgroup() : null,
                updatedEmployee.getEmployeeJob() != null ? updatedEmployee.getEmployeeJob().getSubgroupCode() : null,
                updatedEmployee.getEmployeeJob() != null ? updatedEmployee.getEmployeeJob().getTitle() : null,
                updatedEmployee.getEmployeeProfile() != null ? updatedEmployee.getEmployeeProfile().getBloodGroup() : null,
                updatedEmployee.getEmployeeStatus() != null ? updatedEmployee.getEmployeeStatus().getWorkSchedule() : null,
                updatedEmployee.getEmployeeStatus() != null ? updatedEmployee.getEmployeeStatus().getWorkingHours() : null,
                updatedEmployee.getEmployeeStatus() != null ? updatedEmployee.getEmployeeStatus().getStatus() : null,
                updatedEmployee.getEmployeeJob() != null ? updatedEmployee.getEmployeeJob().isAdmin() : false
        );
    }

    @Transactional
    public void changePassword(Long empId, ChangePasswordDTO changePasswordDTO) {
        // Add this at the beginning of the changePassword method
        if (changePasswordDTO.getNewPassword() == null || changePasswordDTO.getNewPassword().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters long");
        }

        // Find the employee by ID
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + empId));

        // Get the employee's job info (where password is stored)
        EmployeeJob job = employee.getEmployeeJob();
        if (job == null) {
            throw new RuntimeException("Employee job information not found");
        }

        // Check if current password matches
        if (!job.getPassword().equals(changePasswordDTO.getCurrent())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update to new password
        job.setPassword(changePasswordDTO.getNewPassword());
        employeeRepository.save(employee);
    }

    public AdminLoginResponseDTO loginAdmin(AdminLoginDTO loginDTO) {
        // Find employee by email
        Employee employee = employeeRepository.findByEmail(loginDTO.getEmail());

        if (employee == null) {
            throw new RuntimeException("User not found with email: " + loginDTO.getEmail());
        }

        EmployeeJob job = employee.getEmployeeJob();
        if (job == null) {
            throw new RuntimeException("User job information not found");
        }

        // Check if user is admin
        if (!job.isAdmin()) {
            throw new RuntimeException("User is not an admin");
        }

        // Check password
        if (!job.getPassword().equals(loginDTO.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Update login status and timestamp
        EmployeeStatus status = employee.getEmployeeStatus();
        if (status == null) {
            status = new EmployeeStatus();
            status.setEmployee(employee);
            employee.setEmployeeStatus(status);
        }
        status.setLogged(true);
        status.setLastLogged(LocalDateTime.now());
        employeeRepository.save(employee);

        // Build response
        String photoLink = employee.getEmployeeProfile() != null ?
                employee.getEmployeeProfile().getEmpPhotoLink() : null;

        return new AdminLoginResponseDTO(
                employee.getEmpId(),
                employee.getFirstName() + " " + employee.getLastName(),
                loginDTO.getEmail(),
                photoLink,
                true
        );
    }

    public AdminLoginResponseDTO loginEmployee(AdminLoginDTO loginDTO) {
        // Find employee by email
        Employee employee = employeeRepository.findByEmail(loginDTO.getEmail());

        if (employee == null) {
            throw new RuntimeException("User not found with email: " + loginDTO.getEmail());
        }

        EmployeeJob job = employee.getEmployeeJob();
        if (job == null) {
            throw new RuntimeException("User job information not found");
        }

        // Check if user is NOT admin
        if (job.isAdmin()) {
            throw new RuntimeException("This is an admin account. Please use admin login.");
        }

        // Check password
        if (!job.getPassword().equals(loginDTO.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Update login status and timestamp
        EmployeeStatus status = employee.getEmployeeStatus();
        if (status == null) {
            status = new EmployeeStatus();
            status.setEmployee(employee);
            employee.setEmployeeStatus(status);
        }
        status.setLogged(true);
        status.setLastLogged(LocalDateTime.now());
        employeeRepository.save(employee);

        // Build response
        String photoLink = employee.getEmployeeProfile() != null ?
                employee.getEmployeeProfile().getEmpPhotoLink() : null;

        return new AdminLoginResponseDTO(
                employee.getEmpId(),
                employee.getFirstName() + " " + employee.getLastName(),
                loginDTO.getEmail(),
                photoLink,
                false
        );
    }

    @Transactional
    public void resetPassword(Long empId, String newPassword) {
        // Find the employee
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Get the employee job info (where password is stored)
        EmployeeJob job = employee.getEmployeeJob();
        if (job == null) {
            throw new RuntimeException("Employee job information not found");
        }

        // Update to new password
        job.setPassword(newPassword);
        employeeRepository.save(employee);
    }

    public List<EmployeeRequestsDTO> getAllEmployeeRequests() {
        List<Object[]> results = employeeRequestsRepository.findAllRequestsWithContactInfo();

        return results.stream()
                .map(result -> new EmployeeRequestsDTO(
                        (Long) result[0],    // requestId
                        (Long) result[1],    // empId
                        (String) result[2],  // empNo
                        (String) result[3],  // name
                        (LocalDateTime) result[4],  // requestDate
                        (String) result[5],  // mobile
                        (String) result[6],  // email
                        (String) result[7]   // message
                ))
                .collect(Collectors.toList());
    }

    public EmployeeRequestDetailsDTO getEmployeeRequestDetails(Long requestId) {
        EmployeeRequests request = employeeRequestsRepository.findRequestById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));

        return new EmployeeRequestDetailsDTO(
                request.getEmpNo(),
                request.getTitle(),
                request.getFirstName(),
                request.getLastName(),
                request.getGender(),
                request.getLocation(),
                request.getFunction(),
                request.getSubgroupCode(),
                request.getSubgroup(),
                request.getDesignation(),
                request.getBirthDate(),
                request.getBloodGroup(),
                request.getParentDivision(),
                request.getCity(),
                request.getWorkingHours(),
                request.getCollarWorker(),
                request.getWorkSchedule(),
                request.getEmail(),
                request.getPhone(),
                request.getAddress(),
                request.getPassword(),
                request.getStatus(),
                request.getIsAdmin() != null ? request.getIsAdmin() : false,
                request.getRequestDate(),
                request.getMessage()
        );
    }

    public long getRecycledEmployeesCount() {
        return employeeRepository.countDeletedEmployees();
    }

    public long getEmployeeRequestsCount() {
        return employeeRequestsRepository.countAllRequests();
    }

    @Transactional
    public void deleteRequest(Long requestId) {
        employeeRequestsRepository.deleteByRequestId(requestId);
    }

    public List<EmployeeBirthdayTodayDTO> getEmployeesWithBirthdayToday() {
        List<Employee> employees = employeeRepository.findEmployeesWithBirthdayToday();

        return employees.stream()
                .map(employee -> {
                    String fullName = employee.getFirstName() + " " + employee.getLastName();
                    String email = employee.getEmployeeContact() != null ?
                            employee.getEmployeeContact().getEmail() : null;
                    String phone = employee.getEmployeeContact() != null ?
                            employee.getEmployeeContact().getPhone() : null;

                    return new EmployeeBirthdayTodayDTO(
                            employee.getEmpId(),
                            fullName,
                            phone,
                            email
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void sendBirthdayMessage(BirthdayMessageRequestDTO messageRequest) {
        // Find receiver and sender employees
        Employee receiver = employeeRepository.findById(messageRequest.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found with id: " + messageRequest.getReceiverId()));

        Employee sender = employeeRepository.findById(messageRequest.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found with id: " + messageRequest.getSenderId()));

        // Create and save the birthday message
        BirthdayMessage birthdayMessage = new BirthdayMessage(
                receiver,
                sender,
                messageRequest.getSenderName(),
                messageRequest.getMessage(),
                LocalDateTime.now()
        );

        // This assumes you have a birthdayMessageRepository autowired in your service
        birthdayMessageRepository.save(birthdayMessage);
    }

    public List<BirthdayInboxDTO> getBirthdayInbox(Long receiverId) {
        // First get all messages for this receiver
        List<BirthdayMessage> messages = birthdayMessageRepository.findByReceiverEmpId(receiverId);

        // Then group by sender and get the latest message and unread count for each sender
        return messages.stream()
                .collect(Collectors.groupingBy(BirthdayMessage::getSender))
                .entrySet()
                .stream()
                .map(entry -> {
                    Employee sender = entry.getKey();
                    List<BirthdayMessage> senderMessages = entry.getValue();

                    // Get the latest message
                    BirthdayMessage latestMessage = senderMessages.stream()
                            .max(Comparator.comparing(BirthdayMessage::getTimestamp))
                            .orElse(null);

                    if (latestMessage == null) {
                        return null;
                    }

                    // Count unread messages
                    long unreadCount = senderMessages.stream()
                            .filter(m -> !m.getIsRead())
                            .count();

                    return new BirthdayInboxDTO(
                            sender.getEmpId(),
                            latestMessage.getSenderName(),
                            latestMessage.getMessage(),
                            latestMessage.getTimestamp(),
                            (int) unreadCount
                    );
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<MessageDTO> viewAndMarkMessagesAsRead(Long receiverId, Long senderId) {
        // Find all messages between these two employees
        List<BirthdayMessage> messages = birthdayMessageRepository
                .findByReceiverEmpIdAndSenderEmpId(receiverId, senderId);

        // Mark all messages as read
        messages.forEach(message -> message.setIsRead(true));
        birthdayMessageRepository.saveAll(messages);

        // Convert to DTOs
        return messages.stream()
                .map(message -> new MessageDTO(
                        message.getMessage(),
                        message.getTimestamp()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean checkAndUpdateBirthdayStatus(Long empId) {
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate birthDate = employee.getEmployeeProfile().getBirthDate();
        LocalDate today = LocalDate.now();

        Optional<BirthdaySeen> existingRecord = birthdaySeenRepository.findByEmployeeEmpId(empId);

        // Check if birthday is within +5 days range
        if (!isBirthdayWithinRange(birthDate, today)) {
            if (existingRecord.isPresent()) {
                BirthdaySeen record = existingRecord.get();
                // Expired record - clean up
                birthdaySeenRepository.delete(record);
                birthdayMessageRepository.deleteByReceiverEmpId(empId);
            }
            return false;
        }

        if (existingRecord.isPresent()) {
            BirthdaySeen record = existingRecord.get();
            if (today.isAfter(record.getExpiryDate())) {
                return false;
            }
            return true;
        } else {
            // New record - mark as seen
            BirthdaySeen newRecord = new BirthdaySeen();
            newRecord.setEmployee(employee);
            newRecord.setBirthDate(birthDate);
            newRecord.setExpiryDate(today.plusDays(1)); // Expires tomorrow
            birthdaySeenRepository.save(newRecord);
            return true;
        }
    }

    private boolean isBirthdayWithinRange(LocalDate birthDate, LocalDate today) {
        // Check if today is within 5 days after the birthday (same month)
        LocalDate birthdayThisYear = birthDate.withYear(today.getYear());
        LocalDate startRange = birthdayThisYear;
        LocalDate endRange = birthdayThisYear.plusDays(5);

        // Handle year wrap-around (for birthdays near year end)
        if (endRange.getYear() != today.getYear()) {
            endRange = endRange.withYear(today.getYear());
        }

        return !today.isBefore(startRange) && !today.isAfter(endRange);
    }

    @Transactional
    public int cleanOldBirthdayMessages() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(7);
        return birthdayMessageRepository.deleteByTimestampBefore(cutoffDate);
    }

    public Map<String, String> getRequestStatus(Long empId) {
        Map<String, String> response = new HashMap<>();
        RequestState requestState = requestStateRepository.findByEmpId(empId);

        if (requestState != null) {
            response.put("r_message", requestState.getMessage());
            response.put("r_status", requestState.getStatus());
        } else {
            response.put("r_message", "");
            response.put("r_status", "none");
        }

        return response;
    }

    @Transactional
    public RequestState setRequestStatus(Long empId, String status, String message) {
        // Try to find existing request state
        RequestState requestState = requestStateRepository.findByEmpId(empId);

        if (requestState == null) {
            // Create new record if not exists
            requestState = new RequestState(empId, status, message);
        } else {
            // Update existing record
            requestState.setStatus(status);
            requestState.setMessage(message);
        }

        // Save and return the updated/created record
        return requestStateRepository.save(requestState);
    }

    @Transactional
    public void deleteRequestStatus(Long empId) {
        requestStateRepository.deleteByEmpId(empId);
    }

    // In EmployeeService.java
    @Autowired
    private EmployeeIntercomRepository employeeIntercomRepository;

    @Transactional
    public EmployeeIntercom addOrUpdateIntercomData(EmployeeIntercomDTO intercomDTO) {
        // Check for existing intercom entry if this is a create (id is null)
        if (intercomDTO.getId() == null && employeeIntercomRepository.existsByEmpNo(intercomDTO.getEmpNo())) {
            throw new IllegalArgumentException("Employee No. already exists");
        }

        // Check if we're updating an existing record
        EmployeeIntercom intercom;
        if (intercomDTO.getId() != null) {
            intercom = employeeIntercomRepository.findById(intercomDTO.getId())
                    .orElse(new EmployeeIntercom());
        } else {
            intercom = new EmployeeIntercom();
        }

        // Set the provided fields
        intercom.setEmpNo(intercomDTO.getEmpNo());
        if (intercomDTO.getGrade() != null) intercom.setGrade(intercomDTO.getGrade());
        if (intercomDTO.getFloor() != null) intercom.setFloor(intercomDTO.getFloor());
        if (intercomDTO.getIntercom() != null) intercom.setIntercom(intercomDTO.getIntercom());

        // Check if employee exists in main table
        boolean employeeExists = employeeRepository.existsByEmpNo(intercomDTO.getEmpNo());

        if (employeeExists) {
            // Fetch employee details and populate missing fields
            Employee employee = employeeRepository.findByEmpNo(intercomDTO.getEmpNo());

            // Set fields from employee data if not provided in DTO
            if (intercomDTO.getName() == null) {
                intercom.setName(employee.getFirstName() + " " + employee.getLastName());
            } else {
                intercom.setName(intercomDTO.getName());
            }

            if (intercomDTO.getEmail() == null && employee.getEmployeeContact() != null) {
                intercom.setEmail(employee.getEmployeeContact().getEmail());
            } else {
                intercom.setEmail(intercomDTO.getEmail());
            }

            if (intercomDTO.getDesignation() == null && employee.getEmployeeJob() != null) {
                intercom.setDesignation(employee.getEmployeeJob().getDesignation());
            } else {
                intercom.setDesignation(intercomDTO.getDesignation());
            }

            if (intercomDTO.getDivision() == null && employee.getEmployeeJob() != null) {
                intercom.setParentDivision(employee.getEmployeeJob().getParentDivision());
            } else {
                intercom.setParentDivision(intercomDTO.getDivision());
            }

            if (intercomDTO.getFunction() == null && employee.getEmployeeJob() != null) {
                intercom.setFunction(employee.getEmployeeJob().getFunction());
            } else {
                intercom.setFunction(intercomDTO.getFunction());
            }

            if (intercomDTO.getWorkerType() == null && employee.getEmployeeStatus() != null) {
                intercom.setCollarWorker(employee.getEmployeeStatus().getCollarWorker());
            } else {
                intercom.setCollarWorker(intercomDTO.getWorkerType());
            }

            if (intercomDTO.getPhone() == null && employee.getEmployeeContact() != null) {
                intercom.setPhone(employee.getEmployeeContact().getPhone());
            } else {
                intercom.setPhone(intercomDTO.getPhone());
            }

            if (intercomDTO.getLocation() == null && employee.getEmployeeJob() != null) {
                intercom.setLocation(employee.getEmployeeJob().getLocation());
            } else {
                intercom.setLocation(intercomDTO.getLocation());
            }

            if (intercomDTO.getStatus() == null && employee.getEmployeeStatus() != null) {
                intercom.setStatus(employee.getEmployeeStatus().getStatus());
            } else {
                intercom.setStatus(intercomDTO.getStatus());
            }
        } else {
            // Employee doesn't exist, only set the provided fields
            if (intercomDTO.getName() != null) intercom.setName(intercomDTO.getName());
            if (intercomDTO.getEmail() != null) intercom.setEmail(intercomDTO.getEmail());
            if (intercomDTO.getDesignation() != null) intercom.setDesignation(intercomDTO.getDesignation());
            if (intercomDTO.getDivision() != null) intercom.setParentDivision(intercomDTO.getDivision());
            if (intercomDTO.getFunction() != null) intercom.setFunction(intercomDTO.getFunction());
            if (intercomDTO.getWorkerType() != null) intercom.setCollarWorker(intercomDTO.getWorkerType());
            if (intercomDTO.getPhone() != null) intercom.setPhone(intercomDTO.getPhone());
            if (intercomDTO.getLocation() != null) intercom.setLocation(intercomDTO.getLocation());
            if (intercomDTO.getStatus() != null) intercom.setStatus(intercomDTO.getStatus());
        }

        return employeeIntercomRepository.save(intercom);
    }

    // In EmployeeService.java
    public List<EmployeeIntercomResponseDTO> getAllIntercomData() {
        List<EmployeeIntercom> intercomList = employeeIntercomRepository.findAll();

        return intercomList.stream()
                .map(intercom -> {
                    EmployeeIntercomResponseDTO dto = new EmployeeIntercomResponseDTO();
                    dto.setId(intercom.getId());
                    dto.setEmpNo(intercom.getEmpNo());
                    dto.setName(intercom.getName());
                    dto.setEmail(intercom.getEmail());
                    dto.setDesignation(intercom.getDesignation());
                    dto.setDivision(intercom.getParentDivision());
                    dto.setFunction(intercom.getFunction());
                    dto.setWorkerType(intercom.getCollarWorker());
                    dto.setPhone(intercom.getPhone());
                    dto.setGrade(intercom.getGrade());
                    dto.setFloor(intercom.getFloor());
                    dto.setLocation(intercom.getLocation());
                    dto.setIntercom(intercom.getIntercom());
                    dto.setStatus(intercom.getStatus());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeIntercom updateIntercomData(EmployeeIntercomDTO intercomDTO) {
        EmployeeIntercom existing = employeeIntercomRepository.findById(intercomDTO.getId())
                .orElseThrow(() -> new RuntimeException("Intercom record not found with id: " + intercomDTO.getId()));

        // Check for duplicate empNo (exclude current record)
        EmployeeIntercom byEmpNo = employeeIntercomRepository.findByEmpNo(intercomDTO.getEmpNo());
        if (byEmpNo != null && !byEmpNo.getId().equals(intercomDTO.getId())) {
            throw new IllegalArgumentException("Employee No. already exists");
        }

        existing.setEmpNo(intercomDTO.getEmpNo());
        existing.setName(intercomDTO.getName());
        existing.setEmail(intercomDTO.getEmail());
        existing.setDesignation(intercomDTO.getDesignation());
        existing.setParentDivision(intercomDTO.getDivision());
        existing.setFunction(intercomDTO.getFunction());
        existing.setCollarWorker(intercomDTO.getWorkerType());
        existing.setPhone(intercomDTO.getPhone());
        existing.setGrade(intercomDTO.getGrade());
        existing.setFloor(intercomDTO.getFloor());
        existing.setLocation(intercomDTO.getLocation());
        existing.setIntercom(intercomDTO.getIntercom());
        existing.setStatus(intercomDTO.getStatus());

        return employeeIntercomRepository.save(existing);
    }

    @Transactional
    public int deleteIntercomBulk(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("IDs list cannot be empty");
        }
        return employeeIntercomRepository.deleteAllByIdIn(ids);
    }

    public List<EmployeeListDTOtwo> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAllActiveEmployees();

        return employees.stream()
                .map(employee -> {
                    String[] colors = {"#E74694", "#00B4D8", "#FF9E00", "#2EC4B6", "#E71D36", "#FF9F1C"};
                    String randomColor = colors[(int)(Math.random() * colors.length)];

                    return new EmployeeListDTOtwo(
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
                            employee.getEmployeeStatus() != null ? employee.getEmployeeStatus().getWorkingHours() : null,
                            employee.getEmployeeStatus() != null ? employee.getEmployeeStatus().getStatus() : null,
                            employee.getEmployeeJob() != null ? employee.getEmployeeJob().isAdmin() : false
                    );
                })
                .collect(Collectors.toList());
    }


    // Intercom Excel
    @Transactional
    public List<EmployeeIntercom> importIntercomBulkFromExcel(MultipartFile file) throws IOException {
        try {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File is empty or null");
            }

            if (!file.getOriginalFilename().endsWith(".xlsx")) {
                throw new IllegalArgumentException("Only .xlsx files are supported");
            }

            List<EmployeeIntercom> importedIntercoms = new ArrayList<>();

            try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
                Sheet sheet = workbook.getSheetAt(0);

                // Log sheet info for debugging
                System.out.println("Processing sheet: " + sheet.getSheetName());
                System.out.println("Rows: " + sheet.getLastRowNum());

                for (int i = 2; i <= sheet.getLastRowNum(); i++) {
                    Row row = sheet.getRow(i);
                    if (row == null) continue;

                    try {
                        EmployeeIntercomDTO intercomDTO = new EmployeeIntercomDTO();
                        intercomDTO.setEmpNo(getStringCellValue(row.getCell(0)));
                        String firstName = getStringCellValue(row.getCell(1));
                        String lastName = getStringCellValue(row.getCell(2));
                        intercomDTO.setName(firstName + " " + lastName);
                        intercomDTO.setFloor(getNumericCellValue(row.getCell(3)));
                        intercomDTO.setGrade(getStringCellValue(row.getCell(4)));
                        intercomDTO.setIntercom(getNumericCellValue(row.getCell(5)));

                        if (intercomDTO.getEmpNo() == null || intercomDTO.getEmpNo().isEmpty()) {
                            System.out.println("Skipping row " + i + " - missing empNo");
                            continue;
                        }

                        EmployeeIntercom intercom = addOrUpdateIntercomData(intercomDTO);
                        importedIntercoms.add(intercom);
                    } catch (Exception e) {
                        System.err.println("Error processing row " + i + ": " + e.getMessage());
                        // Continue with next row
                    }
                }
            }
            return importedIntercoms;
        } catch (Exception e) {
            System.err.println("Error processing Excel file: " + e.getMessage());
            throw e; // Re-throw to be handled by controller
        }
    }

    private String getStringCellValue(Cell cell) {
        if (cell == null) return null;

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            default:
                return null;
        }
    }

    private Integer getNumericCellValue(Cell cell) {
        if (cell == null) return null;

        switch (cell.getCellType()) {
            case NUMERIC:
                return (int) cell.getNumericCellValue();
            case STRING:
                try {
                    return Integer.parseInt(cell.getStringCellValue().trim());
                } catch (NumberFormatException e) {
                    return null;
                }
            default:
                return null;
        }
    }


    @Transactional
    public int moveMultipleToRecycleBin(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("Employee IDs list cannot be empty");
        }

        // First verify all employees exist
        List<Employee> employees = employeeRepository.findAllById(ids);
        if (employees.size() != ids.size()) {
            throw new RuntimeException("One or more employees not found");
        }

        employeeRepository.softDeleteEmployees(ids, LocalDate.now());
        return ids.size();
    }



}