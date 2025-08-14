import React, { useEffect, useState } from 'react'
import InputBox from '../../components/common/inputs/InputBox'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/apis/user';
import styled from 'styled-components';

const Login = () => {
  const navigate = useNavigate();
  const [ username, onChangeUsername] = useState();
  const [ password, onChangePassword] = useState();

  const navigateToHome= () => {
    navigate('/');
  }

  const onClick = async () => {
    try {
      const result = await login(username, password);
      localStorage.setItem("access_token", result.token.access_token);
      localStorage.setItem("refresh_token", result.token.refresh_token);
    } catch(error) {
      alert("잘못된 아이디 또는 비밀번호입니다. 다시 확인해주세요")
      navigate("/login");
    }
  }

  useEffect(()=> {
    const token = localStorage.getItem('token.access_token');
    if(token){
      navigate('/');
    }else{
      navigate('/login');}
  },[navigate])

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
              />
            </InputWrapper>
            <InputWrapper>
              <LoginInputBox
                defaultText="비밀번호"
                value={password}
                onChange={(e) => onChangePassword(e.target.value)}
                width="446px"
                type="password"
              />
            </InputWrapper>
          </InputContainer>
      </LoginSection>
      <LoginBtn onClick={onClick}>로그인</LoginBtn>
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
`;
