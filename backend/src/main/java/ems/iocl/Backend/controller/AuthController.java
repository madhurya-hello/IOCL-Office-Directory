package ems.iocl.Backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin; 
import org.springframework.web.bind.annotation.RestController;

import ems.iocl.Backend.dto.LoginDTO;
import ems.iocl.Backend.dto.LoginResponseDTO;
import ems.iocl.Backend.entity.Employee;
import ems.iocl.Backend.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            Employee employee = employeeService.login(loginDTO.getEmail(), loginDTO.getPassword());


            String fullName = employee.getFirstName() + " " + employee.getLastName();
            String email = employee.getEmployeeContact() != null ?
                    employee.getEmployeeContact().getEmail() : null;
            String password = employee.getEmployeeJob() != null ?
                    employee.getEmployeeJob().getPassword() : null;
            String photoLink = employee.getEmployeeProfile() != null ?
                    employee.getEmployeeProfile().getEmpPhotoLink() : null;

            LoginResponseDTO response = new LoginResponseDTO(
                    fullName,
                    email,
                    password,
                    photoLink
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
}