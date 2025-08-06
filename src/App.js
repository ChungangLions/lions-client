import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import OwnerHome from './pages/owner/OwnerHome';
import GroupHome from './pages/studentGroup/GroupHome';
import StudentHome from './pages/student/StudentHome';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route path="/owner" element={<OwnerHome />}/>
      <Route path="/group" element={<GroupHome />}/>
      <Route path="/student" element={<StudentHome />}/>
        
    
    </Routes>
    </BrowserRouter>
  );
}

export default App;
