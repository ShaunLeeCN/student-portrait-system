package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.entity.Student;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface StudentMapper extends BaseMapper<Student> {
    
    /**
     * 根据专业统计学生人数
     */
    @Select("SELECT COUNT(*) FROM student WHERE major = #{major}")
    int countByMajor(@Param("major") String major);
    
    /**
     * 根据年级统计学生人数
     */
    @Select("SELECT COUNT(*) FROM student WHERE grade = #{grade}")
    int countByGrade(@Param("grade") String grade);
    
    /**
     * 统计学院的学生分布情况
     */
    @Select("SELECT college, COUNT(*) as count FROM student GROUP BY college")
    List<Map<String, Object>> countGroupByCollege();
    
    /**
     * 统计各年级的学生分布情况
     */
    @Select("SELECT grade, COUNT(*) as count FROM student GROUP BY grade")
    List<Map<String, Object>> countGroupByGrade();
    
    /**
     * 根据条件查询学生信息
     */
    @Select("SELECT * FROM student WHERE college = #{college} AND major = #{major}")
    List<Student> findByCollegeAndMajor(@Param("college") String college, @Param("major") String major);
}
