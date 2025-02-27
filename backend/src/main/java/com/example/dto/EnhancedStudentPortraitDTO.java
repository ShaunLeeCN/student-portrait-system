package com.example.dto;

import com.example.entity.CourseRecord;
import com.example.entity.Student;
import com.example.entity.StudentTag;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class EnhancedStudentPortraitDTO extends StudentPortraitDTO {
    // 成绩预测
    private Map<String, Object> scorePrediction;
    
    // 能力雷达图数据
    private Map<String, Object> radarChartData;
    
    // 成绩趋势分析
    private Map<String, Object> scoreTrendAnalysis;
    
    // 与平均水平的差距
    private Map<String, Object> performanceGap;
    
    // 推荐课程
    private List<String> recommendedCourses;
    
    // 个性化学习建议
    private List<String> learningRecommendations;
}
