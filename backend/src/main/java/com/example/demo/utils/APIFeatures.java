package com.example.demo.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class APIFeatures<T> {
    private CriteriaBuilder builder;
    private CriteriaQuery<T> query;
    private Root<T> root;
    private Map<String, String> queryString;

    public APIFeatures(CriteriaBuilder builder, CriteriaQuery<T> query, Root<T> root, Map<String, String> queryString) {
        this.builder = builder;
        this.query = query;
        this.root = root;
        this.queryString = queryString;
    }

    public CriteriaQuery<T> filter() {
        List<Predicate> predicates = new ArrayList<>();

        queryString.forEach((key, value) -> {
            if (!key.equals("page") && !key.equals("sort") && !key.equals("limit") && !key.equals("fields")) {
                if (key.endsWith("gte")) {
                    predicates.add(builder.greaterThanOrEqualTo(root.get(key.replace("_gte", "")), value));
                } else if (key.endsWith("gt")) {
                    predicates.add(builder.greaterThan(root.get(key.replace("_gt", "")), value));
                } else if (key.endsWith("lte")) {
                    predicates.add(builder.lessThanOrEqualTo(root.get(key.replace("_lte", "")), value));
                } else if (key.endsWith("lt")) {
                    predicates.add(builder.lessThan(root.get(key.replace("_lt", "")), value));
                } else {
                    predicates.add(builder.equal(root.get(key), value));
                }
            }
        });

        query.where(predicates.toArray(new Predicate[0]));
        return query;
    }

    public Sort sort() {
        if (queryString.containsKey("sort")) {
            String sortBy = queryString.get("sort").replace(",", " ");
            return Sort.by(Sort.Order.by(sortBy));
        } else {
            return Sort.by(Sort.Order.desc("createdAt"));
        }
    }

    public CriteriaQuery<T> limitFields() {
        if (queryString.containsKey("fields")) {
            String fieldsParam = queryString.get("fields");
            String[] fields = fieldsParam.split(",");
            query.multiselect(getSelections(fields));
        }
        return query;
    }

    private List<jakarta.persistence.criteria.Selection<?>> getSelections(String[] fields) {
        List<jakarta.persistence.criteria.Selection<?>> selections = new ArrayList<>();
        for (String field : fields) {
            selections.add(root.get(field));
        }
        return selections;
    }

//    public Pageable paginate() {
//        int page = queryString.containsKey("page") ? Integer.parseInt(queryString.get("page")) : 1;
//        int limit = queryString.containsKey("limit") ? Integer.parseInt(queryString.get("limit")) : 100;
//        return PageRequest.of(page - 1, limit, sort());
//    }
}
