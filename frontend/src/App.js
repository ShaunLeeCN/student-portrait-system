import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// 导入页面组件（后续会创建）
import Dashboard from './pages/dashboard/Dashboard';
import StudentList from './pages/student/StudentList';
import StudentDetail from './pages/student/StudentDetail';
import PortraitSearch from './pages/portrait/PortraitSearch';
import PortraitDetail from './pages/portrait/PortraitDetail';
import DataAnalysis from './pages/analysis/DataAnalysis';
import SystemStatus from './pages/system/SystemStatus';

// 替换App.css为自定义样式
import './styles/App.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/portrait" element={<PortraitSearch />} />
          <Route path="/portrait/:studentNumber" element={<PortraitDetail />} />
          <Route path="/analysis" element={<DataAnalysis />} />
          <Route path="/system" element={<SystemStatus />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
