// 页面载入
var storedSetting = JSON.parse(localStorage.getItem('setting'))
  ? JSON.parse(localStorage.getItem('setting'))
  : 'null'

setTimeout(() => {
  document.getElementsByClassName('setting')[0].style.opacity = 0
}, 3000)

// 数据初始化
const setting = {
  volume: storedSetting.volume ? storedSetting.volume : 0.2,
  speed: storedSetting.speed ? storedSetting.speed : 60000,
  mask: storedSetting.mask ? storedSetting.mask : 0,
  blur: storedSetting.blur ? storedSetting.blur : 0,
  index: storedSetting.index ? storedSetting.index : 0,
}
localStorage.setItem(
  'setting',
  JSON.stringify(setting) ? JSON.stringify(setting) : 'null'
)
const handler = {
  set(target, key, value) {
    target[key] = value
    if (key == 'volume') {
      document.getElementById('audio').volume = value
      document.getElementsByClassName('audioText')[0].innerHTML = setting.volume
    } else if (key == 'speed') {
      document.getElementsByClassName('speedText')[0].innerHTML =
        setting.speed / 1000 + '秒'
      // 停止计时器
      clearInterval(inter)
      fadeInOut()
    } else if (key == 'mask') {
      boxStyle.style.backgroundColor = `rgba(0, 0, 0, .${value})`
      document.getElementsByClassName('maskText')[0].innerHTML = setting.mask
    } else if (key == 'blur') {
      boxStyle.style.backdropFilter = `blur(${value}px)`
      document.getElementsByClassName('blurText')[0].innerHTML = setting.blur
    }

    localStorage.setItem('setting', JSON.stringify(target))
  },
}
const proxyObj = new Proxy(setting, handler)

// <!-- 音乐控制js -->
var arr_music = [
  './assets/file/1.mp3',
  './assets/file/2.flac',
  './assets/file/3.mp3',
]
var arr_music_title = [
  '梶浦由記 - Never leave you alone',
  '梶浦由記 - take your hands',
  '梶浦由記 - Decretum',
]
var j = 0
var audio = document.getElementById('audio')
var p = document.getElementById('title_p')
audio.addEventListener('ended', function () {
  if (audio.ended) {
    if (j == arr_music.length - 1) {
      j = 0
    } else {
      j += 1
    }
    document.getElementById('audio').src = arr_music[j]
    p.innerHTML = arr_music_title[j]
    document.getElementById('audio').play()
  }
})

// <!-- 时间获取js -->
function CurentTime() {
  window.setTimeout('CurentTime()', 1000)
  var now = new Date()
  var year = now.getFullYear() //年
  var month = now.getMonth() + 1 //月
  var day = now.getDate() //日
  var hh = now.getHours() //时
  var mm = now.getMinutes() //分
  var ss = now.getSeconds() //秒
  var clock = year + '-'
  if (month < 10) clock += '0'
  clock += month + '-'
  if (day < 10) clock += '0'
  clock += day + ' '

  var times = ''
  if (hh < 10) times += '0'
  times += hh + ':'
  if (mm < 10) times += '0'
  times += mm + ':'
  if (ss < 10) times += '0'
  times += ss

  time.innerHTML = times
  time_day.innerHTML = clock
}
CurentTime()

// <!-- 图片元素创建 -->
var arr_pic = [
  './assets/images/background-1.jpg',
  './assets/images/background-2.jpg',
  './assets/images/background-3.jpg',
  './assets/images/background-4.jpg',
  './assets/images/background-5.jpg',
  './assets/images/background-6.png',
  './assets/images/background-7.jpeg',
]
const list = document.querySelector('.box')
arr_pic.map((res) => {
  const img = document.createElement('img')
  img.setAttribute('class', 'pic')

  img.setAttribute('src', res)
  list.appendChild(img)
})

// <!-- 图片切换控制 -->
var inter
function fadeInOut() {
  clearInterval(inter)

  var times = setting.speed

  const container = document.querySelector('.fade-container')
  const images = container.querySelectorAll('img')
  const len = images.length
  let index = proxyObj.index

  images[index].style.opacity = 1

  inter = setInterval(() => {
    index = (index + 1) % len // 循环计数
    proxyObj.index = index

    // 淡出当前图片
    images[index === 0 ? len - 1 : index - 1].style.opacity = 0

    // 淡入下一张图片
    images[index].style.opacity = 1
  }, times)
}

// 全局背景遮罩元素获取
let boxStyle = document.querySelector('.mask')

//页面初始化
document.getElementsByClassName('audioText')[0].innerHTML = setting.volume
document.getElementsByClassName('speedText')[0].innerHTML =
  setting.speed / 1000 + '秒'
document.getElementsByClassName('maskText')[0].innerHTML = setting.mask
document.getElementsByClassName('blurText')[0].innerHTML = setting.blur

document.getElementById('audio').volume = setting.volume
boxStyle.style.backgroundColor = `rgba(0, 0, 0, .${setting.mask})`
boxStyle.style.backdropFilter = `blur(${setting.blur}px)`
fadeInOut()

const volumeNode = document.querySelector('.volumeChange')
volumeNode.value = proxyObj.volume * 100
volumeNode.addEventListener('input', () => {
  proxyObj.volume = volumeNode.value / 100
})

const speedNode = document.querySelector('.speedChange')
speedNode.value = proxyObj.speed / 1000
speedNode.addEventListener('change', () => {
  proxyObj.speed = speedNode.value * 1000
})

const maskNode = document.querySelector('.maskChange')
maskNode.value = proxyObj.mask * 10
maskNode.addEventListener('input', () => {
  proxyObj.mask = parseInt(maskNode.value / 10)
})

const blurChange = document.querySelector('.blurChange')
blurChange.value = proxyObj.blur * 10
blurChange.addEventListener('input', () => {
  proxyObj.blur = parseInt(blurChange.value / 10)
})

const stopSwiper = document.getElementById('stopSwiper')
const startSwiper = document.getElementById('startSwiper')

stopSwiper.addEventListener('click', () => {
  clearInterval(inter)
  stopSwiper.style.display = 'none'
  startSwiper.style.display = 'block'
})

startSwiper.addEventListener('click', () => {
  fadeInOut()
  stopSwiper.style.display = 'block'
  startSwiper.style.display = 'none'
})
