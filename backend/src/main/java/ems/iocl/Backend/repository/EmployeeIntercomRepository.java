package ems.iocl.Backend.repository;

import ems.iocl.Backend.entity.EmployeeIntercom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeIntercomRepository extends JpaRepository<EmployeeIntercom, Long> {

    EmployeeIntercom findByEmpNo(String empNo);

    @Query("SELECT COUNT(i) > 0 FROM EmployeeIntercom i WHERE i.empNo = :empNo")
    boolean existsByEmpNo(@Param("empNo") String empNo);

    @Modifying
    @Query("DELETE FROM EmployeeIntercom e WHERE e.id IN :ids")
    int deleteAllByIdIn(@Param("ids") List<Long> ids);
}
