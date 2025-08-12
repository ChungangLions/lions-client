import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import OwnerHome from './pages/owner/OwnerHome';
import GroupHome from './pages/studentGroup/GroupHome';
import StudentHome from './pages/student/StudentHome';
import ProposalDetail from './pages/owner/ProposalDetail';
import MainLayout from './components/common/layout/MainLayout';
import OwnerReceivedProposal from './pages/owner/OwnerReceivedProposal';
import StudentProfile from './pages/owner/StudentProfile';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route element={<MainLayout />}>
        <Route path="/owner" element={<OwnerHome />} />
        <Route path="/owner/proposal" element={<ProposalDetail/>} />
        <Route path="owner/mypage/received-suggest" element={<OwnerReceivedProposal/>} />
        <Route path="owner/student-profile" element={<StudentProfile/>} />

        <Route path="/group" element={<GroupHome />}/>
        <Route path="/student" element={<StudentHome />}/>
      </Route>
  
        
    
    </Routes>
    </BrowserRouter>
  );
}

export default App;
