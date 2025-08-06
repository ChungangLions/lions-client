import React from 'react'
import styled from 'styled-components'
import LoginBtn from '../../components/landing/LoginBtn'
import LandingIntro from '../../components/landing/LandingIntro'

const LandingPage = () => {
  return (
    <SectionContainer>
      <LandingIntro>
        <LoginBtn text="사장님으로 시작하기" to="/owner"></LoginBtn>
        <LoginBtn text="학생단체로 시작하기" to="/group"></LoginBtn>
        <LoginBtn text="학생으로 시작하기" to="/student"></LoginBtn>
      </LandingIntro>
    </SectionContainer>

  )
}

export default LandingPage

const SectionContainer = styled.div`
`;
