import React, { useEffect, useState } from 'react'
import InputBox from '../../components/common/inputs/InputBox'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components';
import axios from 'axios';
import useUserStore from '../../stores/userStore';
import useStudentStore from '../../stores/studentStore';
import Logo from '../../assets/images/Logo.png'
import useStudentOrgStore from '../../stores/studentOrgStore';

const Login = () => {
  const navigate = useNavigate();
  const [ username, onChangeUsername] = useState("");
  const [ password, onChangePassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const { setLoginStatus } = useUserStore(); 

  const navigateToHome= () => {
    navigate('/');
  }
  const onClick = async () => {
  try {
    const res = await setLoginStatus(username, password);
    console.log("로그인 성공:", res);
    setErrorMessage(""); // 성공 시 에러메세지 안 뜸 

    if(res.user_role === "OWNER") {
      navigate('/owner');
    } else if(res.user_role === "STUDENT") {
      await useStudentStore.getState().setProfileInfo(res.id);
      navigate('/student'); 
    }else if(res.user_role === "STUDENT_GROUP") {
      navigate('/student-group');  
    } else {
      navigateToHome(); 
    }
  } catch (error) {
    // 에러가 401일 때만 에러 메시지 표시
    if (error instanceof TypeError) {
      setErrorMessage("아이디 또는 비밀번호가 잘못되었습니다. 다시 확인해 주세요.");
    } else {
      setErrorMessage("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      console.error(error);
    }
  }
};

  return (
    <PageContainer>
      <LogoContainer>
        <img src={Logo} alt="로고" />
      </LogoContainer>
      <LoginContainer>
        <LoginSection>
          <InputContainer>
            <InputWrapper>
              <LoginInputBox
                defaultText="아이디"
                value={username}
                onChange={(e) => onChangeUsername(e.target.value)}
                width="446px"
                border = "1px solid #c4c4c4"                
                onEnter = {onClick}
              />
            </InputWrapper>
            <InputWrapper>
              <LoginInputBox
                defaultText="비밀번호"
                value={password}
                onChange={(e) => onChangePassword(e.target.value)}
                width="446px"
                type="password"
                border = "1px solid #c4c4c4"
                onEnter = {onClick}
              />
            </InputWrapper>
            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
          </InputContainer>
      </LoginSection>
      <LoginBtn onClick={onClick}>로그인</LoginBtn>
      </LoginContainer>
    </PageContainer>
  )
}

export default Login

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;                      // 뷰포트 전체 높이
  background: #FFF;
  display: flex;
  align-items: center;                 // 세로방향 중앙
  justify-content: center;             // 가로방향 중앙
  gap: 182px;
  overflow: hidden;
  text-align: left;
  font-size: 36px;
  color: #1A2D06;
  font-family: Pretendard;
`;

const LoginContainer = styled.div`
display: flex;
width: 100%;
max-width: 446px;
flex-direction: column;
align-items: flex-start;
gap: 36px;
font-size: 16px;
color: #c4c4c4;
`;

const LogoContainer = styled.div`
display: flex;
width: 100%;
max-width: 472px;
object-fit: cover;
aspect-ratio: 193/92;
`;

const LoginSection = styled.div`
align-self: stretch;
display: flex;
width: 100%;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 5px;
`;

const InputContainer = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 5px;
`;

const LoginInputBox = styled(InputBox)`
width: 100%;
position: relative;
border-radius: 5px;
border: 1px solid #c4c4c4;
box-sizing: border-box;
height: 60px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
padding: 10px;
text-align: left;
font-size: 16px;
color: #c4c4c4;
font-family: Pretendard;

`;

const InputWrapper = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 15px;
`;

const LoginBtn = styled.div`
width: 100%;
position: relative;
border-radius: 35px;
border: 3px solid #64a10f;
box-sizing: border-box;
height: 70px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
text-align: left;
font-size: 20px;
color: #64a10f;
font-family: Pretendard;

&:hover {
background-color: #e9f4d0;
}
&:active {
  background-color: #64a10f;
  color: #cef685;
  }
`;

const ErrorText = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: #F00;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
