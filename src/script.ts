import './performance'
import { debounce } from './debounce'
import { displayZoomImg } from './zoomImg'
import { MasonryLayout } from  './masonryLayout'

interface ImageData {
  titel: string
  width: number
  height: number
  src: string
  types: string[]
}

const masonry = document.querySelector('.masonry-layout') as HTMLElement

const template = document.createElement('template')

const masonryLayout = new MasonryLayout({
  masonryElement: masonry,
  columns: calculationColumns(),
  gap: 16
})

async function getImageData(): Promise<ImageData[]> {
  const response = await fetch('./data.json')
  if (response.ok) {
    return await response.json()
  } else {
    throw new Error(`code: ${response.status}, ${response.statusText}`)
  }
}

async function loadNewPicture(entries: IntersectionObserverEntry[]) {
  const entrie = entries[0]
  if (entrie.isIntersecting) {
    try {
      const data = await getImageData()
      // 移除觀察(只需要觀察最後一個元素)
      observer.unobserve(entrie.target)
      template.innerHTML = data.map(d => {
        const {titel, width, height, src, types} = d
        const last = types.length - 1
        return `
        <li class="item">
          <div class="content">
              <picture>
                ${
                  types.map((type, i) => {
                    return i === last ?
                    `<img loading="lazy" width="${width}" height="${height}" src="${src}.${type}" alt="${titel}"/>` :
                    `<source srcset="${src}.${type}" type="image/${type}">`
                  }).join('\n')
                }
              </picture>
              <p>${titel}</p>
          </div>
        </li>`
      }).join('')
      const fragment = template.content
      const li = fragment.querySelectorAll('li')
      
      masonry.appendChild(fragment)
      masonryLayout.render(window.scrollY, ...li)
      // 觀察最後一個元素
      observer.observe(li[li.length-1])
    } catch (error) {
      console.error(error)
    }
  }
}

const observer = new IntersectionObserver(loadNewPicture)

observer.observe(masonry)

function calculationColumns() {
  console.log(masonry.clientWidth)
  const width = [480, 800, 1024, 1200]
  const index = width.findIndex(w => window.innerWidth <= w)
  return index === -1 ? width.length + 1 : index + 1
}

function scroll() {
  masonryLayout.render(window.scrollY)
}


function resize() {
  window.removeEventListener('scroll', scroll)
  debounce(() => {
    observer.disconnect()
    masonryLayout.resize({
      columns: calculationColumns()
    })
    observer.observe(masonryLayout.elementList[masonryLayout.elementList.length-1])
    window.addEventListener('scroll', scroll)
  },200)
}

masonry.addEventListener('click', ev => {
  if (ev.target instanceof HTMLImageElement && masonryLayout.columns > 1) {
    displayZoomImg(ev.target.currentSrc)
  }
})


window.addEventListener('scroll', scroll)

window.addEventListener('resize', resize)

