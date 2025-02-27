package com.example.controller;

import com.example.entity.CourseRecord;
import com.example.service.CourseRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseRecordController {

    @Autowired
    private CourseRecordService courseRecordService;
    
    @GetMapping
    public List<CourseRecord> getAllCourses() {
        return courseRecordService.list();
    }
    
    @GetMapping("/count")
    public Long countCourseRecords() {
        return courseRecordService.count();
    }
    @GetMapping("/{id}")
    public CourseRecord getCourseById(@PathVariable Long id) {
        return courseRecordService.getById(id);
    }
    
    @GetMapping("/student/{studentNumber}")
    public List<CourseRecord> getCoursesByStudentNumber(@PathVariable String studentNumber) {
        return courseRecordService.getByStudentNumber(studentNumber);
    }
    
    @GetMapping("/statistics/average")
    public Double getAverageScore() {
        return courseRecordService.calculateAverageScore();
    }
    
    @GetMapping("/statistics/average/courseType")
    public List<Map<String, Object>> getAverageScoreGroupByCourseType() {
        return courseRecordService.calculateAverageScoreGroupByCourseType();
    }
    
    @GetMapping("/statistics/average/semester")
    public List<Map<String, Object>> getAverageScoreGroupBySemester() {
        return courseRecordService.calculateAverageScoreGroupBySemester();
    }
}
