package com.example.demo.service;

import com.example.demo.model.Canteen;
import com.example.demo.model.MenuItem;
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
        Canteen existingCanteen = canteenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Canteen not found"));

        // Update fields only if they are not null or empty
        if (canteen.getName() != null && !canteen.getName().trim().isEmpty()) {
            existingCanteen.setName(canteen.getName());
        }
        if (canteen.getAbout() != null && !canteen.getAbout().trim().isEmpty()) {
            existingCanteen.setAbout(canteen.getAbout());
        }
        if (canteen.getEmail() != null && !canteen.getEmail().trim().isEmpty()) {
            existingCanteen.setEmail(canteen.getEmail());
        }
        if (canteen.getAddress() != null && !canteen.getAddress().trim().isEmpty()) {
            existingCanteen.setAddress(canteen.getAddress());
        }
        if (canteen.getImage_url() != null && !canteen.getImage_url().trim().isEmpty()) {
            existingCanteen.setImage_url(canteen.getImage_url());
        }
        if (canteen.getClosing_hours() != null) {
            existingCanteen.setClosing_hours(canteen.getClosing_hours());
        }
        if (canteen.getOpening_hours() != null) {
            existingCanteen.setOpening_hours(canteen.getOpening_hours());
        }
        if (canteen.getLatitude() != null) {
            existingCanteen.setLatitude(canteen.getLatitude());
        }
        if (canteen.getLongitude() != null) {
            existingCanteen.setLongitude(canteen.getLongitude());
        }
        if (canteen.getIs_active() != null) {
            existingCanteen.setIs_active(canteen.getIs_active());
        }
        if (canteen.getPhone_no() != null && !canteen.getPhone_no().trim().isEmpty()) {
            existingCanteen.setPhone_no(canteen.getPhone_no());
        }

        return canteenRepository.save(existingCanteen);
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
