package com.example.service;

import java.util.List;
import java.util.Map;

/**
 * 数据分析服务接口
 * 负责处理复杂的数据统计和分析功能
 */
public interface DataAnalysisService {
    
    /**
     * 分析学生成绩分布
     */
    Map<String, Object> analyzeScoreDistribution();
    
    /**
     * 分析专业平均成绩排名
     */
    List<Map<String, Object>> analyzeMajorRanking();
    
    /**
     * 分析学生成绩趋势
     * @param studentNumber 学号
     */
    Map<String, Object> analyzeStudentScoreTrend(String studentNumber);
    
    /**
     * 分析学生与平均水平的差异
     * @param studentNumber 学号
     */
    Map<String, Object> analyzeStudentPerformanceGap(String studentNumber);
    
    /**
     * 预测学生在某类课程的可能成绩
     * @param studentNumber 学号
     * @param courseType 课程类型
     */
    Map<String, Object> predictStudentScore(String studentNumber, String courseType);
    
    /**
     * 生成学生综合能力雷达图数据
     * @param studentNumber 学号
     */
    Map<String, Object> generateStudentRadarChart(String studentNumber);
}
