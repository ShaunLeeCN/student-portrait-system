package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.entity.CourseRecord;
import com.example.mapper.CourseRecordMapper;
import com.example.service.CourseRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CourseRecordServiceImpl extends ServiceImpl<CourseRecordMapper, CourseRecord> implements CourseRecordService {
    
    @Autowired
    private CourseRecordMapper courseRecordMapper;
    
    @Override
    public List<CourseRecord> getByStudentNumber(String studentNumber) {
        return courseRecordMapper.findByStudentNumber(studentNumber);
    }
    
    @Override
    public Double calculateAverageScore() {
        return courseRecordMapper.calculateAverageScore();
    }
    
    @Override
    public List<Map<String, Object>> calculateAverageScoreGroupByCourseType() {
        return courseRecordMapper.calculateAverageScoreGroupByCourseType();
    }
    
    @Override
    public List<Map<String, Object>> calculateAverageScoreGroupBySemester() {
        return courseRecordMapper.calculateAverageScoreGroupBySemester();
    }
}
