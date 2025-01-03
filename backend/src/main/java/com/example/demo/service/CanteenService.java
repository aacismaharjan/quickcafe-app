package com.example.demo.service;

import com.example.demo.model.Canteen;
import com.example.demo.repository.CanteenRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CanteenService {
    private final CanteenRepository canteenRepository;

    @Autowired
    public CanteenService(CanteenRepository canteenRepository) {
        this.canteenRepository = canteenRepository;
    }

    public List<Canteen> getAllCanteens() {
        return this.canteenRepository.findAll();
    }

    public Optional<Canteen> getCanteenById(Long id) {
        return this.canteenRepository.findById(id);
    }

    @Transactional
    public Canteen createCanteen(Canteen canteen) {
        return this.canteenRepository.save(canteen);
    }
    @Transactional
    public Canteen updateCanteen(Long id, Canteen canteen) {
        if(this.canteenRepository.existsById(id)) {
            canteen.setId(id);
            return this.canteenRepository.save(canteen);
        }else {
            throw new RuntimeException("Canteen not found");
        }
    }
    @Transactional
    public void deleteCanteen(Long id) {
        if(this.canteenRepository.existsById(id)) {
            this.canteenRepository.deleteById(id);
        }else {
            throw new RuntimeException("Canteen not found");
        }
    }
}
