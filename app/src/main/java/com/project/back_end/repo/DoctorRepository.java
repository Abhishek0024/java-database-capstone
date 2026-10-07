package com.project.back_end.repo;

import com.project.back_end.models.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    //  Custom Query Methods:
    // Find doctor by exact email
    Doctor findByEmail(String email);

    // Find doctors whose name matches a LIKE pattern (case-sensitive)
    List<Doctor> findByNameLike(String name);

    // Find doctors by name (contains, ignore case) and specialty (exact match, ignore case)
    List<Doctor> findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(String name, String specialty);

    // Find doctors by specialty (case-insensitive)
    List<Doctor> findBySpecialtyIgnoreCase(String specialty);
}