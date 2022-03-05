import { mat4 } from 'gl-matrix'

const zoomImgBg = document.getElementById('zoomImgBg') as HTMLDivElement
const zoomImg = document.getElementById('zoomImg') as HTMLImageElement

const origin = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
])
const imgMatrix = new Float32Array(origin)

const zoomImgOptions = {
  grabbing: false,
  grab: {
    x: 0,
    y: 0
  },
  touchZoom: false,
  level: 1,
  MAX: 60,
  MIN: 1
}

zoomImgBg.addEventListener('click', () => {
  zoomImgBg.style.visibility = ''
  zoomImg.style.transform = ''
  document.body.style.overflowY = ''
  imgMatrix.set(origin)
  zoomImgOptions.level = 1
})

zoomImgBg.addEventListener('dragstart', ev => ev.preventDefault())

zoomImg.addEventListener('wheel', ev => {
  const isZoomIn = ev.deltaY < 0 || ev.deltaX > 0 ? true : false
  const {width, height} = zoomImg.getBoundingClientRect()
  const originX = width / 2
  const originY = height / 2

  const degree = 0.05
  const scale = isZoomIn ? 1 + degree : 1 - degree

  let [x, y] = [0, 0]

  if (isZoomIn) {
    if (zoomImgOptions.level <= zoomImgOptions.MAX) {
      x = (ev.offsetX - originX) * (1 - scale)
      y = (ev.offsetY - originY) * (1 - scale)
    }
    zoomImgOptions.level++
  } else {
    if (zoomImgOptions.level >= zoomImgOptions.MIN) {
      x = -(imgMatrix[12] / zoomImgOptions.level)
      y = -(imgMatrix[13] / zoomImgOptions.level)
    }
    zoomImgOptions.level--
  }
  if (zoomImgOptions.level <= zoomImgOptions.MAX && zoomImgOptions.level >= zoomImgOptions.MIN) {
    mat4.multiply(imgMatrix, imgMatrix, [
      scale, 0, 0, 0,
      0, scale, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
    mat4.multiply(imgMatrix, imgMatrix, [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, 0, 1
    ])
    zoomImg.style.transform = `matrix3d(${imgMatrix})`
  } else {
    if (zoomImgOptions.level > zoomImgOptions.MAX) {
      zoomImgOptions.level = zoomImgOptions.MAX
    } else {
      zoomImgOptions.level = zoomImgOptions.MIN
    }
  }
})

zoomImg.addEventListener('mousemove', ev => {
  if (zoomImgOptions.grabbing) {
    const x = (ev.x - zoomImgOptions.grab.x) / imgMatrix[0]
    const y = (ev.y - zoomImgOptions.grab.y) / imgMatrix[5]
    zoomImgOptions.grab.x = ev.x
    zoomImgOptions.grab.y = ev.y
    mat4.multiply(imgMatrix, imgMatrix, [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, 0, 1
    ])
    zoomImg.style.transform = `matrix3d(${imgMatrix})`
  }
})

// zoomImg.addEventListener('touchmove', ev => {
//   if (ev.targetTouches.length > 1) {
//     zoomImgOptions.grabbing = false
//     console.log(ev.targetTouches)
//   }
// })

zoomImg.addEventListener('mousedown', ev => {
  zoomImgOptions.grabbing = true
  zoomImgOptions.grab.x = ev.x
  zoomImgOptions.grab.y = ev.y
})

zoomImg.addEventListener('click', ev => {
  ev.stopPropagation()
})

zoomImgBg.addEventListener('mouseup', () => {
  zoomImgOptions.grabbing = false
  zoomImgOptions.touchZoom = false
})


export function displayZoomImg(imgSrc: string) {
  zoomImg.src = imgSrc
  zoomImgBg.style.visibility = 'visible'
  document.body.style.overflowY = 'hidden'
}