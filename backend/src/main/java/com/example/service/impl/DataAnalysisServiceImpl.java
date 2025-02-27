// 文件路径: src/main/java/com/example/service/impl/DataAnalysisServiceImpl.java
package com.example.service.impl;

import com.example.entity.CourseRecord;
import com.example.entity.Student;
import com.example.service.CourseRecordService;
import com.example.service.DataAnalysisService;
import com.example.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DataAnalysisServiceImpl implements DataAnalysisService {
    
    @Autowired
    private CourseRecordService courseRecordService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Override
    public Map<String, Object> analyzeScoreDistribution() {
        Map<String, Object> result = new HashMap<>();
        
        // 查询所有课程记录
        List<CourseRecord> allRecords = courseRecordService.list();
        
        if (allRecords.isEmpty()) {
            return result;
        }
        
        // 计算分数分布
        Map<String, Long> distribution = new HashMap<>();
        distribution.put("优秀(90-100)", 
                          allRecords.stream().filter(r -> r.getScore() >= 90).count());
        distribution.put("良好(80-89)", 
                          allRecords.stream().filter(r -> r.getScore() >= 80 && r.getScore() < 90).count());
        distribution.put("中等(70-79)", 
                          allRecords.stream().filter(r -> r.getScore() >= 70 && r.getScore() < 80).count());
        distribution.put("及格(60-69)", 
                          allRecords.stream().filter(r -> r.getScore() >= 60 && r.getScore() < 70).count());
        distribution.put("不及格(<60)", 
                          allRecords.stream().filter(r -> r.getScore() < 60).count());
        
        result.put("scoreDistribution", distribution);
        
        // 计算统计指标
        DoubleSummaryStatistics stats = allRecords.stream()
                .mapToDouble(CourseRecord::getScore)
                .summaryStatistics();
        
        result.put("averageScore", stats.getAverage());
        result.put("maxScore", stats.getMax());
        result.put("minScore", stats.getMin());
        result.put("totalRecords", stats.getCount());
        
        // 计算中位数
        List<Integer> scores = allRecords.stream()
                .map(CourseRecord::getScore)
                .sorted()
                .collect(Collectors.toList());
        
        double median;
        int middle = scores.size() / 2;
        if (scores.size() % 2 == 0) {
            median = (scores.get(middle - 1) + scores.get(middle)) / 2.0;
        } else {
            median = scores.get(middle);
        }
        result.put("medianScore", median);
        
        // 添加必修课与选修课的平均分对比
        double requiredAvg = allRecords.stream()
                .filter(r -> "必修".equals(r.getCourseType()))
                .mapToInt(CourseRecord::getScore)
                .average()
                .orElse(0.0);
        
        double electiveAvg = allRecords.stream()
                .filter(r -> "选修".equals(r.getCourseType()))
                .mapToInt(CourseRecord::getScore)
                .average()
                .orElse(0.0);
        
        Map<String, Double> courseTypeAvg = new HashMap<>();
        courseTypeAvg.put("必修课", requiredAvg);
        courseTypeAvg.put("选修课", electiveAvg);
        result.put("courseTypeAverages", courseTypeAvg);
        
        return result;
    }
    
    @Override
    public List<Map<String, Object>> analyzeMajorRanking() {
        // 使用SQL直接计算各专业平均成绩
        String sql = "SELECT s.major, AVG(c.score) as avg_score, " +
                "COUNT(DISTINCT s.student_number) as student_count, " +
                "COUNT(c.id) as course_count " +
                "FROM student s " +
                "JOIN course_record c ON s.student_number = c.student_number " +
                "GROUP BY s.major " +
                "ORDER BY avg_score DESC";
        
        return jdbcTemplate.queryForList(sql);
    }
    
    @Override
    public Map<String, Object> analyzeStudentScoreTrend(String studentNumber) {
        Map<String, Object> result = new HashMap<>();
        
        // 获取学生课程记录
        List<CourseRecord> records = courseRecordService.getByStudentNumber(studentNumber);
        
        if (records.isEmpty()) {
            return result;
        }
        
        // 按学期分组计算平均分
        Map<String, Double> semesterScores = records.stream()
                .collect(Collectors.groupingBy(
                        CourseRecord::getSemester,
                        Collectors.averagingInt(CourseRecord::getScore)
                ));
        
        // 确保学期按时间排序
        Map<String, Double> sortedSemesterScores = new TreeMap<>(semesterScores);
        
        result.put("semesterTrend", sortedSemesterScores);
        
        // 计算学生总体趋势
        List<Double> scoreValues = new ArrayList<>(sortedSemesterScores.values());
        String trend = "稳定";
        
        if (scoreValues.size() >= 2) {
            double firstScore = scoreValues.get(0);
            double lastScore = scoreValues.get(scoreValues.size() - 1);
            double difference = lastScore - firstScore;
            
            if (difference > 5) {
                trend = "明显上升";
            } else if (difference > 2) {
                trend = "略有上升";
            } else if (difference < -5) {
                trend = "明显下降";
            } else if (difference < -2) {
                trend = "略有下降";
            }
        }
        
        result.put("overallTrend", trend);
        
        // 计算每学期与上学期的变化
        if (scoreValues.size() >= 2) {
            List<String> semesters = new ArrayList<>(sortedSemesterScores.keySet());
            Map<String, Double> semesterChanges = new HashMap<>();
            
            for (int i = 1; i < semesters.size(); i++) {
                String currentSemester = semesters.get(i);
                String prevSemester = semesters.get(i - 1);
                double change = sortedSemesterScores.get(currentSemester) - 
                               sortedSemesterScores.get(prevSemester);
                semesterChanges.put(currentSemester, change);
            }
            
            result.put("semesterChanges", semesterChanges);
        }
        
        return result;
    }
    
    @Override
    public Map<String, Object> analyzeStudentPerformanceGap(String studentNumber) {
        Map<String, Object> result = new HashMap<>();
        
        // 获取学生课程记录
        List<CourseRecord> studentRecords = courseRecordService.getByStudentNumber(studentNumber);
        
        if (studentRecords.isEmpty()) {
            return result;
        }
        
        // 获取学生所在专业
        Student student = studentService.lambdaQuery()
                .eq(Student::getStudentNumber, studentNumber)
                .one();
        
        if (student == null) {
            return result;
        }
        
        String major = student.getMajor();
        
        // 计算学生平均分
        double studentAvgScore = studentRecords.stream()
                .mapToInt(CourseRecord::getScore)
                .average()
                .orElse(0.0);
        
        // 查询专业平均分
        String majorAvgSql = "SELECT AVG(c.score) FROM course_record c " +
                "JOIN student s ON c.student_number = s.student_number " +
                "WHERE s.major = ?";
        
        Double majorAvgScore = jdbcTemplate.queryForObject(
                majorAvgSql, Double.class, major);
        
        if (majorAvgScore == null) {
            majorAvgScore = 0.0;
        }
        
        // 查询全校平均分
        String schoolAvgSql = "SELECT AVG(score) FROM course_record";
        Double schoolAvgScore = jdbcTemplate.queryForObject(
                schoolAvgSql, Double.class);
        
        if (schoolAvgScore == null) {
            schoolAvgScore = 0.0;
        }
        
        // 计算差异
        double majorGap = studentAvgScore - majorAvgScore;
        double schoolGap = studentAvgScore - schoolAvgScore;
        
        // 添加结果
        result.put("studentAverage", studentAvgScore);
        result.put("majorAverage", majorAvgScore);
        result.put("schoolAverage", schoolAvgScore);
        result.put("majorGap", majorGap);
        result.put("schoolGap", schoolGap);
        
        // 计算学生在各科目上的差异
        Map<String, Double> courseGaps = new HashMap<>();
        
        for (CourseRecord record : studentRecords) {
            String courseName = record.getCourseName();
            int studentScore = record.getScore();
            
            // 查询该课程的平均分
            String courseAvgSql = "SELECT AVG(score) FROM course_record WHERE course_name = ?";
            Double courseAvg = jdbcTemplate.queryForObject(
                    courseAvgSql, Double.class, courseName);
            
            if (courseAvg != null) {
                courseGaps.put(courseName, studentScore - courseAvg);
            }
        }
        
        result.put("courseGaps", courseGaps);
        
        return result;
    }
    
    @Override
    public Map<String, Object> predictStudentScore(String studentNumber, String courseType) {
        Map<String, Object> result = new HashMap<>();
        
        // 获取学生课程记录
        List<CourseRecord> records = courseRecordService.getByStudentNumber(studentNumber);
        
        if (records.isEmpty()) {
            return result;
        }
        
        // 计算学生历史平均分
        double overallAvg = records.stream()
                .mapToInt(CourseRecord::getScore)
                .average()
                .orElse(0.0);
        
        // 计算学生在该类型课程的历史平均分
        double categoryAvg = records.stream()
                .filter(r -> courseType.equals(r.getCourseType()))
                .mapToInt(CourseRecord::getScore)
                .average()
                .orElse(overallAvg); // 如果没有该类型的历史记录，使用总体平均分
        
        // 查询该学生最近一个学期的平均分，用于判断学习趋势
        String latestSemester = records.stream()
                .map(CourseRecord::getSemester)
                .max(String::compareTo)
                .orElse("");
        
        double latestAvg = records.stream()
                .filter(r -> latestSemester.equals(r.getSemester()))
                .mapToInt(CourseRecord::getScore)
                .average()
                .orElse(overallAvg);
        
        // 根据学生最近表现和历史表现预测分数
        // 简单的预测模型：70%基于该类型历史成绩，30%基于最近学期表现
        double predictedScore = categoryAvg * 0.7 + latestAvg * 0.3;
        
        // 添加浮动范围（±5分）
        double lowerBound = Math.max(0, predictedScore - 5);
        double upperBound = Math.min(100, predictedScore + 5);
        
        result.put("predictedScore", predictedScore);
        result.put("predictionRange", Map.of("min", lowerBound, "max", upperBound));
        result.put("historyAverage", overallAvg);
        result.put("categoryAverage", categoryAvg);
        result.put("latestAverage", latestAvg);
        result.put("confidenceLevel", calculateConfidenceLevel(records.size()));
        
        return result;
    }
    
    /**
     * 根据历史数据量计算预测的置信度
     */
    private String calculateConfidenceLevel(int recordCount) {
        if (recordCount >= 10) {
            return "高";
        } else if (recordCount >= 5) {
            return "中";
        } else {
            return "低";
        }
    }
    
    @Override
    public Map<String, Object> generateStudentRadarChart(String studentNumber) {
        Map<String, Object> result = new HashMap<>();
        
        // 获取学生课程记录
        List<CourseRecord> records = courseRecordService.getByStudentNumber(studentNumber);
        
        if (records.isEmpty()) {
            return result;
        }
        
        // 定义能力维度
        List<String> dimensions = Arrays.asList(
                "数学能力", "计算机能力", "语言能力", "专业核心能力", "综合素质");
        
        // 计算每个维度的得分
        Map<String, Double> scores = new HashMap<>();
        
        // 数学能力 - 基于数学类课程
        double mathScore = calculateCategoryScore(records, 
                Arrays.asList("高等数学", "离散数学", "概率论", "线性代数"));
        scores.put("数学能力", mathScore);
        
        // 计算机能力 - 基于计算机类课程
        double computerScore = calculateCategoryScore(records, 
                Arrays.asList("Java程序设计", "数据结构", "操作系统", "数据库", "计算机网络"));
        scores.put("计算机能力", computerScore);
        
        // 语言能力 - 基于语言类课程
        double languageScore = calculateCategoryScore(records, 
                Arrays.asList("大学英语", "英语口语", "技术写作", "专业外语"));
        scores.put("语言能力", languageScore);
        
        // 专业核心能力 - 基于专业课程
        double coreProfessionalScore = records.stream()
                .filter(r -> "必修".equals(r.getCourseType()))
                .mapToInt(CourseRecord::getScore)
                .average()
                .orElse(0.0) / 100 * 100; // 归一化到0-100
        scores.put("专业核心能力", coreProfessionalScore);
        
        // 综合素质 - 所有课程的加权平均
        double overallScore = records.stream()
                .mapToDouble(r -> r.getScore() * r.getCredit())
                .sum() / records.stream()
                .mapToInt(CourseRecord::getCredit)
                .sum() / 100 * 100; // 归一化到0-100
        scores.put("综合素质", overallScore);
        
        // 构建雷达图数据
        List<Map<String, Object>> radarData = new ArrayList<>();
        for (String dimension : dimensions) {
            Map<String, Object> dimensionData = new HashMap<>();
            dimensionData.put("dimension", dimension);
            dimensionData.put("score", scores.get(dimension));
            radarData.add(dimensionData);
        }
        
        result.put("radarChartData", radarData);
        
        // 添加能力评估总结
        Map<String, Object> summary = new HashMap<>();
        summary.put("highestAbility", getMaxScoreDimension(scores));
        summary.put("lowestAbility", getMinScoreDimension(scores));
        summary.put("averageScore", scores.values().stream().mapToDouble(d -> d).average().orElse(0.0));
        
        result.put("abilitySummary", summary);
        
        return result;
    }
    
    /**
     * 计算指定类别课程的平均得分
     */
    private double calculateCategoryScore(List<CourseRecord> records, List<String> courseNames) {
        return records.stream()
                .filter(r -> courseNames.stream().anyMatch(name -> r.getCourseName().contains(name)))
                .mapToInt(CourseRecord::getScore)
                .average()
                .orElse(0.0) / 100 * 100; // 归一化到0-100
    }
    
    /**
     * 获取得分最高的维度
     */
    private String getMaxScoreDimension(Map<String, Double> scores) {
        return scores.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("");
    }
    
    /**
     * 获取得分最低的维度
     */
    private String getMinScoreDimension(Map<String, Double> scores) {
        return scores.entrySet().stream()
                .min(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("");
    }
}
