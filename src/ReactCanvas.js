const canvasState = proxy({
  canDrag: false,
  selected: 'text',
  renderImgId: 'ahri',
  shouldRenderImg: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  shouldClear: false,
  text: {
    visible: true,
    type: 'text',
    data: {
      x: 250,
      y: 200,
      children: '',
      color: '#A5D8FF',
      font: '40px Times New Roman',
    },
  },
  ahri: {
    visible: false,
    type: 'img',
    data: {
      x: 0,
      y: 0,
      width: 254,
      height: 373,
      src: `${sourcePath}media/images/a_4.png`,
    },
  },
  cat: {
    visible: false,
    type: 'img',
    data: {
      x: 250,
      y: 0,
      width: 285,
      height: 345,
      src: `${sourcePath}media/images/a_5.png`,
    },
  },
  fox: {
    visible: false,
    type: 'img',
    data: {
      x: 500,
      y: 0,
      width: 242,
      height: 300,
      src: `${sourcePath}media/images/a_6.png`,
    },
  },
})
window.canvasState = canvasState

const ControlButton = ({ text, ...rest }) => {
  return (
    <div
      className='bg-rose-400 text-white p-2 rounded-xl cursor-pointer active:scale-90 transition-transform'
      {...rest}
    >
      {text}
    </div>
  )
}
const CheckPic = ({ title, itemTitle }) => {
  const { visible } = useSnapshot(canvasState[itemTitle])
  return (
    <div>
      <Input
        type='checkbox'
        value={visible}
        onChange={async (value) => {
          canvasState.shouldClear = true
          await delay(100)
          canvasState[itemTitle].visible = value
          canvasState.shouldRenderImg = true
        }}
      />
      {title}
    </div>
  )
}
const CanvasTextInput = ({ title, itemTitle }) => {
  const { children } = useSnapshot(canvasState[itemTitle].data)
  return (
    <div>
      {title}:
      <Input
        className='border-b-[1px]'
        type='text'
        value={children}
        onChange={async (value) => {
          canvasState.shouldClear = true
          await delay(100)
          canvasState[itemTitle].data.children = value
          canvasState.shouldRenderImg = true
        }}
      />
    </div>
  )
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log('文本已成功複製到剪貼簿')
      appendBubble('success', '文本已成功複製到剪貼簿。')
    })
    .catch((error) => {
      console.error('複製文本到剪貼簿時出錯:', error)
      appendBubble('error', '複製文本到剪貼簿時出錯:', error)
    })
}
const mobileShare = async (canvasRef) => {
  if (navigator.share) {
    try {
      canvasRef.current.canvas.toBlob(async (blob) => {
        const file = new File([blob], 'image.jpg', { type: blob.type })
        await navigator.share({
          title: '分享標題',
          text: '要分享的文本',
          url: getUrl(),
          files: [file],
        })
        console.log('分享成功')
        appendBubble('success', '分享成功')
      })
    } catch (error) {
      console.error('分享失敗:', error)
      appendBubble('error', `分享失敗:${error}`)
    }
  } else {
    console.log('該設備不支持分享功能')
    appendBubble('error', `該設備不支持分享功能`)
  }
}
const CanvasDiv = () => {
  const {
    canDrag,
    selected,
    shouldClear,
    renderImgId,
    shouldRenderImg,
    startX,
    startY,
    currentX,
    currentY,
    ahri,
    text,
    cat,
    fox,
  } = useSnapshot(canvasState)

  const canvasRef = useRef(null)
  useEffect(() => {
    if (canvasRef && canvasRef.current && canvasRef.current.canvas) {
      const clearCanvas = () => {
        requestAnimationFrame(() => {
          const ctx = canvasRef.current.canvas.getContext('2d')
          ctx.clearRect(
            0,
            0,
            canvasRef.current.canvas.width,
            canvasRef.current.canvas.height
          )
          canvasState.shouldClear = false
        })
      }

      const rerenderImg = () => {
        requestAnimationFrame(() => {
          const img = document.getElementById(renderImgId)
          img.src = canvasRef.current.canvas.toDataURL('image/jpeg')
          canvasState.shouldRenderImg = false
        })
      }

      if (shouldClear) {
        clearCanvas()
      }
      if (shouldRenderImg) {
        rerenderImg()
      }
    }
  }, [canvasRef, shouldClear, shouldRenderImg])

  // 捕獲網址列參數顯示對應內容
  useEffect(async () => {
    const params = new URLSearchParams(window.location.search)
    canvasState.text.data.children = params.get('t') || ''
    canvasState.ahri.visible = !!params.get('a')
    canvasState.cat.visible = !!params.get('c')
    canvasState.fox.visible = !!params.get('f')
    canvasState.shouldRenderImg = true
  }, [])

  const CanvasItem = ({ titleItem }) => {
    const { selected, currentX, currentY, startX, startY } =
      useSnapshot(canvasState)
    const { visible, data, type } = useSnapshot(canvasState[titleItem])
    if (visible) {
      if (type === 'text') {
        return (
          <Text
            {...data}
            x={selected === titleItem ? data.x + currentX - startX : data.x}
            y={selected === titleItem ? data.y + currentY - startY : data.y}
          />
        )
      } else if (type === 'img') {
        return (
          <Image
            {...data}
            x={selected === titleItem ? data.x + currentX - startX : data.x}
            y={selected === titleItem ? data.y + currentY - startY : data.y}
            rot={0}
          />
        )
      }
    }
    return <Rect />
  }

  const getUrl = () => {
    const url = window.location.href
    const hasQuestionMark = url.indexOf('?') !== -1

    const appendText = `t=${text.data.children}`
    const appendAhri = ahri.visible ? '&a=1' : ''
    const appendCat = cat.visible ? '&c=1' : ''
    const appendFox = fox.visible ? '&f=1' : ''

    if (hasQuestionMark) {
      finalUrl += `&${appendText}${appendAhri}${appendCat}${appendFox}`
    } else {
      finalUrl += `?${appendText}${appendAhri}${appendCat}${appendFox}`
    }

    return finalUrl
  }

  return (
    <div className='flex flex-col items-center gap-4 p-4 pointer-events-auto'>
      <div className='flex gap-4'>
        <ControlButton
          text='手機分享按鈕'
          onClick={() => mobileShare(canvasRef)}
        />
        <ControlButton
          text='電腦複製圖片'
          onClick={() => {
            canvasRef.current.canvas.toBlob((blob) => {
              const clipboardItem = new ClipboardItem({
                'text/plain': new Blob(['meow'], { type: 'text/plain' }),
                'image/png': blob,
              })

              navigator.clipboard
                .write([clipboardItem])
                .then(() => {
                  console.log('圖片已成功複製到剪貼簿。')
                  appendBubble('success', '圖片已成功複製到剪貼簿。')
                })
                .catch((error) => {
                  console.error('複製到剪貼簿時發生錯誤:', error)
                  appendBubble('error', `複製到剪貼簿時發生錯誤:${error}`)
                })
            }, 'image/png')
          }}
        />
        <ControlButton
          text='下載圖片'
          onClick={() => {
            const canvas = canvasRef.current.canvas
            if (canvas) {
              const link = document.createElement('a')
              link.href = canvas.toDataURL('image/jpeg')
              link.download = 'canvas_image.jpg'
              link.click()
            }
          }}
        />
        <ControlButton
          text='複製連結'
          onClick={() => {
            copyToClipboard(getUrl())
          }}
        />
      </div>

      <div>可 Drag 改變文字位置，並在下方渲染出新的 jpg</div>
      <CanvasTextInput title='Text' itemTitle='text' />
      <div className='flex gap-4'>
        <CheckPic title='Ahri' itemTitle='ahri' />
        <CheckPic title='Cat' itemTitle='cat' />
        <CheckPic title='Fox' itemTitle='fox' />
      </div>
      <div className='flex gap-4'>
        <div
          className='px-2 py-1 hover:bg-yellow-300 bg-yellow-400 cursor-pointer'
          onClick={() => (canvasState.selected = 'ahri')}
        >
          ahri
        </div>
        <div
          className='px-2 py-1 hover:bg-yellow-300 bg-yellow-400 cursor-pointer'
          onClick={() => (canvasState.selected = 'fox')}
        >
          fox
        </div>
        <div
          className='px-2 py-1 hover:bg-yellow-300 bg-yellow-400 cursor-pointer'
          onClick={() => (canvasState.selected = 'cat')}
        >
          cat
        </div>
        <div
          className='px-2 py-1 hover:bg-yellow-300 bg-yellow-400 cursor-pointer'
          onClick={() => (canvasState.selected = 'text')}
        >
          text
        </div>
      </div>

      <Canvas
        captureAllKeyEvents={false}
        ref={canvasRef}
        width={800}
        height={300}
        onMouseDown={({ x, y }) => {
          if (!canDrag) {
            canvasState.canDrag = true
            canvasState.startX = x
            canvasState.startY = y
            canvasState.currentX = x
            canvasState.currentY = y
          }
        }}
        onMouseMove={useCallback(
          ({ x, y }) => {
            if (canDrag) {
              canvasState.currentX = x
              canvasState.currentY = y
              canvasState.shouldClear = true
            }
          },
          [canDrag]
        )}
        onMouseUp={async () => {
          canvasState.canDrag = false
          canvasState[selected].data.x =
            canvasState[selected].data.x + currentX - startX
          canvasState[selected].data.y =
            canvasState[selected].data.y + currentY - startY
          canvasState.currentX = 0
          canvasState.currentY = 0
          canvasState.startX = 0
          canvasState.startY = 0

          canvasState.shouldRenderImg = true
        }}
      >
        <Rect x={0} y={0} x2={800} y2={300} color='#ffffff' fill={true} />
        <CanvasItem titleItem='ahri' />
        <CanvasItem titleItem='cat' />
        <CanvasItem titleItem='fox' />
        <CanvasItem titleItem='text' />
      </Canvas>
      <img id='ahri' src='' alt='' />
    </div>
  )
}
