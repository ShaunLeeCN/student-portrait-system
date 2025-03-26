-- 创建数据库
CREATE DATABASE IF NOT EXISTS student_analytics;
USE student_analytics;

-- 创建参考表
DROP TABLE IF EXISTS ref_nationalities;
CREATE TABLE ref_nationalities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nationality_code VARCHAR(10) NOT NULL,
    nationality_name VARCHAR(50) NOT NULL,
    UNIQUE KEY (nationality_code)
);

DROP TABLE IF EXISTS ref_topics;
CREATE TABLE ref_topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic_code VARCHAR(20) NOT NULL,
    topic_name VARCHAR(50) NOT NULL,
    UNIQUE KEY (topic_code)
);

DROP TABLE IF EXISTS ref_stages;
CREATE TABLE ref_stages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stage_code VARCHAR(20) NOT NULL,
    stage_name VARCHAR(50) NOT NULL,
    UNIQUE KEY (stage_code)
);

DROP TABLE IF EXISTS ref_grades;
CREATE TABLE ref_grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grade_code VARCHAR(10) NOT NULL,
    grade_name VARCHAR(20) NOT NULL,
    stage_id INT,
    UNIQUE KEY (grade_code),
    FOREIGN KEY (stage_id) REFERENCES ref_stages(id)
);

DROP TABLE IF EXISTS ref_sections;
CREATE TABLE ref_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_code VARCHAR(10) NOT NULL,
    section_name VARCHAR(20) NOT NULL,
    UNIQUE KEY (section_code)
);

-- 创建学生基本信息表
DROP TABLE IF EXISTS students;
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    gender ENUM('M', 'F') NOT NULL,
    nationality_id INT,
    place_of_birth_id INT,
    relation ENUM('Father', 'Mum', 'Other') NOT NULL,
    parent_answering_survey ENUM('Yes', 'No') NOT NULL,
    parent_school_satisfaction ENUM('Good', 'Bad') NOT NULL,
    absence_days ENUM('Under-7', 'Above-7') NOT NULL,
    class_performance ENUM('H', 'M', 'L') NOT NULL,
    
    FOREIGN KEY (nationality_id) REFERENCES ref_nationalities(id),
    FOREIGN KEY (place_of_birth_id) REFERENCES ref_nationalities(id),
    
    INDEX idx_gender (gender),
    INDEX idx_class (class_performance),
    INDEX idx_absence (absence_days)
);

-- 创建学业表现记录表
DROP TABLE IF EXISTS academic_records;
CREATE TABLE academic_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    stage_id INT NOT NULL,
    grade_id INT NOT NULL,
    section_id INT NOT NULL,
    topic_id INT NOT NULL,
    semester ENUM('F', 'S') NOT NULL,
    
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (stage_id) REFERENCES ref_stages(id),
    FOREIGN KEY (grade_id) REFERENCES ref_grades(id),
    FOREIGN KEY (section_id) REFERENCES ref_sections(id),
    FOREIGN KEY (topic_id) REFERENCES ref_topics(id),
    
    INDEX idx_topic_stage (topic_id, stage_id),
    INDEX idx_grade_section (grade_id, section_id)
);

-- 创建学生参与度指标表
DROP TABLE IF EXISTS participation_metrics;
CREATE TABLE participation_metrics (
    metric_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    record_id INT NOT NULL,
    raised_hands INT NOT NULL,
    visited_resources INT NOT NULL,
    announcements_view INT NOT NULL,
    discussion INT NOT NULL,
    
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (record_id) REFERENCES academic_records(record_id),
    
    INDEX idx_student_record (student_id, record_id)
);

-- 创建导入日志表
DROP TABLE IF EXISTS import_logs;
CREATE TABLE import_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    import_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    records_imported INT NOT NULL,
    source_file VARCHAR(255) NOT NULL,
    status ENUM('Success', 'Failed', 'Partial') NOT NULL,
    error_message TEXT
);

-- 填充参考表数据

