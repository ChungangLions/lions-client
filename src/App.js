import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import OwnerHome from './pages/owner/OwnerHome';
import GroupHome from './pages/studentGroup/GroupHome';
import StudentHome from './pages/student/StudentHome';
import ProposalDetail from './pages/owner/ProposalDetail';
import MainLayout from './components/common/layout/MainLayout';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route element={<MainLayout />}>
        <Route path="/owner" element={<OwnerHome />} />
        <Route path="/owner/proposal" element={<ProposalDetail/>} />
      

        <Route path="/group" element={<GroupHome />}/>
        <Route path="/student" element={<StudentHome />}/>
      </Route>
  
        
    
    </Routes>
    </BrowserRouter>
  );
}

export default App;
