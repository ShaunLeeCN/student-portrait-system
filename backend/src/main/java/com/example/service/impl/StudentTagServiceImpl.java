package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.entity.CourseRecord;
import com.example.entity.Student;
import com.example.entity.StudentTag;
import com.example.mapper.StudentTagMapper;
import com.example.service.CourseRecordService;
import com.example.service.StudentService;
import com.example.service.StudentTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentTagServiceImpl extends ServiceImpl<StudentTagMapper, StudentTag> implements StudentTagService {
    
    @Autowired
    private StudentTagMapper studentTagMapper;
    
    @Autowired
    private CourseRecordService courseRecordService;
    
    @Autowired
    private StudentService studentService;
    
    @Override
    public List<StudentTag> getTagsByStudentNumber(String studentNumber) {
        return studentTagMapper.findByStudentNumber(studentNumber);
    }
    
    @Override
    public List<StudentTag> getTagsByStudentNumberAndType(String studentNumber, String tagType) {
        return studentTagMapper.findByStudentNumberAndTagType(studentNumber, tagType);
    }
    
    @Override
    @Transactional
    public void calculateAndUpdateAcademicTags(String studentNumber) {
        // 1. 删除学生现有的学习能力标签
        lambdaUpdate()
                .eq(StudentTag::getStudentNumber, studentNumber)
                .eq(StudentTag::getTagType, "学习能力")
                .remove();
        
        // 2. 获取学生的课程记录
        List<CourseRecord> courseRecords = courseRecordService.getByStudentNumber(studentNumber);
        
        if (courseRecords.isEmpty()) {
            return;
        }
        
        // 3. 计算学生的平均成绩
        double avgScore = courseRecords.stream()
                .mapToInt(CourseRecord::getScore)
                .average()
                .orElse(0.0);
        
        // 4. 创建学习能力标签
        StudentTag avgScoreTag = new StudentTag();
        avgScoreTag.setStudentNumber(studentNumber);
        avgScoreTag.setTagType("学习能力");
        avgScoreTag.setTagValue(avgScore);
        
        // 根据平均分设置具体标签名称
        if (avgScore >= 90) {
            avgScoreTag.setTagName("优秀生");
            avgScoreTag.setTagDesc("平均成绩90分以上");
        } else if (avgScore >= 80) {
            avgScoreTag.setTagName("良好生");
            avgScoreTag.setTagDesc("平均成绩80-89分");
        } else if (avgScore >= 70) {
            avgScoreTag.setTagName("中等生");
            avgScoreTag.setTagDesc("平均成绩70-79分");
        } else if (avgScore >= 60) {
            avgScoreTag.setTagName("及格生");
            avgScoreTag.setTagDesc("平均成绩60-69分");
        } else {
            avgScoreTag.setTagName("学习困难");
            avgScoreTag.setTagDesc("平均成绩低于60分");
        }
        
        // 5. 保存标签
        save(avgScoreTag);
        
        // 6. 计算各科目得分情况，找出优势和劣势科目
        Map<String, List<CourseRecord>> coursesByName = courseRecords.stream()
                .collect(Collectors.groupingBy(CourseRecord::getCourseName));
        
        for (Map.Entry<String, List<CourseRecord>> entry : coursesByName.entrySet()) {
            String courseName = entry.getKey();
            double courseAvg = entry.getValue().stream()
                    .mapToInt(CourseRecord::getScore)
                    .average()
                    .orElse(0.0);
            
            StudentTag courseTag = new StudentTag();
            courseTag.setStudentNumber(studentNumber);
            courseTag.setTagType("学习能力");
            courseTag.setTagValue(courseAvg);
            courseTag.setTagName(courseName + "能力");
            
            if (courseAvg >= 85) {
                courseTag.setTagDesc(courseName + "学习能力突出");
            } else if (courseAvg >= 70) {
                courseTag.setTagDesc(courseName + "学习能力一般");
            } else {
                courseTag.setTagDesc(courseName + "学习能力有待提高");
            }
            
            save(courseTag);
        }
    }
    
    @Override
    @Transactional
    public void calculateAndUpdateInterestTags(String studentNumber) {
        // 1. 删除学生现有的兴趣偏好标签
        lambdaUpdate()
                .eq(StudentTag::getStudentNumber, studentNumber)
                .eq(StudentTag::getTagType, "兴趣偏好")
                .remove();
        
        // 2. 获取学生的课程记录
        List<CourseRecord> courseRecords = courseRecordService.getByStudentNumber(studentNumber);
        
        if (courseRecords.isEmpty()) {
            return;
        }
        
        // 3. 按课程类型分组计算平均分，找出学生感兴趣的课程类型
        Map<String, Double> avgScoreByCourseType = new HashMap<>();
        Map<String, List<CourseRecord>> recordsByCourseType = courseRecords.stream()
                .collect(Collectors.groupingBy(cr -> {
                    String courseName = cr.getCourseName();
                    
                    if (courseName.contains("数学") || courseName.contains("统计")) {
                        return "数学类";
                    } else if (courseName.contains("英语") || courseName.contains("语言")) {
                        return "语言类";
                    } else if (courseName.contains("程序") || courseName.contains("计算机") || 
                              courseName.contains("数据") || courseName.contains("网络")) {
                        return "计算机类";
                    } else {
                        return "其他类";
                    }
                }));
        
        for (Map.Entry<String, List<CourseRecord>> entry : recordsByCourseType.entrySet()) {
            double avg = entry.getValue().stream()
                    .mapToInt(CourseRecord::getScore)
                    .average()
                    .orElse(0.0);
            avgScoreByCourseType.put(entry.getKey(), avg);
        }
        
        // 4. 找出得分最高的类别，认为是学生的兴趣所在
        Optional<Map.Entry<String, Double>> maxEntry = avgScoreByCourseType.entrySet().stream()
                .max(Map.Entry.comparingByValue());
        
        if (maxEntry.isPresent()) {
            String interestType = maxEntry.get().getKey();
            double score = maxEntry.get().getValue();
            
            StudentTag interestTag = new StudentTag();
            interestTag.setStudentNumber(studentNumber);
            interestTag.setTagType("兴趣偏好");
            interestTag.setTagName(interestType + "爱好者");
            interestTag.setTagValue(score);
            interestTag.setTagDesc("在" + interestType + "课程中表现突出，可能对此领域有浓厚兴趣");
            
            save(interestTag);
        }
        
        // 5. 分析选修课情况，进一步确定兴趣
        List<CourseRecord> electiveCourses = courseRecords.stream()
                .filter(cr -> "选修".equals(cr.getCourseType()))
                .collect(Collectors.toList());
        
        if (!electiveCourses.isEmpty()) {
            Map<String, Long> courseNameCount = electiveCourses.stream()
                    .collect(Collectors.groupingBy(CourseRecord::getCourseName, Collectors.counting()));
            
            courseNameCount.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(1)
                    .forEach(entry -> {
                        StudentTag electiveTag = new StudentTag();
                        electiveTag.setStudentNumber(studentNumber);
                        electiveTag.setTagType("兴趣偏好");
                        electiveTag.setTagName("选修偏好");
                        electiveTag.setTagValue(entry.getValue().doubleValue());
                        electiveTag.setTagDesc("经常选修" + entry.getKey() + "课程，表现出对该领域的兴趣");
                        
                        save(electiveTag);
                    });
        }
    }
    
    @Override
    @Transactional
    public void calculateAndUpdateAllTags(String studentNumber) {
        calculateAndUpdateAcademicTags(studentNumber);
        calculateAndUpdateInterestTags(studentNumber);
    }
    
    @Override
    public Map<String, Object> getTagStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // 统计各类型标签的数量
        statistics.put("学习能力标签数量", studentTagMapper.countByTagType("学习能力"));
        statistics.put("兴趣偏好标签数量", studentTagMapper.countByTagType("兴趣偏好"));
        
        return statistics;
    }
}
