import React from 'react'
import styled from 'styled-components'
import LoginBtn from '../../components/common/buttons/LoginBtn'

const LandingPage = () => {
  return (
  <PageContainer>
    <SectionContainer>
      <LandingIntro>
      <LogoContainer>
        로 고
      </LogoContainer>
      <CaptionContainer>
        휴니버스와 함께 대학과 상권이 연결된 캠퍼스를 만들어봐요!
      </CaptionContainer>
      </LandingIntro>
      <LoginSection>
        <LoginBtn text="사장님으로 시작하기" to="/login"></LoginBtn>
        <LoginBtn text="학생단체로 시작하기" to="/login"></LoginBtn>
        <LoginBtn text="학생으로 시작하기" to="/login"></LoginBtn>
       </LoginSection>
    </SectionContainer>
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
font-size: 36px;
color: #000;
font-family: Pretendard;
`;

const SectionContainer = styled.div`
position: absolute;
top: 76px;
left: 263px;
width: 914px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
gap: 80px;
`;

const LandingIntro = styled.div`
align-self: stretch;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
gap: 10px;
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
background-color: #d9d9d9;
height: 280px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
padding: 118px 293px;
box-sizing: border-box;
`;

const CaptionContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
font-size: 16px;
`;

