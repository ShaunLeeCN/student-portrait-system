package com.example.service;

import com.example.dto.EnhancedStudentPortraitDTO;
import com.example.dto.StudentPortraitDTO;

public interface StudentPortraitService {
    
    /**
     * 获取学生完整画像
     */
    StudentPortraitDTO getStudentPortrait(String studentNumber);
    
    /**
     * 计算并更新学生画像
     */
    void calculateAndUpdateStudentPortrait(String studentNumber);
    
    /**
     * 获取增强版学生画像
     */
    EnhancedStudentPortraitDTO getEnhancedStudentPortrait(String studentNumber);
}
