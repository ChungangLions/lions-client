import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import OwnerHome from './pages/owner/OwnerHome';
import GroupHome from './pages/studentGroup/GroupHome';
import StudentHome from './pages/student/StudentHome';
import MainLayout from './layout/MainLayout';
import OwnerMyPage from './pages/owner/OwnerMyPage';
import OwnerReceiveSuggest from './pages/owner/OwnerReceiveSuggest';
import OwnerSendSuggest from './pages/owner/OwnerSendSuggest';
import OwnerSentProposalDetail from './pages/owner/OwnerSentProposalDetail';
import OwnerReceivedProposalDetail from './pages/owner/OwnerReceivedProposalDetail';
import OwnerEditMyPage from './pages/owner/OwnerEditMyPage';
import Login from './pages/landing/Login';
import OwnerWishlist from './pages/owner/OwnerWishlist';
import StudentMyPage from './pages/student/StudentMyPage';
import StudentGroupProfile from './pages/owner/StudentGroupProfile';
import StudentEditMyPage from './pages/student/StudentEditMyPage';
import ProposalDetail from './pages/suggest/ProposalDetail';
import AIProposalDetail from './pages/suggest/AIProposalDetail';
import GroupEditMyPage from './pages/studentGroup/GroupEditMyPage';
import GroupProposalDetail from './pages/suggest/GroupProposalDetail';
import AIGroupProposalDetail from './pages/suggest/AIGroupProposalDetail';
import GroupWishlist from './pages/studentGroup/GroupWishlist';
import GroupReceiveSuggest from './pages/studentGroup/GroupReceiveSuggest';
import GroupSendSuggest from './pages/studentGroup/GroupSendSuggest';
import GroupSendSuggestDetail from './pages/studentGroup/GroupSendSuggestDetail';
import GroupReceiveProposalDetail from './pages/studentGroup/GroupReceiveProposalDetail';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route path="/login" element={<Login />}/>

      <Route element={<MainLayout hasMenu={false}/>}>
        <Route path="/owner" element={<OwnerHome />} />
        <Route path="/owner/ai-proposal" element={<AIProposalDetail/>} />
        <Route path="/owner/proposal" element={<ProposalDetail/>} />
        <Route path="owner/student-group-profile/:id" element={<StudentGroupProfile/>} />
        {/* <Route path="owner/student-group-profile" element={<StudentGroupProfile/>} /> */}

        <Route path="/student-group" element={<GroupHome />}/>
        <Route path="/student-group/store-profile/:id" element={<OwnerMyPage />} />


        {/* <Route path="/student_group/mypage/edit" element={<GroupEditMyPage />} />
        <Route path="/student_group/mypage/wishlist" element={<GroupWishlist />} />
        <Route path="/student_group/mypage/received-suggest" element={<GroupReceiveSuggest />} />
        <Route path="/student_group/mypage/sent-suggest" element={<GroupSendSuggest />} /> */}

        <Route path="/student-group/proposal" element={<GroupProposalDetail/>} />
        <Route path="/student-group/ai-proposal" element={<AIGroupProposalDetail/>} />
        
        <Route path="/student" element={<StudentHome />}/>
        <Route path="/student/mypage" element={<StudentMyPage />} />
        <Route path="/student/mypage/edit" element={<StudentEditMyPage />} />
        <Route path="/student/store-profile/:id" element={<OwnerMyPage />} />

      </Route>
      <Route element={<MainLayout hasMenu={true}/>}>
        <Route path="/owner/mypage/edit" element={<OwnerEditMyPage />}/>
        <Route path="/owner/mypage/received-suggest" element={<OwnerReceiveSuggest />}/>
        <Route path="/owner/mypage/sent-suggest" element={<OwnerSendSuggest />}/>
        <Route path="/owner/mypage/sent-proposal/:id" element={<OwnerSentProposalDetail />}/>
        <Route path="/owner/mypage/received-proposal/:id" element={<OwnerReceivedProposalDetail />}/>
        <Route path="/owner/mypage" element={<OwnerMyPage />}/>
        <Route path="/owner/mypage/wishlist" element={<OwnerWishlist />}/>
        <Route path="/owner/mypage/wishlist/student-group-profile/:id" element={<StudentGroupProfile/>} />

        <Route path='/student-group/mypage' element={<StudentGroupProfile/>} />
        <Route path="/student-group/mypage/edit" element={<GroupEditMyPage />} />
        <Route path="/student-group/mypage/received-suggest" element={<GroupReceiveSuggest />} />
        <Route path="/student-group/mypage/sent-suggest" element={<GroupSendSuggest />} />
        <Route path="/student-group/mypage/received-proposal/:id" element={<GroupReceiveProposalDetail />} />
        <Route path="/student-group/mypage/sent-proposal/:id" element={<GroupSendSuggestDetail />} />
        <Route path="/student-group/mypage/wishlist" element={<GroupWishlist />} />
      </Route>
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
