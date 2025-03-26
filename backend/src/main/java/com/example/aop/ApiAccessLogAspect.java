package com.example.aop;

import com.example.entity.ApiAccessLog;
import com.example.service.ApiAccessLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Aspect
@Component
public class ApiAccessLogAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(ApiAccessLogAspect.class);
    
    @Autowired
    private ApiAccessLogService apiAccessLogService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Pointcut("execution(* com.example.controller.*.*(..))")
    public void apiPointcut() {}
    
    @Around("apiPointcut()")
    public Object logApiAccess(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        // 获取请求信息
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return joinPoint.proceed();
        }
        
        HttpServletRequest request = attributes.getRequest();
        String method = request.getMethod();
        String path = request.getRequestURI();
        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        
        // 获取请求参数
        Map<String, String[]> parameterMap = request.getParameterMap();
        String requestParams = objectMapper.writeValueAsString(parameterMap);
        
        Object result = null;
        int statusCode = 200;
        
        try {
            // 执行实际方法
            result = joinPoint.proceed();
            return result;
        } catch (Exception e) {
            statusCode = 500;
            logger.error("API异常: " + path, e);
            throw e;
        } finally {
            try {
                long executionTime = System.currentTimeMillis() - startTime;
                
                // 记录访问日志
                ApiAccessLog accessLog = new ApiAccessLog();
                accessLog.setPath(path);
                accessLog.setMethod(method);
                accessLog.setIp(ip);
                accessLog.setExecutionTime(executionTime);
                accessLog.setStatusCode(statusCode);
                accessLog.setAccessTime(LocalDateTime.now());
                accessLog.setRequestParams(requestParams);
                accessLog.setUserAgent(userAgent);
                
                // 异步保存日志
                new Thread(() -> {
                    try {
                        apiAccessLogService.saveLog(accessLog);
                    } catch (Exception e) {
                        logger.error("保存访问日志失败", e);
                    }
                }).start();
                
                logger.info("API访问: {} {} - 执行时间: {}ms, 状态码: {}", method, path, executionTime, statusCode);
            } catch (Exception ex) {
                logger.error("记录访问日志失败", ex);
            }
        }
    }
}