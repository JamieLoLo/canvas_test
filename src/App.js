import React, { useState, useRef, useEffect } from 'react'
import car1 from './abc.png'
import car2 from './a_4.png'
import car3 from './a_5.png'
import car4 from './a_6.png'
import { Canvas, Rect, Image } from '@bucky24/react-canvas'

function App() {
  const [selectedCar, setSelectedCar] = useState(null)
  const [drawnImages, setDrawnImages] = useState([])
  const [rotateDeg, setRotateDeg] = useState(0)
  const canvasRef = useRef(null)

  const handleImageClick = (car) => {
    setSelectedCar(car)
  }

  const handleCanvasClick = ({ x, y }) => {
    if (selectedCar) {
      const newImage = {
        car: selectedCar,
        x: x - 40,
        y: y - 25,
        width: 80,
        height: 50,
        rotate: rotateDeg,
      }
      setDrawnImages((prev) => [...prev, newImage])
    }
  }
  useEffect(() => {
    console.log(drawnImages)
  }, [drawnImages])

  const handleUndoClick = () => {
    setDrawnImages((prevImages) => {
      const updatedImages = [...prevImages]
      updatedImages.pop()
      return updatedImages
    })
  }

  const handleDownloadClick = () => {
    const canvasElement = canvasRef.current.canvas

    if (canvasElement) {
      const link = document.createElement('a')
      link.href = canvasElement.toDataURL('image/jpeg')
      link.download = 'canvas.jpg'

      // 手動觸發下載
      link.click()
    }
  }

  return (
    <div className='App'>
      <div className='flex flex-col items-center'>
        <div className='flex'>
          <img
            src={car1}
            alt=''
            className='w-[80px] mr-3 cursor-pointer'
            onClick={() => handleImageClick(car1)}
          />
          <img
            src={car2}
            alt=''
            className='w-[80px] mr-3 cursor-pointer'
            onClick={() => handleImageClick(car2)}
          />
          <img
            src={car3}
            alt=''
            className='w-[80px] mr-3 cursor-pointer'
            onClick={() => handleImageClick(car3)}
          />
          <img
            src={car4}
            alt=''
            className='w-[80px] cursor-pointer'
            onClick={() => handleImageClick(car4)}
          />
        </div>

        <div className='border border-black inline-block mt-4'>
          <Canvas
            ref={canvasRef}
            width={800}
            height={300}
            onMouseDown={handleCanvasClick}
            className='cursor-pointer'
          >
            <Rect x={0} y={0} x2={800} y2={300} color='#ffffff' fill={true} />
            {drawnImages.map((image, index) => {
              return (
                <Image
                  src={image.car}
                  x={image.x}
                  y={image.y}
                  width={image.width}
                  height={image.height}
                  key={index}
                  rot={image.rotate}
                />
              )
            })}
          </Canvas>
        </div>

        <button
          className='bg-red-300 py-4 px-8 rounded-md mt-4 mr-4'
          onClick={handleUndoClick}
        >
          返回上一步
        </button>

        <button
          className='bg-blue-300 py-4 px-8 rounded-md mt-4'
          onClick={handleDownloadClick}
        >
          下載畫布
        </button>

        <button
          className='bg-green-300 py-4 px-8 rounded-md mt-4'
          onClick={() => {
            if (rotateDeg === -360) {
              setRotateDeg(-45)
            } else {
              setRotateDeg((prev) => prev - 45)
            }
          }}
        >
          向左45度
        </button>
        <button
          className='bg-green-300 py-4 px-8 rounded-md mt-4 '
          onClick={() => {
            if (rotateDeg === 360) {
              setRotateDeg(45)
            } else {
              setRotateDeg((prev) => prev + 45)
            }
          }}
        >
          向右45度
        </button>
      </div>
    </div>
  )
}

export default App
