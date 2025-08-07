import React, { useState } from 'react'

const FavoriteBtn = ({onClick}) => {
    const [isHeartActive, setIsHeartActive] = useState(false);

    const handleClick = () => {
        setIsHeartActive(!isHeartActive);
        if (onClick) {
            onClick(!isHeartActive);
        }
    }
  return (
    <button onClick={handleClick}>
        { isHeartActive ? '♥ 찜하기' : '♡ 찜하기'}
    </button>
  )
}

export default FavoriteBtn;