import React from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'

const Loading = ({ situation = 'ai', message, fullscreen = true }) => {
  const messages = {
    ai: 'AI가 프로필 정보를 바탕으로 최적 제휴 조건을 설계 중이에요. \n조금만 기다려주세요.',
    form: '제안서 양식을 가져오는 중이에요.',
  }

  const resolvedMessage = message || messages[situation] || ''

  const content = (
    <Overlay $fullscreen={fullscreen}>
      <SpinnerWrapper>
        <Spinner>
          <svg viewBox="0 0 50 50">
            <defs>
              <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#64a10f" />
                <stop offset="100%" stopColor="#a8d46b" />
              </linearGradient>
            </defs>
            <circle cx="25" cy="25" r="20" fill="none" stroke="url(#spinnerGradient)" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </Spinner>
      </SpinnerWrapper>
      <Content>
        <Title>로딩 중...</Title>
        <Message>{resolvedMessage}</Message>
      </Content>
    </Overlay>
  )

  if (fullscreen) {
    return ReactDOM.createPortal(content, document.body)
  }

  return content
}

export default Loading

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`

const Overlay = styled.div`
  position: ${({ $fullscreen }) => ($fullscreen ? 'fixed' : 'relative')};
  inset: ${({ $fullscreen }) => ($fullscreen ? '0' : 'auto')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 24px;
  background: ${({ $fullscreen }) => ($fullscreen ? 'rgba(255, 255, 255, 0.75)' : 'transparent')};
  backdrop-filter: ${({ $fullscreen }) => ($fullscreen ? 'blur(3px)' : 'none')};
  z-index: 9999;
  animation: ${fadeIn} 160ms ease-out;
  color: #1a2d06;
  font-family: Pretendard;
`

const SpinnerWrapper = styled.div`
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
`

const Spinner = styled.div`
  width: 72px;
  height: 72px;
  animation: ${rotate} 1.1s linear infinite;

  svg { width: 100%; height: 100%; }
  circle { stroke-dasharray: 110; stroke-dashoffset: 80; }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  max-width: 560px;
`

const Title = styled.div`
  font-size: 25px;
  font-weight: 700;
  color: #1a2d06;
`

const Message = styled.div`
  font-size: 20px;
  line-height: 1.5;
  color: #3a4b24;
  white-space: pre-line;
`