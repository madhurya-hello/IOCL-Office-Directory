package ems.iocl.Backend.service;

import ems.iocl.Backend.dto.OTPRequestDTO;
import ems.iocl.Backend.dto.OTPResponseDTO;
import ems.iocl.Backend.entity.Employee;
import ems.iocl.Backend.entity.EmployeeStatus;
import ems.iocl.Backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OTPService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional
    public OTPResponseDTO sendOTPToAdmin(OTPRequestDTO otpRequest) {
        // Check if email belongs to an admin
        Employee employee = employeeRepository.findByEmail(otpRequest.getEmail());
        if (employee == null || employee.getEmployeeJob() == null || !employee.getEmployeeJob().isAdmin()) {
            throw new RuntimeException("Email does not belong to an admin");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Store OTP and expiry time in employee_status table
        EmployeeStatus status = employee.getEmployeeStatus();
        if (status == null) {
            status = new EmployeeStatus();
            status.setEmployee(employee);
            employee.setEmployeeStatus(status);
        }
        status.setOtp(otp);
        status.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        employeeRepository.save(employee);

        // Send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("madhuryachess@gmail.com");
        message.setTo(otpRequest.getEmail());
        message.setSubject("Your OTP for IOCL Dashboard");
        message.setText("Your OTP is: " + otp);
        emailSender.send(message);

        return new OTPResponseDTO(
                employee.getEmpId(),
                "OTP sent successfully to admin email",
                "success"
        );
    }

    @Transactional
    public OTPResponseDTO sendOTPToEmployee(OTPRequestDTO otpRequest) {
        // Check if email belongs to a non-admin employee
        Employee employee = employeeRepository.findByEmail(otpRequest.getEmail());
        if (employee == null || employee.getEmployeeJob() == null || employee.getEmployeeJob().isAdmin()) {
            throw new RuntimeException("Email must belong to a non-admin employee");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Store OTP and expiry time in employee_status table
        EmployeeStatus status = employee.getEmployeeStatus();
        if (status == null) {
            status = new EmployeeStatus();
            status.setEmployee(employee);
            employee.setEmployeeStatus(status);
        }
        status.setOtp(otp);
        status.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        employeeRepository.save(employee);

        // Send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("madhuryachess@gmail.com");
        message.setTo(otpRequest.getEmail());
        message.setSubject("Your OTP for IOCL Dashboard");
        message.setText("Your OTP is: " + otp);
        emailSender.send(message);

        return new OTPResponseDTO(
                employee.getEmpId(),
                "OTP sent successfully to employee email",
                "success"
        );
    }

    @Transactional
    public boolean verifyOTP(Long empId, String otp) {
        // Find the employee
        Employee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Get the employee status
        EmployeeStatus status = employee.getEmployeeStatus();
        if (status == null) {
            throw new RuntimeException("No OTP record found for this employee");
        }

        // Check if OTP matches and is not expired
        if (!otp.equals(status.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (LocalDateTime.now().isAfter(status.getOtpExpiry())) {
            throw new RuntimeException("OTP expired");
        }

        // Clear the OTP and expiry time
        status.setOtp(null);
        status.setOtpExpiry(null);
        employeeRepository.save(employee);

        return true;
    }
}