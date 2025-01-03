package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Favorite;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Integer userId);

//    @Query("DELETE FROM Favorite fav WHERE fav.user.id = :userId AND fav.menuItem.id = :menuItemId")
//    void deleteByUserIdAndMenuItemId(@Param("userId") Integer userId, @Param("menuItemId") Long menuItemId);
    @Transactional
    @Modifying
    void deleteByUserIdAndMenuItemId(Integer userId, Long menuItemId);
}
