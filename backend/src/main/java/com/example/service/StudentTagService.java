package com.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.entity.StudentTag;

import java.util.List;
import java.util.Map;

public interface StudentTagService extends IService<StudentTag> {
    
    /**
     * 根据学号获取学生所有标签
     */
    List<StudentTag> getTagsByStudentNumber(String studentNumber);
    
    /**
     * 根据学号和标签类型获取学生标签
     */
    List<StudentTag> getTagsByStudentNumberAndType(String studentNumber, String tagType);
    
    /**
     * 计算并更新学生的学习能力标签
     */
    void calculateAndUpdateAcademicTags(String studentNumber);
    
    /**
     * 计算并更新学生的兴趣偏好标签
     */
    void calculateAndUpdateInterestTags(String studentNumber);
    
    /**
     * 计算并更新学生的全部标签
     */
    void calculateAndUpdateAllTags(String studentNumber);
    
    /**
     * 获取标签统计信息
     */
    Map<String, Object> getTagStatistics();
}
