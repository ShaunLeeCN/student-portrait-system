package com.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.entity.CourseRecord;

import java.util.List;
import java.util.Map;

public interface CourseRecordService extends IService<CourseRecord> {
    /**
     * 根据学号获取课程记录
     */
    List<CourseRecord> getByStudentNumber(String studentNumber);
    
    /**
     * 计算平均分
     */
    Double calculateAverageScore();
    
    /**
     * 按课程类型统计平均分
     */
    List<Map<String, Object>> calculateAverageScoreGroupByCourseType();
    
    /**
     * 按学期统计平均分
     */
    List<Map<String, Object>> calculateAverageScoreGroupBySemester();
}
