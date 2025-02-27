package com.example.dto;

import com.example.entity.CourseRecord;
import com.example.entity.Student;
import com.example.entity.StudentTag;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class StudentPortraitDTO {
    // 基本信息
    private Student basicInfo;
    
    // 学习情况统计
    private Double averageScore;
    private Integer totalCredits;
    private Integer courseCount;
    
    // 课程记录
    private List<CourseRecord> courseRecords;
    
    // 标签信息
    private List<StudentTag> academicTags;  // 学习能力标签
    private List<StudentTag> interestTags;  // 兴趣偏好标签
    
    // 其他统计指标
    private Map<String, Object> statistics;
}
