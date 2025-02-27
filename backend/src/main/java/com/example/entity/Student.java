package com.example.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("student")
public class Student {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String studentNumber;
    private String name;
    private Integer age;
    private String gender;
    private String major;
    private String grade;
    private String college;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}
