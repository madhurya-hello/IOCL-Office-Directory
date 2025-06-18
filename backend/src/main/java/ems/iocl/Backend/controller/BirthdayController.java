package ems.iocl.Backend.controller;

import ems.iocl.Backend.dto.*;
import ems.iocl.Backend.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/birthday")
public class BirthdayController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/getTodayData")
    public ResponseEntity<List<EmployeeBirthdayTodayDTO>> getTodayBirthdayData() {
        try {
            List<EmployeeBirthdayTodayDTO> employees = employeeService.getEmployeesWithBirthdayToday();
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/sendMessage")
    public ResponseEntity<String> sendBirthdayMessage(@RequestBody BirthdayMessageRequestDTO messageRequest) {
        try {
            employeeService.sendBirthdayMessage(messageRequest);
            return ResponseEntity.ok("Birthday message sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send birthday message: " + e.getMessage());
        }
    }

    @GetMapping("/inboxData")
    public ResponseEntity<List<BirthdayInboxDTO>> getInboxData(@RequestParam Long receiverId) {
        try {
            List<BirthdayInboxDTO> inboxMessages = employeeService.getBirthdayInbox(receiverId);
            return ResponseEntity.ok(inboxMessages);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/viewSenderMessages")
    public ResponseEntity<List<MessageDTO>> viewSenderMessages(@RequestBody ViewMessagesRequestDTO request) {
        try {
            List<MessageDTO> messages = employeeService.viewAndMarkMessagesAsRead(request.getReceiverId(), request.getSenderId());
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/isBirthday")
    public ResponseEntity<BirthdayCheckResponse> checkBirthday(@RequestParam("emp_id") Long empId) {
        try {
            boolean isBirthday = employeeService.checkAndUpdateBirthdayStatus(empId);
            return ResponseEntity.ok(new BirthdayCheckResponse(isBirthday));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new BirthdayCheckResponse(false));
        }
    }

    @DeleteMapping("/cleanMessages")
    public ResponseEntity<String> cleanOldMessages() {
        try {
            int deletedCount = employeeService.cleanOldBirthdayMessages();
            return ResponseEntity.ok("Deleted " + deletedCount + " old birthday messages");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to clean old messages: " + e.getMessage());
        }
    }
}