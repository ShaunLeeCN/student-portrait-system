package com.example.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("course_record")
public class CourseRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String studentNumber;
    private String courseName;
    private String courseCode;
    private Integer score;
    private Integer credit;
    private String semester;
    private String courseType;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}