package ems.iocl.Backend.repository;

import ems.iocl.Backend.entity.BirthdayMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BirthdayMessageRepository extends JpaRepository<BirthdayMessage, Long> {
    List<BirthdayMessage> findByReceiverEmpId(Long receiverId);

    @Query("SELECT COUNT(bm) FROM BirthdayMessage bm " +
            "WHERE bm.receiver.empId = :receiverId " +
            "AND bm.sender.empId = :senderId " +
            "AND bm.isRead = false")
    int countUnreadMessages(@Param("receiverId") Long receiverId,
                            @Param("senderId") Long senderId);

    List<BirthdayMessage> findByReceiverEmpIdAndSenderEmpId(Long receiverId, Long senderId);

    @Modifying
    @Query("DELETE FROM BirthdayMessage bm WHERE bm.receiver.empId = :empId")
    void deleteByReceiverEmpId(@Param("empId") Long empId);

    @Modifying
    @Query("DELETE FROM BirthdayMessage bm WHERE bm.timestamp < :cutoffDate")
    int deleteByTimestampBefore(@Param("cutoffDate") LocalDateTime cutoffDate);
}

