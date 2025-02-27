package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.entity.Student;
import com.example.mapper.StudentMapper;
import com.example.service.StudentService;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl extends ServiceImpl<StudentMapper, Student> implements StudentService {
    
    @Override
    public long countStudents() {
        return count();
    }
    
    @Override
    public long countStudentsByMajor(String major) {
        return lambdaQuery().eq(Student::getMajor, major).count();
    }
    
    @Override
    public long countStudentsByGrade(String grade) {
        return lambdaQuery().eq(Student::getGrade, grade).count();
    }
    
    @Override
    public long countStudentsByCollege(String college) {
        return lambdaQuery().eq(Student::getCollege, college).count();
    }
}
