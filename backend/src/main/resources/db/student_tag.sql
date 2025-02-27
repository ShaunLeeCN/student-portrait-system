CREATE TABLE IF NOT EXISTS `student_tag` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `student_number` varchar(20) NOT NULL COMMENT '学号',
    `tag_type` varchar(50) NOT NULL COMMENT '标签类型',
    `tag_name` varchar(50) NOT NULL COMMENT '标签名称',
    `tag_value` double DEFAULT NULL COMMENT '标签值',
    `tag_desc` varchar(255) DEFAULT NULL COMMENT '标签描述',
    `created_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_student_number` (`student_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生标签表';