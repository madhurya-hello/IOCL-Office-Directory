package ems.iocl.Backend.repository;

import ems.iocl.Backend.entity.Employee;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByEmpNo(String empNo);

    @Query("SELECT e FROM Employee e JOIN e.employeeContact c WHERE c.email = :email")
    Employee findByEmail(@Param("email") String email);

    @Query("SELECT e FROM Employee e JOIN e.employeeProfile p WHERE MONTH(p.birthDate) = :month")
    List<Employee> findByBirthMonth(@Param("month") int month);

    @Query("SELECT e FROM Employee e JOIN e.employeeStatus s WHERE e.empId BETWEEN :start AND :end AND s.isDeleted = false")
    List<Employee> findEmployeesByIdRange(@Param("start") Long start, @Param("end") Long end);

    @Modifying
    @Query("UPDATE EmployeeStatus s SET s.isDeleted = true, s.deletedOn = :deletedOn WHERE s.empId = :empId")
    void softDeleteEmployee(@Param("empId") Long empId, @Param("deletedOn") LocalDate deletedOn);

    @Modifying
    @Query("UPDATE EmployeeStatus s SET s.isDeleted = false WHERE s.empId IN :ids")
    int restoreEmployees(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM EmployeeStatus s WHERE s.empId IN :ids")
    void deleteEmployeeStatuses(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM EmployeeProfile p WHERE p.empId IN :ids")
    void deleteEmployeeProfiles(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM EmployeeJob j WHERE j.empId IN :ids")
    void deleteEmployeeJobs(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM EmployeeContact c WHERE c.empId IN :ids")
    void deleteEmployeeContacts(@Param("ids") List<Long> ids);

    @Modifying
    @Query("DELETE FROM Employee e WHERE e.empId IN :ids")
    void deleteAllByEmpIdIn(@Param("ids") List<Long> ids);

    @Query("SELECT e FROM Employee e JOIN e.employeeStatus s WHERE s.isDeleted = false ORDER BY e.empId")
    List<Employee> findAllActiveEmployees(Pageable pageable);

    @Query("SELECT COUNT(e) FROM Employee e JOIN e.employeeStatus s WHERE s.isDeleted = false")
    long countActiveEmployees();

    @Query("SELECT ej.function as function, " +
            "SUM(CASE WHEN ep.gender = 'Male' THEN 1 ELSE 0 END) as noOfMales, " +
            "SUM(CASE WHEN ep.gender = 'Female' THEN 1 ELSE 0 END) as noOfFemales " +
            "FROM Employee e " +
            "JOIN e.employeeJob ej " +
            "JOIN e.employeeProfile ep " +
            "JOIN e.employeeStatus es " +
            "WHERE es.isDeleted = false " +
            "GROUP BY ej.function")
    List<Object[]> getFunctionGenderStats();

    @Query("SELECT ej.parentDivision as division, COUNT(e) as noOfEmployees " +
            "FROM Employee e " +
            "JOIN e.employeeJob ej " +
            "JOIN e.employeeStatus es " +
            "WHERE es.isDeleted = false " +
            "GROUP BY ej.parentDivision")
    List<Object[]> getDivisionEmployeeCounts();

    @Query("SELECT e FROM Employee e JOIN e.employeeStatus s WHERE s.isDeleted = true")
    List<Employee> findAllDeletedEmployees();

    @Query("SELECT ep.bloodGroup as bloodGroup, COUNT(e) as noOfEmployees " +
            "FROM Employee e " +
            "JOIN e.employeeProfile ep " +
            "JOIN e.employeeStatus es " +
            "WHERE es.isDeleted = false " +
            "GROUP BY ep.bloodGroup")
    List<Object[]> getBloodGroupEmployeeCounts();

    @Modifying
    @Query("UPDATE EmployeeJob j SET j.password = :newPassword WHERE j.empId = :empId")
    void updatePassword(@Param("empId") Long empId, @Param("newPassword") String newPassword);

    @Query("SELECT COUNT(e) FROM Employee e JOIN e.employeeStatus s WHERE s.isDeleted = true")
    long countDeletedEmployees();

    @Query("SELECT e FROM Employee e JOIN e.employeeProfile p " +
            "WHERE DAY(p.birthDate) = DAY(CURRENT_DATE) AND MONTH(p.birthDate) = MONTH(CURRENT_DATE)")
    List<Employee> findEmployeesWithBirthdayToday();

    @Query("SELECT COUNT(e) > 0 FROM Employee e WHERE e.empNo = :empNo")
    boolean existsByEmpNo(@Param("empNo") String empNo);

    @Query("SELECT e FROM Employee e JOIN e.employeeStatus s WHERE s.isDeleted = false ORDER BY e.empId")
    List<Employee> findAllActiveEmployees();

    @Modifying
    @Query("UPDATE EmployeeStatus s SET s.isDeleted = true, s.deletedOn = :deletedOn WHERE s.empId IN :ids")
    void softDeleteEmployees(@Param("ids") List<Long> ids, @Param("deletedOn") LocalDate deletedOn);

}

