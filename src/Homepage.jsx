import React from 'react'
import { proxyState } from './App'
import { useSnapshot } from 'valtio'
const Homepage = () => {
  const { visible } = useSnapshot(proxyState.homepage)
  return (
    <div>
      {visible && (
        <>
          <button
            className='bg-red-300 py-4 px-8 rounded-md mt-4 mr-4'
            onClick={() => {
              proxyState.seal.visible = true
              proxyState.homepage.visible = false
            }}
          >
            印章模式
          </button>
          <button
            className='bg-red-300 py-4 px-8 rounded-md mt-4 mr-4'
            onClick={() => {
              proxyState.draw.visible = true
              proxyState.homepage.visible = false
            }}
          >
            畫畫模式
          </button>
        </>
      )}
    </div>
  )
}

export default Homepage
