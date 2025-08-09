import React from 'react'
import { useNavigate } from 'react-router-dom'

const SuggestDealBtn = ({ onClick }) => {
  const navigate = useNavigate();

  const goToSuggestPage = () => {
    navigate('/suggest')
  }

  return (
    <button onClick={goToSuggestPage}>
      제휴 제안하기
    </button>
  )
}

export default SuggestDealBtn