import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import OwnerHome from './pages/owner/Owner/OwnerHome';
import GroupHome from './pages/studentGroup/GroupHome';
import StudentHome from './pages/student/StudentHome';
import ProposalDetail from './pages/owner/Owner/ProposalDetail';
import MainLayout from './components/common/layout/MainLayout';
import OwnerReceivedProposal from './pages/owner/Owner/OwnerReceivedProposal';
import OwnerMyPage from './pages/owner/OwnerMyPage';
import OwnerReceiveSuggest from './pages/owner/OwnerReceiveSuggest';
import OwnerSendSuggest from './pages/owner/OwnerSendSuggest';
import OwnerEditMyPage from './pages/owner/OwnerEditMyPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route element={<MainLayout />}>
        <Route path="/owner" element={<OwnerHome />} />
        <Route path="/owner/proposal" element={<ProposalDetail/>} />
        <Route path="owner/mypage/received-suggest" element={<OwnerReceivedProposal/>} />
      

        <Route path="/group" element={<GroupHome />}/>
        <Route path="/student" element={<StudentHome />}/>
      </Route>
  
      <Route path="/owner" element={<OwnerHome />}/>
      <Route path="/owner/mypage" element={<OwnerMyPage />}/>
      <Route path="/owner/mypage/edit" element={<OwnerEditMyPage />}/>
      {/* <Route path="/owner/mypage/suggest-form" element={<OwnerMyPage />}/> */}
      <Route path="/owner/mypage/received-suggest" element={<OwnerReceiveSuggest />}/>
      <Route path="/owner/mypage/sent-suggest" element={<OwnerSendSuggest />}/>
      {/* <Route path="/owner/mypage/wishlist" element={<OwnerMyPage />}/> */}
      <Route path="/group" element={<GroupHome />}/>
      <Route path="/student" element={<StudentHome />}/>
        
    
    </Routes>
    </BrowserRouter>
  );
}

export default App;
