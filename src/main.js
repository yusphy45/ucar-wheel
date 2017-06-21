const canvasFixed = (canvas) => {
  const context = canvas.getContext('2d');
  const ratio = window.devicePixelRatio || 1; //得出像素比
  if (ratio !== 1) {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;
    // 扩大画布可填充像素值
    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';
    // 使用css压缩单位像素比
    context.scale(ratio, ratio);
    // 将画布缩放至原大小
    context.save()
  }
  return context;
}
const imgPreLoad = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
    resolve(img)
  }
  img.onerror = (e) => {
    reject(e)
  }
  img.src = src
})
}
const preLoad = (background, list) => {
  const preloadList = [background].concat(list.map(item => item.icon))
  return Promise.all(preloadList.map(item => {
      if (!item || /^(#|rgb)/.test(item)) return Promise.resolve('')
  return imgPreLoad(item)
}))
}
const initStage = function (background) {
  const { ctx, radius, x, y } = this
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.arc(0, 0, radius + 0.5, 0, Math.PI * 2)
  ctx.clip()
  ctx.closePath()
  if (background) {
    console.log(this.width, this.height)
    ctx.drawImage(background, -x, -y, this.width, this.height)
  } else {
    ctx.fill()
  }
}
const initCircle = function (imgList) {
  const { ctx, radius, list, text, size, textColor } = this
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.stroke()
  ctx.save()
  ctx.closePath()
  const n = list.length
  const itemDeg = Math.PI * 2 / n
  for (let i = 0; i < n; i++) {
    ctx.beginPath()
    const startX = -radius * Math.abs(Math.sin(itemDeg / 2))
    const startY = -radius * Math.abs(Math.cos(itemDeg / 2))
    ctx.moveTo(startX, startY)
    const targetX = radius * Math.abs(Math.sin(itemDeg / 2))
    const targetY = -radius * Math.abs(Math.cos(itemDeg / 2))
    ctx.moveTo(targetX, targetY)
    ctx.lineTo(0, 0)
    ctx.stroke()
    if (imgList[i]) ctx.drawImage(imgList[i], -32, -radius / 4 *3, 64, 64)
    ctx.save()
    ctx.font = `${size}px Microsoft YaHei`
    ctx.textAlign = 'center'
    ctx.fillStyle = textColor
    ctx.fillText(`${list[i][text]}`, 0, -radius / 5 * 4)
    ctx.restore()
    ctx.closePath()
    ctx.rotate(itemDeg)
  }
}
const initCentre = function () {
  const { ctx, radius } = this
  ctx.beginPath()
  ctx.arc(0, 0, radius / 3 + 1, 0, Math.PI * 2)
  ctx.stroke()
  ctx.closePath()
  ctx.beginPath()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.arc(0, 0, radius / 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.closePath()
  ctx.rotate(Math.PI / 3)
}
const defaultConf = {
  el: document.body,
  width: 600,
  height: 600,
  radius: 300,
  key: 'id',
  text: 'name',
  list: [],
  size: 40,
  background: '#fff',
  lineColor: '#000',
  textColor: '#000'
}
class UcarWheel {
  constructor(config) {
    const { el, width, height, radius, list, key, text, size, callback, background, lineColor, textColor } = Object.assign(defaultConf, config)
    if (!(el instanceof HTMLElement)) throw new Error('el not an element')
    if (!width || typeof width !== 'number') throw new Error('typeof width should equal number')
    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.width = width
    this.height = height ? height : width
    this.x = this.width / 2
    this.y = this.height / 2
    this.radius = radius
    this.list = list
    this.key = key
    this.text = text
    this.size = size
    this.background = background
    this.lineColor = lineColor
    this.textColor = textColor
    this.initDate = null
    this.currentDate = null
    this.rotating = 'ready'
    this.oldAngle = 0
    this.callback = callback
    el.appendChild(this.canvas)
    this.ctx = canvasFixed(this.canvas)
    this.drawCircle()
  }

  drawCircle(options) {
    Object.assign(this, options)
    if (this.background) this.ctx.fillStyle = this.background
    if (this.lineColor) this.ctx.strokeStyle = this.lineColor
    preLoad(this.background, this.list).then((imgList) => {
      initStage.bind(this)(imgList[0])
    initCircle.bind(this)(imgList.slice(1))
    initCentre.bind(this)()
  })
  }

  rotateStart() {
    if (this.rotating !== 'ready') return this
    this.rotating = 'start'
    const style = this.canvas.style
    this.oldAngle = parseInt(style.transform.replace(/rotate\((.+)turn\)/, '$1'))
    const c = this.oldAngle ? 100 + this.oldAngle : 100
    style.transform = 'rotate(' + c + 'turn)'
    style.transitionDuration = 100 + 's'
    style.transitionTimingFunction = 'linear'
    this.initDate = new Date()
    return this
  }

  rotateEnd(val) {
    if (this.rotating !== 'start') return Promise.reject()
    this.rotating = 'end'
    this.currentDate = new Date()
    const { initDate, currentDate } = this
    const style = this.canvas.style
    let distance = Math.floor((currentDate.getTime() - initDate.getTime()) / 1000)
    distance = this.oldAngle ? distance + this.oldAngle : distance
    let index = 0
    let targetItem = null
    this.list.some((el, i) => {
      if (val === el[this.key]) {
      index = i
      targetItem = el
      return true
    }
  })
    const result = distance + 3 - 1 / this.list.length * index
    style.transform = 'rotate(' + result + 'turn)'
    style.transitionDuration = '3s'
    style.transitionTimingFunction = 'ease-out'
    return new Promise(resolve => {
      setTimeout(() => {
      this.rotating = 'ready'
      resolve(targetItem)
    }, 3000)
  })
  }
}

export default UcarWheel