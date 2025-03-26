package com.example.service;

import com.example.entity.ApiAccessLog;

import java.util.List;
import java.util.Map;

public interface ApiAccessLogService {
    
    void saveLog(ApiAccessLog log);
    
    List<Map<String, Object>> getAccessCountByPath();
    
    List<Map<String, Object>> getAccessCountByDay();
    
    List<Map<String, Object>> getAccessCountByHour();
    
    List<Map<String, Object>> getApiPerformanceMetrics();
    
    Map<String, Object> getApiAccessStatistics();
}