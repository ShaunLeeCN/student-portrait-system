package com.example.controller;

import com.example.service.DataAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
public class DataAnalysisController {

    @Autowired
    private DataAnalysisService dataAnalysisService;
    
    @GetMapping("/score-distribution")
    public Map<String, Object> getScoreDistribution() {
        return dataAnalysisService.analyzeScoreDistribution();
    }
    
    @GetMapping("/major-ranking")
    public List<Map<String, Object>> getMajorRanking() {
        return dataAnalysisService.analyzeMajorRanking();
    }
    
    @GetMapping("/score-trend/{studentNumber}")
    public Map<String, Object> getStudentScoreTrend(@PathVariable String studentNumber) {
        return dataAnalysisService.analyzeStudentScoreTrend(studentNumber);
    }
    
    @GetMapping("/performance-gap/{studentNumber}")
    public Map<String, Object> getStudentPerformanceGap(@PathVariable String studentNumber) {
        return dataAnalysisService.analyzeStudentPerformanceGap(studentNumber);
    }
    
    @GetMapping("/predict-score/{studentNumber}")
    public Map<String, Object> predictStudentScore(
            @PathVariable String studentNumber,
            @RequestParam(defaultValue = "必修") String courseType) {
        return dataAnalysisService.predictStudentScore(studentNumber, courseType);
    }
    
    @GetMapping("/radar-chart/{studentNumber}")
    public Map<String, Object> getStudentRadarChart(@PathVariable String studentNumber) {
        return dataAnalysisService.generateStudentRadarChart(studentNumber);
    }
}
