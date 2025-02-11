package com.example.demo.service;

import com.example.demo.model.Canteen;
import com.example.demo.model.MenuItem;
import com.example.demo.model.User;
import com.example.demo.repository.CanteenRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CanteenService {
    private final CanteenRepository canteenRepository;
    private final UserRepository userRepository;

    @Autowired
    public CanteenService(CanteenRepository canteenRepository, UserRepository userRepository) {
        this.canteenRepository = canteenRepository;
        this.userRepository = userRepository;
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

    public boolean isUserOwnerOfCanteen(Integer userId, Long canteenId) {
        User user = userRepository.findById(userId).orElse(null);  // Fetch user by userId

        if (user == null) {
            return false;  // User not found
        }

        Canteen canteen = canteenRepository.findById(canteenId).orElse(null);  // Fetch canteen by canteenId

        if (canteen == null) {
            return false;  // Canteen not found
        }

        // Check if the user has the ROLE_OWNER and is associated with the canteen
        return canteen.getUser().equals(user);
    }


    @Transactional
    public void deleteCanteen(Long id) {
        if(this.canteenRepository.existsById(id)) {
            this.canteenRepository.deleteById(id);
        }else {
            throw new RuntimeException("Canteen not found");
        }
    }

    public Canteen getCanteenByUserId(Integer userId) {
        return canteenRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Canteen not found for user ID: " + userId));
    }
}
