package com.example.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("student_tag")
public class StudentTag {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String studentNumber;
    private String tagType;    // 标签类型：学习能力、兴趣偏好、学习风格等
    private String tagName;    // 标签名称：高绩点、数学偏好、自律性强等
    private Double tagValue;   // 标签值：用于表示标签的强度或程度
    private String tagDesc;    // 标签描述：对标签的补充说明
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}
