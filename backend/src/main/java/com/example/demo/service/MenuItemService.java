package com.example.demo.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.demo.model.MenuItem;
import com.example.demo.repository.MenuItemRepository;
import com.example.demo.utils.APIFeatures;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.awt.print.Pageable;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service 
public class MenuItemService {
	
	 public static String encode(String value) {
	        try {
	            return URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
	        } catch (UnsupportedEncodingException e) {
	            throw new RuntimeException("UTF-8 encoding not supported", e);
	        }
	    }

    private final MenuItemRepository menuItemRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public MenuItemService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuItem> getAllMenuItems(Map<String, String> queryParams) {
    	System.out.println(queryParams);
    	System.out.println("From getAllMenuItems");
    	Specification<MenuItem> spec = (root, query, criteriaBuilder) -> {
    		List<Predicate> predicates = new ArrayList<>();
    		queryParams.forEach((String key, String value) -> {
    			Pattern pattern = Pattern.compile("(\\w+)(?:\\[(gte|gt|lte|lt)\\])?$");    			
    			Matcher matcher = pattern.matcher(key);
    			
    			if(matcher.matches()) {
        			String paramName = matcher.group(1);
        	 		String operator = matcher.group(2);
        	 		Class<?> fieldType = null;
        	 		
                    try {
                    	fieldType = root.get(paramName).getJavaType();
                    }catch(Exception e) {
                    	// System.out.println(e);
                    }
                    
        			
                     if (fieldType == String.class) {
                         predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get(key)), "%" + value.toLowerCase() + "%"));
                     } else if(fieldType == Double.class || fieldType == Integer.class) {
                    	 switch(operator) {
                    	 case "gte":
                    		 predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get(paramName), Double.parseDouble(value)));
                    		 break;
                    	 case "gt": 
                    		 predicates.add(criteriaBuilder.greaterThan(root.get(paramName), Double.parseDouble(value)));
                    		 break;
                    	 case "lte":
                    		 predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get(paramName), Double.parseDouble(value)));
                    		 break;
                    	 case "lt":
                    		 predicates.add(criteriaBuilder.lessThan(root.get(paramName), Double.parseDouble(value)));
                    		 break;
                    	 }
                     }
    			}
    			
    		});
    		
    		return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    	};
    	return menuItemRepository.findAll(spec);
    }

    public Optional<MenuItem> getMenuItemById(Long id) {
        return menuItemRepository.findById(id);
    }

	@Transactional
    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

	@Transactional
    public MenuItem updateMenuItem(Long id, MenuItem menuItem) {
        if (menuItemRepository.existsById(id)) {
            menuItem.setId(id);
            return menuItemRepository.save(menuItem);
        } else {
            throw new RuntimeException("MenuItem not found");
        }
    }

	@Transactional
    public void deleteMenuItem(Long id) {
        if (menuItemRepository.existsById(id)) {
            menuItemRepository.deleteById(id);
        } else {
            throw new RuntimeException("MenuItem not found");
        }
    }
}
