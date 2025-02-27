package com.example.controller;

import com.example.entity.StudentTag;
import com.example.service.StudentTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tags")
public class StudentTagController {

    @Autowired
    private StudentTagService studentTagService;
    
    // 添加一个新的端点，返回标签总数
    @GetMapping("/count")
    public Long getTagCount() {
        return studentTagService.count(); 
    }

    @GetMapping("/student/{studentNumber}")
    public List<StudentTag> getTagsByStudentNumber(@PathVariable String studentNumber) {
        return studentTagService.getTagsByStudentNumber(studentNumber);
    }
    
    @GetMapping("/student/{studentNumber}/type/{tagType}")
    public List<StudentTag> getTagsByStudentNumberAndType(
            @PathVariable String studentNumber,
            @PathVariable String tagType) {
        return studentTagService.getTagsByStudentNumberAndType(studentNumber, tagType);
    }
    
    @PostMapping("/calculate/academic/{studentNumber}")
    public String calculateAcademicTags(@PathVariable String studentNumber) {
        studentTagService.calculateAndUpdateAcademicTags(studentNumber);
        return "学习能力标签计算完成";
    }
    
    @PostMapping("/calculate/interest/{studentNumber}")
    public String calculateInterestTags(@PathVariable String studentNumber) {
        studentTagService.calculateAndUpdateInterestTags(studentNumber);
        return "兴趣偏好标签计算完成";
    }
    
    @PostMapping("/calculate/all/{studentNumber}")
    public String calculateAllTags(@PathVariable String studentNumber) {
        studentTagService.calculateAndUpdateAllTags(studentNumber);
        return "所有标签计算完成";
    }
    
    @GetMapping("/statistics")
    public Map<String, Object> getTagStatistics() {
        return studentTagService.getTagStatistics();
    }
}
