package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.entity.ApiAccessLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface ApiAccessLogMapper extends BaseMapper<ApiAccessLog> {
    
    @Select("SELECT path, COUNT(*) as count FROM api_access_log GROUP BY path ORDER BY count DESC")
    List<Map<String, Object>> countAccessByPath();
    
    @Select("SELECT DATE_FORMAT(access_time, '%Y-%m-%d') as date, COUNT(*) as count FROM api_access_log GROUP BY date ORDER BY date DESC")
    List<Map<String, Object>> countAccessByDay();
    
    @Select("SELECT HOUR(access_time) as hour, COUNT(*) as count FROM api_access_log GROUP BY hour ORDER BY hour")
    List<Map<String, Object>> countAccessByHour();
    
    @Select("SELECT AVG(execution_time) as avg_time, MAX(execution_time) as max_time, MIN(execution_time) as min_time, path FROM api_access_log GROUP BY path ORDER BY avg_time DESC")
    List<Map<String, Object>> analyzePerformanceByPath();
}