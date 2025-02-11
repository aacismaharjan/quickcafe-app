package com.example.demo.repository;

import com.example.demo.model.Canteen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface CanteenRepository extends JpaRepository<Canteen, Long>, JpaSpecificationExecutor<Canteen> {
    Optional<Canteen> findByUser_Id(Integer userId);
}
