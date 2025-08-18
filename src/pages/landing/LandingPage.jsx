import React from 'react'
import styled from 'styled-components'
import LoginBtn from '../../components/common/buttons/LoginBtn'
import Logo from '../../assets/images/Logo.png'

const LandingPage = () => {
  return (
  <PageContainer>
    <LandingContainer>
      <LogoContainer>
        <ImageContainer src={Logo} alt="휴니버스 로고" />
      <CaptionContainer>
        휴니버스와 함께 대학과 상권이 연결된 캠퍼스를 만들어봐요!
      </CaptionContainer>
      </LogoContainer>
      <LoginSection>
        <LoginBtn text="사장님으로 시작하기" to="/login"></LoginBtn>
        <LoginBtn text="학생단체로 시작하기" to="/login"></LoginBtn>
        <LoginBtn text="학생으로 시작하기" to="/login"></LoginBtn>
       </LoginSection>
    </LandingContainer>
  </PageContainer>
  )
}

export default LandingPage

const PageContainer = styled.div`
width: 100%;
position: relative;
background-color: #fff;
height: 847px;
overflow: hidden;
text-align: left;
font-size: 16px;
color: #000;
font-family: Pretendard;
`;

const LandingContainer = styled.div`
position: absolute;
top: 58px;
left: 263px;
width: 914px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
gap: 80px;
`;

const LoginSection = styled.div`
width: 446px;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 10px;
font-size: 20px;
color: #64a10f;
`;

const LogoContainer = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
gap: 10px;
`;

const ImageContainer = styled.img`
width: 100%;
position: relative;
max-width: 100%;
overflow: hidden;
max-height: 100%;
object-fit: cover;
`;

const CaptionContainer = styled.div`
position: relative;
font-size: 16px;
font-family: Pretendard;
color: #000;
text-align: left;
`;

