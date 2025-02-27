package com.example.controller;

import com.example.dto.EnhancedStudentPortraitDTO;
import com.example.dto.StudentPortraitDTO;
import com.example.service.StudentPortraitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portrait")
public class StudentPortraitController {

    @Autowired
    private StudentPortraitService studentPortraitService;
    
    @GetMapping("/{studentNumber}")
    public StudentPortraitDTO getStudentPortrait(@PathVariable String studentNumber) {
        return studentPortraitService.getStudentPortrait(studentNumber);
    }
    
    @GetMapping("/enhanced/{studentNumber}")
    public EnhancedStudentPortraitDTO getEnhancedStudentPortrait(@PathVariable String studentNumber) {
        return studentPortraitService.getEnhancedStudentPortrait(studentNumber);
    }
    
    @PostMapping("/calculate/{studentNumber}")
    public String calculateStudentPortrait(@PathVariable String studentNumber) {
        studentPortraitService.calculateAndUpdateStudentPortrait(studentNumber);
        return "学生画像计算更新完成";
    }
}
