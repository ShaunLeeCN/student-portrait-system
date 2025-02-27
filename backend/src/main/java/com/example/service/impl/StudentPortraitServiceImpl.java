package com.example.service.impl;

import com.example.dto.EnhancedStudentPortraitDTO;
import com.example.dto.StudentPortraitDTO;
import com.example.entity.CourseRecord;
import com.example.entity.Student;
import com.example.entity.StudentTag;
import com.example.service.CourseRecordService;
import com.example.service.DataAnalysisService;
import com.example.service.StudentPortraitService;
import com.example.service.StudentService;
import com.example.service.StudentTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentPortraitServiceImpl implements StudentPortraitService {
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private CourseRecordService courseRecordService;
    
    @Autowired
    private StudentTagService studentTagService;
    
    @Autowired
    private DataAnalysisService dataAnalysisService;
    
    @Override
    public StudentPortraitDTO getStudentPortrait(String studentNumber) {
        StudentPortraitDTO portraitDTO = new StudentPortraitDTO();
        
        // 获取基本信息
        Student student = studentService.lambdaQuery()
                .eq(Student::getStudentNumber, studentNumber)
                .one();
        portraitDTO.setBasicInfo(student);
        
        // 获取课程记录
        List<CourseRecord> courseRecords = courseRecordService.getByStudentNumber(studentNumber);
        portraitDTO.setCourseRecords(courseRecords);
        
        // 计算学习情况统计
        if (!courseRecords.isEmpty()) {
            double avgScore = courseRecords.stream()
                    .mapToInt(CourseRecord::getScore)
                    .average()
                    .orElse(0.0);
            portraitDTO.setAverageScore(avgScore);
            
            int totalCredits = courseRecords.stream()
                    .mapToInt(CourseRecord::getCredit)
                    .sum();
            portraitDTO.setTotalCredits(totalCredits);
            
            portraitDTO.setCourseCount(courseRecords.size());
        }
        
        // 获取标签信息
        List<StudentTag> allTags = studentTagService.getTagsByStudentNumber(studentNumber);
        
        // 分类标签
        if (!allTags.isEmpty()) {
            List<StudentTag> academicTags = allTags.stream()
                    .filter(tag -> "学习能力".equals(tag.getTagType()))
                    .collect(Collectors.toList());
            portraitDTO.setAcademicTags(academicTags);
            
            List<StudentTag> interestTags = allTags.stream()
                    .filter(tag -> "兴趣偏好".equals(tag.getTagType()))
                    .collect(Collectors.toList());
            portraitDTO.setInterestTags(interestTags);
        }
        
        // 其他统计指标
        Map<String, Object> statistics = new HashMap<>();
        
        // 添加课程类型分布
        Map<String, Long> courseTypeDistribution = courseRecords.stream()
                .collect(Collectors.groupingBy(CourseRecord::getCourseType, Collectors.counting()));
        statistics.put("courseTypeDistribution", courseTypeDistribution);
        
        // 添加学期成绩变化趋势
        Map<String, Double> semesterScoreTrend = courseRecords.stream()
                .collect(Collectors.groupingBy(
                        CourseRecord::getSemester,
                        Collectors.averagingInt(CourseRecord::getScore)));
        statistics.put("semesterScoreTrend", semesterScoreTrend);
        
        portraitDTO.setStatistics(statistics);
        
        return portraitDTO;
    }
    
    @Override
    public void calculateAndUpdateStudentPortrait(String studentNumber) {
        // 更新所有标签
        studentTagService.calculateAndUpdateAllTags(studentNumber);
    }
    
    @Override
    public EnhancedStudentPortraitDTO getEnhancedStudentPortrait(String studentNumber) {
        // 首先获取基础画像
        StudentPortraitDTO basePortrait = getStudentPortrait(studentNumber);
        
        // 创建增强版画像并复制基础数据
        EnhancedStudentPortraitDTO enhancedPortrait = new EnhancedStudentPortraitDTO();
        enhancedPortrait.setBasicInfo(basePortrait.getBasicInfo());
        enhancedPortrait.setAverageScore(basePortrait.getAverageScore());
        enhancedPortrait.setTotalCredits(basePortrait.getTotalCredits());
        enhancedPortrait.setCourseCount(basePortrait.getCourseCount());
        enhancedPortrait.setCourseRecords(basePortrait.getCourseRecords());
        enhancedPortrait.setAcademicTags(basePortrait.getAcademicTags());
        enhancedPortrait.setInterestTags(basePortrait.getInterestTags());
        enhancedPortrait.setStatistics(basePortrait.getStatistics());
        
        // 添加增强功能：成绩预测
        Map<String, Object> scorePrediction = dataAnalysisService.predictStudentScore(studentNumber, "必修");
        enhancedPortrait.setScorePrediction(scorePrediction);
        
        // 添加增强功能：能力雷达图
        Map<String, Object> radarChartData = dataAnalysisService.generateStudentRadarChart(studentNumber);
        enhancedPortrait.setRadarChartData(radarChartData);
        
        // 添加增强功能：成绩趋势分析
        Map<String, Object> scoreTrendAnalysis = dataAnalysisService.analyzeStudentScoreTrend(studentNumber);
        enhancedPortrait.setScoreTrendAnalysis(scoreTrendAnalysis);
        
        // 添加增强功能：与平均水平的差距
        Map<String, Object> performanceGap = dataAnalysisService.analyzeStudentPerformanceGap(studentNumber);
        enhancedPortrait.setPerformanceGap(performanceGap);
        
        // 添加增强功能：推荐课程
        List<String> recommendedCourses = generateCourseRecommendations(studentNumber);
        enhancedPortrait.setRecommendedCourses(recommendedCourses);
        
        // 添加增强功能：学习建议
        List<String> learningRecommendations = generateLearningRecommendations(studentNumber, performanceGap, scoreTrendAnalysis);
        enhancedPortrait.setLearningRecommendations(learningRecommendations);
        
        return enhancedPortrait;
    }
    
    /**
     * 基于学生的标签和成绩生成课程推荐
     */
    private List<String> generateCourseRecommendations(String studentNumber) {
        List<String> recommendations = new ArrayList<>();
        
        // 获取学生标签
        List<StudentTag> interestTags = studentTagService.getTagsByStudentNumberAndType(studentNumber, "兴趣偏好");
        
        // 基于兴趣标签推荐课程
        if (!interestTags.isEmpty()) {
            for (StudentTag tag : interestTags) {
                String tagName = tag.getTagName();
                
                if (tagName.contains("计算机类")) {
                    recommendations.add("高级算法设计");
                    recommendations.add("云计算与分布式系统");
                    recommendations.add("人工智能基础");
                } else if (tagName.contains("数学类")) {
                    recommendations.add("高等数学进阶");
                    recommendations.add("概率论与数理统计");
                    recommendations.add("离散数学");
                } else if (tagName.contains("语言类")) {
                    recommendations.add("高级商务英语");
                    recommendations.add("学术写作");
                    recommendations.add("跨文化交流");
                }
            }
        }
        
        // 如果没有基于兴趣的推荐，则提供一些通用推荐
        if (recommendations.isEmpty()) {
            recommendations.add("数据分析与可视化");
            recommendations.add("批判性思维");
            recommendations.add("项目管理");
        }
        
        return recommendations;
    }
    
    /**
     * 基于学生的表现生成学习建议
     */
    private List<String> generateLearningRecommendations(
            String studentNumber, 
            Map<String, Object> performanceGap, 
            Map<String, Object> scoreTrend) {
        List<String> recommendations = new ArrayList<>();
        
        // 基于与平均水平的差距给出建议
        if (performanceGap != null) {
            // 找出学生表现较弱的科目
            Map<String, Double> courseGaps = (Map<String, Double>) performanceGap.get("courseGaps");
            if (courseGaps != null) {
                List<Map.Entry<String, Double>> weakCourses = courseGaps.entrySet().stream()
                        .filter(entry -> entry.getValue() < -5)  // 低于平均水平5分以上的科目
                        .sorted(Map.Entry.comparingByValue())
                        .limit(2)
                        .collect(Collectors.toList());
                
                for (Map.Entry<String, Double> course : weakCourses) {
                    recommendations.add("建议加强" + course.getKey() + "的学习，目前与平均水平相差" + 
                                        Math.abs(course.getValue().intValue()) + "分");
                }
            }
        }
        
        // 基于成绩趋势给出建议
        if (scoreTrend != null && scoreTrend.containsKey("overallTrend")) {
            String trend = (String) scoreTrend.get("overallTrend");
            
            if ("明显下降".equals(trend) || "略有下降".equals(trend)) {
                recommendations.add("近期学习成绩呈下降趋势，建议调整学习计划和方法");
            } else if ("稳定".equals(trend)) {
                recommendations.add("学习成绩保持稳定，建议尝试新的学习方法以取得突破");
            } else if ("明显上升".equals(trend)) {
                recommendations.add("学习进步明显，请继续保持当前的学习状态和方法");
            }
        }
        
        // 添加通用学习建议
        recommendations.add("建议定期复习，构建知识体系，提高学习效率");
        recommendations.add("合理安排学习时间，保持作息规律，增强身体素质");
        
        return recommendations;
    }
}
