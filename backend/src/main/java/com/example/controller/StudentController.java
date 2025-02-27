package com.example.controller;

import com.example.entity.Student;
import com.example.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;
    
    // 获取所有学生
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.list();
    }
    // 获取学生总数
    @GetMapping("/count")
    public Long countStudents() {
        return studentService.count();
    }
    // 根据ID获取学生
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentService.getById(id);
    }
    
    @GetMapping("/number/{studentNumber}")
    public Student getStudentByNumber(@PathVariable String studentNumber) {
        return studentService.lambdaQuery()
                .eq(Student::getStudentNumber, studentNumber)
                .one();
    }
    // 添加学生
    @PostMapping
    public boolean addStudent(@RequestBody Student student) {
        return studentService.save(student);
    }
    // 更新学生
    @PutMapping("/{id}")
    public boolean updateStudent(@PathVariable Long id, @RequestBody Student student) {
        student.setId(id);
        return studentService.updateById(student);
    }
    // 删除学生
    @DeleteMapping("/{id}")
    public boolean deleteStudent(@PathVariable Long id) {
        return studentService.removeById(id);
    }
    
    // @GetMapping("/count")
    // public long countStudents() {
    //     return studentService.countStudents();
    // }
    
    // @GetMapping("/count/major")
    // public long countStudentsByMajor(@RequestParam String major) {
    //     return studentService.countStudentsByMajor(major);
    // }
    
    // @GetMapping("/count/grade")
    // public long countStudentsByGrade(@RequestParam String grade) {
    //     return studentService.countStudentsByGrade(grade);
    // }
    
    // @GetMapping("/count/college")
    // public long countStudentsByCollege(@RequestParam String college) {
    //     return studentService.countStudentsByCollege(college);
    // }
}