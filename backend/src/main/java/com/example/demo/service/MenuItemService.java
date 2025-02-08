package com.example.demo.service;

import jakarta.persistence.criteria.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.demo.model.MenuItem;
import com.example.demo.repository.MenuItemRepository;
import com.example.demo.utils.APIFeatures;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

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

			// Apply sorting if the 'sort' parameter exists
			if(queryParams.containsKey("sort")) {
				String sortParam = queryParams.get("sort");
				List<Order> orders = Arrays.stream(sortParam.split(","))
						.map(sortField -> {
							boolean isDescending = sortField.startsWith("-");
							String fieldName = isDescending ? sortField.substring(1) : sortField;

							if(isDescending) {
								return criteriaBuilder.desc(root.get(fieldName));
							}else {
								return criteriaBuilder.asc(root.get(fieldName));
							}
						})
						.collect(Collectors.toList());
				query.orderBy(orders);
			}
    		
    		return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    	};
    	return menuItemRepository.findAll(spec);
    }

	public Map<String, Object> getAllMenuItemsWithPagination(Map<String, String> queryParams) {
		// Extract pagination parameters
		int page = Integer.parseInt(queryParams.getOrDefault("page", "0"));
		int size = Integer.parseInt(queryParams.getOrDefault("size", "10"));

		// Create pageable object for pagination
		Pageable pageable = PageRequest.of(page, size);


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

			// Apply sorting if the 'sort' parameter exists
			if(queryParams.containsKey("sort")) {
				String sortParam = queryParams.get("sort");
				List<Order> orders = Arrays.stream(sortParam.split(","))
						.map(sortField -> {
							boolean isDescending = sortField.startsWith("-");
							String fieldName = isDescending ? sortField.substring(1) : sortField;

							if(isDescending) {
								return criteriaBuilder.desc(root.get(fieldName));
							}else {
								return criteriaBuilder.asc(root.get(fieldName));
							}
						})
						.collect(Collectors.toList());
				query.orderBy(orders);
			}

			return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
		};

		// Return paginated result
		Page<MenuItem> result = menuItemRepository.findAll(spec, pageable);

		// Prepare the response structure without 'next' and 'previous'
		Map<String, Object> response = new HashMap<>();
		response.put("count", result.getTotalElements());
		response.put("results", result.getContent());

		return response;
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

    public MenuItem partiallyUpdateMenuItem(Long id, MenuItem menuItem) {
		MenuItem existingMenuItem = menuItemRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("MenuItem not found"));

		// Update only non-null fields
		if(menuItem.getName() != null) {
			existingMenuItem.setName(menuItem.getName());
		}

		if(menuItem.getDescription() != null) {
			existingMenuItem.setDescription(menuItem.getDescription());
		}

		if(menuItem.getImage_url() != null) {
			existingMenuItem.setImage_url(menuItem.getImage_url());
		}

		existingMenuItem.setPrice(menuItem.getPrice());
		existingMenuItem.setPreparation_time_in_min(menuItem.getPreparation_time_in_min());
		existingMenuItem.setCategories(menuItem.getCategories());

		return menuItemRepository.save(existingMenuItem);
    }
}