-- 国籍数据
INSERT INTO ref_nationalities (nationality_code, nationality_name) VALUES
('KW', 'Kuwait'),
('Jordan', 'Jordan'),
('Palestine', 'Palestine'),
('Iraq', 'Iraq'),
('Lebanon', 'Lebanon'),
('Egypt', 'Egypt'),
('SaudiArabia', 'Saudi Arabia'),
('USA', 'United States of America'),
('Iran', 'Iran'),
('Tunis', 'Tunisia'),
('Libya', 'Libya'),
('Morocco', 'Morocco'),
('Syria', 'Syria'),
('Venzuela', 'Venezuela');

-- 阶段数据
INSERT INTO ref_stages (stage_code, stage_name) VALUES
('lowerlevel', 'Lower Level'),
('MiddleSchool', 'Middle School'),
('HighSchool', 'High School');

-- 年级数据
INSERT INTO ref_grades (grade_code, grade_name, stage_id) VALUES
('G-02', 'Grade 2', 1),
('G-04', 'Grade 4', 1),
('G-05', 'Grade 5', 1),
('G-06', 'Grade 6', 2),
('G-07', 'Grade 7', 2),
('G-08', 'Grade 8', 2),
('G-09', 'Grade 9', 3),
('G-10', 'Grade 10', 3),
('G-11', 'Grade 11', 3),
('G-12', 'Grade 12', 3);

-- 班级数据
INSERT INTO ref_sections (section_code, section_name) VALUES
('A', 'Section A'),
('B', 'Section B'),
('C', 'Section C');

-- 学科数据
INSERT INTO ref_topics (topic_code, topic_name) VALUES
('IT', 'Information Technology'),
('Math', 'Mathematics'),
('English', 'English'),
('Arabic', 'Arabic'),
('Science', 'Science'),
('Biology', 'Biology'),
('Geology', 'Geology'),
('Chemistry', 'Chemistry'),
('Physics', 'Physics'),
('History', 'History'),
('Quran', 'Quran'),
('French', 'French'),
('Spanish', 'Spanish');

-- 创建视图，便于分析
CREATE OR REPLACE VIEW vw_student_complete_data AS
SELECT 
    s.student_id,
    s.gender,
    n1.nationality_name AS nationality,
    n2.nationality_name AS place_of_birth,
    st.stage_name AS stage,
    g.grade_name AS grade,
    sec.section_name AS section,
    t.topic_name AS subject,
    ar.semester,
    s.relation,
    pm.raised_hands,
    pm.visited_resources,
    pm.announcements_view,
    pm.discussion,
    s.parent_answering_survey,
    s.parent_school_satisfaction,
    s.absence_days,
    s.class_performance
FROM 
    students s
JOIN academic_records ar ON s.student_id = ar.student_id
JOIN participation_metrics pm ON ar.record_id = pm.record_id
JOIN ref_nationalities n1 ON s.nationality_id = n1.id
JOIN ref_nationalities n2 ON s.place_of_birth_id = n2.id
JOIN ref_stages st ON ar.stage_id = st.id
JOIN ref_grades g ON ar.grade_id = g.id
JOIN ref_sections sec ON ar.section_id = sec.id
JOIN ref_topics t ON ar.topic_id = t.id;

-- 创建存储过程，用于导入CSV数据
DELIMITER //

CREATE PROCEDURE ImportStudentData(IN filePath VARCHAR(255))
BEGIN
    DECLARE total_imported INT DEFAULT 0;
    DECLARE import_status VARCHAR(10) DEFAULT 'Success';
    DECLARE error_msg TEXT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
        error_msg = MESSAGE_TEXT;
        
        INSERT INTO import_logs (records_imported, source_file, status, error_message)
        VALUES (total_imported, filePath, 'Failed', error_msg);
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = error_msg;
    END;
    
    START TRANSACTION;
    
    -- 实际导入逻辑会在Java应用中实现
    -- 这里只预留存储过程接口
    
    SET total_imported = (SELECT COUNT(*) FROM students);
    
    INSERT INTO import_logs (records_imported, source_file, status, error_message)
    VALUES (total_imported, filePath, import_status, NULL);
    
    COMMIT;
END //

DELIMITER ;

-- 创建索引加速查询
CREATE INDEX idx_nationality_birth ON students(nationality_id, place_of_birth_id);
CREATE INDEX idx_participation_metrics ON participation_metrics(raised_hands, visited_resources);
CREATE INDEX idx_student_performance ON students(class_performance, absence_days);
CREATE INDEX idx_academic_topic_semester ON academic_records(topic_id, semester);