import React, { useEffect, useState } from 'react'
import InputBox from '../../components/common/inputs/InputBox'
import { useNavigate } from 'react-router-dom'
import { login } from '../../apis/user';
import styled from 'styled-components';

const Login = () => {
  const navigate = useNavigate();
  const [ username, onChangeUsername] = useState();
  const [ password, onChangePassword] = useState();

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
    <InputBox>
    <input value={username} onChange={onChangeUsername} placeholder='아이디를 입력해주세요.'></input>
    </InputBox>
    <InputBox>비밀번호</InputBox>
    </LoginContainer>
    </PageContainer>
  )
}

export default Login

const PageContainer = styled.div`
width: 100%; 
`;

const LoginContainer = styled.div`
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

const LogoContainer = styled.div`
width: 563px;
position: relative;
background-color: #d9d9d9;
height: 420px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 118px 0px;
box-sizing: border-box;
text-align: left;
font-size: 36px;
color: #000;
font-family: Pretendard;
`;