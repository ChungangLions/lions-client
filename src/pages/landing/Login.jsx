import React, { useEffect, useState } from 'react'
import InputBox from '../../components/common/inputs/InputBox'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components';
import axios from 'axios';
import useUserStore from '../../stores/userStore';
import useStudentStore from '../../stores/studentStore';

const Login = () => {
  const navigate = useNavigate();
  const [ username, onChangeUsername] = useState("");
  const [ password, onChangePassword] = useState("");

  const { setLoginStatus } = useUserStore(); 

  const navigateToHome= () => {
    navigate('/');
  }
  const onClick = async () => {
  try {
    const res = await setLoginStatus(username, password);
    console.log("로그인 성공:", res);
    if(res.user_role === "OWNER") {
      navigate('/owner');
    } else if(res.user_role === "STUDENT") {

      await useStudentStore.getState().setProfileInfo(res.id);

      navigate('/student'); 
    }else if(res.user_role === "STUDENTGROUP") {
      navigate('/group');  
    } else {
      navigateToHome(); 
    }
  } catch (error) {
  }
};

  return (
    <PageContainer>
      <LogoContainer>
        로고
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
              />
            </InputWrapper>
          </InputContainer>
      </LoginSection>
      <LoginBtn onClick={onclick}>로그인</LoginBtn>
      </LoginContainer>
    </PageContainer>
  )
}

export default Login

const PageContainer = styled.div`
width: 100%;
position: relative;
background-color: #fff;
height: 847px;
overflow: hidden;
text-align: left;
font-size: 36px;
color: #000;
font-family: Pretendard;
`;

const LoginContainer = styled.div`
position: absolute;
top: calc(50% - 132.5px);
left: 847px;
width: 446px;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 36px;
font-size: 16px;
color: #c4c4c4;
`;

const LogoContainer = styled.div`
position: absolute;
top: 213px;
left: 147px;
background-color: #d9d9d9;
width: 563px;
height: 420px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 118px 0px;
box-sizing: border-box;
`;

const LoginSection = styled.div`
align-self: stretch;
display: flex;
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
width: 446px;
border-radius: 35px;
background-color: #e7e7e7;
border: 3px solid #bcbcbc;
box-sizing: border-box;
height: 70px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 10px;
font-size: 20px;
color: #bcbcbc;
cursor: pointer;
`;
