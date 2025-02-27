package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.entity.StudentTag;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface StudentTagMapper extends BaseMapper<StudentTag> {
    
    /**
     * 根据学号查询学生标签
     */
    @Select("SELECT * FROM student_tag WHERE student_number = #{studentNumber}")
    List<StudentTag> findByStudentNumber(@Param("studentNumber") String studentNumber);
    
    /**
     * 根据学号和标签类型查询学生标签
     */
    @Select("SELECT * FROM student_tag WHERE student_number = #{studentNumber} AND tag_type = #{tagType}")
    List<StudentTag> findByStudentNumberAndTagType(@Param("studentNumber") String studentNumber, @Param("tagType") String tagType);
    
    /**
     * 根据标签类型统计标签数量
     */
    @Select("SELECT COUNT(*) FROM student_tag WHERE tag_type = #{tagType}")
    Integer countByTagType(@Param("tagType") String tagType);
}
