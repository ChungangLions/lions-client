import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import OwnerHome from './pages/owner/OwnerHome';
import GroupHome from './pages/studentGroup/GroupHome';
import StudentHome from './pages/student/StudentHome';
import OwnerMyPage from './pages/owner/OwnerMyPage';
import OwnerAcceptSuggest from './pages/owner/OwnerAcceptSuggest';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route path="/owner" element={<OwnerHome />}/>
      <Route path="/owner/mypage" element={<OwnerMyPage />}/>
      {/* <Route path="/owner/mypage/suggest-form" element={<OwnerMyPage />}/> */}
      <Route path="/owner/mypage/received-suggest" element={<OwnerAcceptSuggest />}/>
      {/* <Route path="/owner/mypage/sent-suggest" element={<OwnerMyPage />}/>
      <Route path="/owner/mypage/wishlist" element={<OwnerMyPage />}/> */}
      <Route path="/group" element={<GroupHome />}/>
      <Route path="/student" element={<StudentHome />}/>
        
    
    </Routes>
    </BrowserRouter>
  );
}

export default App;
