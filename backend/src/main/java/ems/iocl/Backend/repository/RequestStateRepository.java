package ems.iocl.Backend.repository;

import ems.iocl.Backend.entity.RequestState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RequestStateRepository extends JpaRepository<RequestState, Long> {
    RequestState findByEmpId(Long empId);

    @Modifying
    @Query("DELETE FROM RequestState rs WHERE rs.empId = :empId")
    void deleteByEmpId(@Param("empId") Long empId);


}
