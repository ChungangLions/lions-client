import React from 'react'
import styled from 'styled-components'

const LandingIntro = ({children}) => {
  return (
    <IntroContainer>
        **과 함께 대학과 상권이 연결된 캠퍼스를 만들어봐요!
        {children}
    </IntroContainer>
  )
}

export default LandingIntro

const IntroContainer = styled.div`

`;