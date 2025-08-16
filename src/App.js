import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import OwnerHome from './pages/owner/OwnerHome';
import GroupHome from './pages/studentGroup/GroupHome';
import StudentHome from './pages/student/StudentHome';
import ProposalDetail from './pages/owner/ProposalDetail';
import MainLayout from './layout/MainLayout';
import OwnerMyPage from './pages/owner/OwnerMyPage';
import OwnerReceiveSuggest from './pages/owner/OwnerReceiveSuggest';
import OwnerSendSuggest from './pages/owner/OwnerSendSuggest';
import OwnerEditMyPage from './pages/owner/OwnerEditMyPage';
import StudentProfile from './pages/owner/StudentProfile';
import Login from './pages/landing/Login';
import OwnerWishlist from './pages/owner/OwnerWishlist';
import StudentMyPage from './pages/student/StudentMyPage';
import StudentEditMyPage from './pages/student/StudentEditMyPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route path="/login" element={<Login />}/>

      <Route element={<MainLayout hasMenu={false}/>}>
        <Route path="/owner" element={<OwnerHome />} />
        <Route path="/owner/proposal" element={<ProposalDetail/>} />
        <Route path="owner/student-profile" element={<StudentProfile/>} />
        <Route path="owner/mypage/wishlist" element={<OwnerWishlist />}/>
        <Route path="/group" element={<GroupHome />}/>
        <Route path="/student" element={<StudentHome />}/>
        <Route path="/student/mypage/:id" element={<StudentMyPage />} />
        <Route path="/student/mypage/:id/edit" element={<StudentEditMyPage />} />

      </Route>
      <Route element={<MainLayout hasMenu={true}/>}>
        <Route path="/owner/mypage/edit" element={<OwnerEditMyPage />}/>
        <Route path="/owner/mypage/received-suggest" element={<OwnerReceiveSuggest />}/>
        <Route path="/owner/mypage/sent-suggest" element={<OwnerSendSuggest />}/>
        <Route path="/owner/mypage" element={<OwnerMyPage />}/>
      </Route>
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
