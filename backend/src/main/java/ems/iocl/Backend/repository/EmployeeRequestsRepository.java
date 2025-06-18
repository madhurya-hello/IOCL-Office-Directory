package ems.iocl.Backend.repository;
import java.util.Optional;

import ems.iocl.Backend.entity.EmployeeRequests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRequestsRepository extends JpaRepository<EmployeeRequests, Long> {

    @Query("SELECT er.requestId, er.empId, er.empNo, CONCAT(er.firstName, ' ', er.lastName) as name, " +
            "er.requestDate, ec.phone as mobile, ec.email, er.message " +
            "FROM EmployeeRequests er " +
            "LEFT JOIN Employee e ON er.empId = e.empId " +
            "LEFT JOIN EmployeeContact ec ON e.empId = ec.empId")
    List<Object[]> findAllRequestsWithContactInfo();

    @Query("SELECT er FROM EmployeeRequests er WHERE er.requestId = :requestId")
    Optional<EmployeeRequests> findRequestById(@Param("requestId") Long requestId);

    @Query("SELECT COUNT(er) FROM EmployeeRequests er")
    long countAllRequests();

    @Modifying
    @Query("DELETE FROM EmployeeRequests er WHERE er.requestId = :requestId")
    void deleteByRequestId(@Param("requestId") Long requestId);
}
