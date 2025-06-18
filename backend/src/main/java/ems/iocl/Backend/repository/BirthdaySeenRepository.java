package ems.iocl.Backend.repository;

import ems.iocl.Backend.entity.BirthdaySeen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BirthdaySeenRepository extends JpaRepository<BirthdaySeen, Long> {
    Optional<BirthdaySeen> findByEmployeeEmpId(Long empId);
}