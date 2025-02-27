package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    @Autowired
    private DataSource dataSource;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/health")
    public Map<String, Object> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());
        
        Map<String, Object> dbStatus = checkDatabaseConnection();
        health.put("database", dbStatus);
        
        return health;
    }
    
    @GetMapping("/db-status")
    public Map<String, Object> checkDatabaseConnection() {
        Map<String, Object> result = new HashMap<>();
        
        try (Connection conn = dataSource.getConnection()) {
            result.put("connection", "成功");
            result.put("database", conn.getCatalog());
            result.put("url", conn.getMetaData().getURL());
            result.put("username", conn.getMetaData().getUserName());
            
            // 测试简单查询
            Integer studentCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM student", Integer.class);
            result.put("student_count", studentCount);
            
            Integer courseCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM course_record", Integer.class);
            result.put("course_count", courseCount);
            
            try {
                Integer tagCount = jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM student_tag", Integer.class);
                result.put("tag_count", tagCount);
            } catch (Exception e) {
                result.put("tag_table_exists", false);
                result.put("tag_error", e.getMessage());
            }
            
        } catch (SQLException e) {
            result.put("connection", "失败");
            result.put("error", e.getMessage());
            result.put("errorCode", e.getErrorCode());
        }
        
        return result;
    }
    
    @GetMapping("/tables")
    public Map<String, Object> listTables() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 查询所有表
            List<String> tables = jdbcTemplate.queryForList(
                    "SHOW TABLES", String.class);
            result.put("tables", tables);
            
            // 统计各表的记录数
            Map<String, Integer> tableCounts = new HashMap<>();
            for (String table : tables) {
                Integer count = jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM " + table, Integer.class);
                tableCounts.put(table, count);
            }
            result.put("recordCounts", tableCounts);
            
        } catch (Exception e) {
            result.put("error", e.getMessage());
        }
        
        return result;
    }
}
