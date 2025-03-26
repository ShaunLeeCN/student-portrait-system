package com.example.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("api_access_log")
public class ApiAccessLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String path;
    private String method;
    private String ip;
    private Long executionTime;  // 执行时间，单位毫秒
    private Integer statusCode;
    private LocalDateTime accessTime;
    private String requestParams;  // 存储请求参数
    private String userAgent;
}