// src/pages/portrait/components/RecommendationList.js
import React from 'react';
import { List, Tag, Empty, Divider } from 'antd';

const RecommendationList = ({ recommendations, courses }) => {
  const hasRecommendations = recommendations && recommendations.length > 0;
  const hasCourses = courses && courses.length > 0;
  
  if (!hasRecommendations && !hasCourses) {
    return <Empty description="暂无推荐信息" />;
  }
  
  return (
    <div>
      {hasCourses && (
        <>
          <h3>推荐课程</h3>
          <div style={{ marginBottom: 16 }}>
            {courses.map((course, index) => (
              <Tag 
                key={index} 
                color="blue"
                style={{ margin: '0 8px 8px 0', fontSize: '14px', padding: '4px 8px' }}
              >
                {course}
              </Tag>
            ))}
          </div>
          <Divider />
        </>
      )}
      
      {hasRecommendations && (
        <>
          <h3>学习建议</h3>
          <List
            itemLayout="horizontal"
            dataSource={recommendations}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Tag color="green">{index + 1}</Tag>}
                  description={item}
                />
              </List.Item>
            )}
          />
        </>
      )}
    </div>
  );
};

export default RecommendationList;