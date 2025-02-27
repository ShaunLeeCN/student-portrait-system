package com.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.entity.Student;

public interface StudentService extends IService<Student> {
    long countStudents();
    long countStudentsByMajor(String major);
    long countStudentsByGrade(String grade);
    long countStudentsByCollege(String college);
}
