package com.example.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.entity.ApiAccessLog;
import com.example.mapper.ApiAccessLogMapper;
import com.example.service.ApiAccessLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ApiAccessLogServiceImpl implements ApiAccessLogService {

    @Autowired
    private ApiAccessLogMapper apiAccessLogMapper;
    
    @Override
    public void saveLog(ApiAccessLog log) {
        apiAccessLogMapper.insert(log);
    }
    
    @Override
    public List<Map<String, Object>> getAccessCountByPath() {
        return apiAccessLogMapper.countAccessByPath();
    }
    
    @Override
    public List<Map<String, Object>> getAccessCountByDay() {
        return apiAccessLogMapper.countAccessByDay();
    }
    
    @Override
    public List<Map<String, Object>> getAccessCountByHour() {
        return apiAccessLogMapper.countAccessByHour();
    }
    
    @Override
    public List<Map<String, Object>> getApiPerformanceMetrics() {
        return apiAccessLogMapper.analyzePerformanceByPath();
    }
    
    @Override
    public Map<String, Object> getApiAccessStatistics() {
        Map<String, Object> result = new HashMap<>();
        
        // 统计今日访问量
        LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LambdaQueryWrapper<ApiAccessLog> todayQuery = new LambdaQueryWrapper<>();
        todayQuery.ge(ApiAccessLog::getAccessTime, today);
        long todayCount = apiAccessLogMapper.selectCount(todayQuery);
        result.put("todayAccessCount", todayCount);
        
        // 统计总访问量
        long totalCount = apiAccessLogMapper.selectCount(null);
        result.put("totalAccessCount", totalCount);
        
        // 统计平均响应时间
        List<Map<String, Object>> performanceData = getApiPerformanceMetrics();
        double totalAvgTime = performanceData.stream()
                .mapToDouble(m -> Double.parseDouble(m.get("avg_time").toString()))
                .average()
                .orElse(0);
        result.put("averageResponseTime", totalAvgTime);
        
        return result;
    }
}