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
        휴ː니버스와 함께 대학과 상권이 연결된 캠퍼스를 만들어봐요!
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
overflow: hidden;
text-align: left;
font-size: 20px;
color: #64a10f;
font-family: Pretendard;
box-sizing: border-box;
height: 100vh;
display: flex;
justify-content: center;
`;

const LandingContainer = styled.div`
width: 100%
max-width: 914px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
gap: 80px;
padding: 58px 263px 172px 263px;
// padding-top: 58px;
// padding-bottom: 105px;
margin: 0 auto;
align-items: center;
`;

const LoginSection = styled.div`
width: 100%;
max-width: 446px;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 10px;
align-items: center;
`;

const LogoContainer = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
gap: 29px;
`;

const ImageContainer = styled.img`
width: 100%;
max-width: 556px;
aspect-ratio: 278/133;
position: relative;
max-height: 100%;
height: auto;
object-fit: cover;
`;

const CaptionContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
font-weight: 600;
`;

