package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.entity.CourseRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CourseRecordMapper extends BaseMapper<CourseRecord> {
    
    /**
     * 根据学号获取课程记录
     */
    @Select("SELECT * FROM course_record WHERE student_number = #{studentNumber}")
    List<CourseRecord> findByStudentNumber(@Param("studentNumber") String studentNumber);
    
    /**
     * 统计平均分
     */
    @Select("SELECT AVG(score) FROM course_record")
    Double calculateAverageScore();
    
    /**
     * 按课程类型统计平均分
     */
    @Select("SELECT course_type, AVG(score) as avgScore FROM course_record GROUP BY course_type")
    List<Map<String, Object>> calculateAverageScoreGroupByCourseType();
    
    /**
     * 按学期统计平均分
     */
    @Select("SELECT semester, AVG(score) as avgScore FROM course_record GROUP BY semester")
    List<Map<String, Object>> calculateAverageScoreGroupBySemester();
}
