// src/pages/portrait/components/TagsList.js
import React from 'react';
import { Tag, Card, Divider, Empty, Row, Col } from 'antd';

const TagsList = ({ academicTags, interestTags }) => {
  const hasAcademicTags = academicTags && academicTags.length > 0;
  const hasInterestTags = interestTags && interestTags.length > 0;
  
  if (!hasAcademicTags && !hasInterestTags) {
    return (
      <Card title="学生标签" className="detail-container">
        <Empty description="暂无标签数据" />
      </Card>
    );
  }
  
  // 根据标签值获取颜色
  const getTagColor = (tagType, value) => {
    if (tagType === '学习能力') {
      if (value >= 90) return 'green';
      if (value >= 80) return 'cyan';
      if (value >= 70) return 'blue';
      if (value >= 60) return 'orange';
      return 'red';
    } else {
      return 'purple';
    }
  };
  
  return (
    <Card title="学生标签" className="detail-container">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div className="tag-group">
            <h3>学习能力标签</h3>
            {hasAcademicTags ? (
              academicTags.map(tag => (
                <Tag 
                  key={tag.id} 
                  color={getTagColor('学习能力', tag.tagValue)}
                  style={{ margin: '0 8px 8px 0', fontSize: '14px', padding: '4px 8px' }}
                >
                  {tag.tagName} ({tag.tagValue?.toFixed(1)})
                </Tag>
              ))
            ) : (
              <Empty description="暂无学习能力标签" />
            )}
          </div>
        </Col>
        
        <Col span={12}>
          <div className="tag-group">
            <h3>兴趣偏好标签</h3>
            {hasInterestTags ? (
              interestTags.map(tag => (
                <Tag 
                  key={tag.id} 
                  color={getTagColor('兴趣偏好', tag.tagValue)}
                  style={{ margin: '0 8px 8px 0', fontSize: '14px', padding: '4px 8px' }}
                >
                  {tag.tagName} ({tag.tagValue?.toFixed(1)})
                </Tag>
              ))
            ) : (
              <Empty description="暂无兴趣偏好标签" />
            )}
          </div>
        </Col>
      </Row>
      
      <Divider />
      
      <div className="tag-descriptions">
        {hasAcademicTags && academicTags.map(tag => (
          <p key={tag.id}><strong>{tag.tagName}:</strong> {tag.tagDesc}</p>
        ))}
        {hasInterestTags && interestTags.map(tag => (
          <p key={tag.id}><strong>{tag.tagName}:</strong> {tag.tagDesc}</p>
        ))}
      </div>
    </Card>
  );
};

export default TagsList;