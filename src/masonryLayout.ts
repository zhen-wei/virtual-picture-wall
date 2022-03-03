
export interface MasonryLayoutOptions {
  masonryElement: HTMLElement;
  columns: number;
  gap: number;
}

export interface ResizeOptions {
  columns?: number;
  gap?: number;
}

export class MasonryLayout {
  masonryElement: HTMLElement
  columns: number
  gap: number
  elementList: HTMLElement[]
  elementListY: Float64Array
  itemsHeight: Float64Array
  constructor(options: MasonryLayoutOptions) {
    this.masonryElement = options.masonryElement
    this.columns = options.columns
    this.gap = options.gap
    this.elementList = []
    this.elementListY = new Float64Array(this.columns)
    this.itemsHeight = new Float64Array(this.columns)
  }
  render(scrollY: number, ...addElement: HTMLElement[]) {
    const { itemsHeight, masonryElement, elementList } = this
    if (addElement.length) {
      const { gap, columns } = this
      const offset = this.elementList.length - 1
      elementList.push(...addElement)
      if (this.elementList.length > this.elementListY.length) {
        const elementListY = new Float64Array(this.elementList.length)
        elementListY.set(this.elementListY)
        this.elementListY = elementListY
      }

      const width = (masonryElement.getBoundingClientRect().width - gap * (columns - 1)) / columns | 0
      addElement.forEach((item, i) => {
        let minIndex = itemsHeight.indexOf(Math.min(...itemsHeight))
        this.elementListY[offset + i] = itemsHeight[minIndex]
        item.style.width = `${width}px`
        item.style.left = `${(width + gap) * minIndex}px`
        item.style.top = `${itemsHeight[minIndex]}px`
        // item.style.transform = `translate(${(width + gap) * minIndex}px, ${itemsHeight[minIndex]}px)`
        const itemBounding = item.getBoundingClientRect()
        itemsHeight[minIndex] += itemBounding.height * width / itemBounding.width + gap
      })
      masonryElement.style.height = `${Math.max(...itemsHeight)}px`
    }

    const startIndex = this.elementListY.findIndex(v => v >= scrollY - window.innerHeight)
    const visualElement = elementList.slice(startIndex, startIndex + 25)
    for (let i = 0; i < visualElement.length; i++) {
      const item = masonryElement.children[i]
      const visualItem = visualElement[i]
      if (item) {
        if (item !== visualItem) {
          item.replaceWith(visualItem)
        } 
      } else {
        masonryElement.appendChild(visualElement[i])
      }
    }
  }
  resize(options: ResizeOptions = {}) {
    window.scrollTo(0,0)
    if (options.gap) {
      this.gap = options.gap
    }

    if (options.columns) {
      this.elementListY.fill(0)
      if (this.columns === options.columns) {
        this.itemsHeight.fill(0)
      } else {
        this.itemsHeight = new Float64Array(options.columns)
        this.columns = options.columns
      }
    }

    const { itemsHeight, masonryElement, columns, gap } = this

    this.elementList.length = 25
    masonryElement.replaceChildren(...this.elementList)
    const width = (masonryElement.getBoundingClientRect().width - gap * (columns - 1)) / columns | 0
    this.elementList.forEach((item, i) => {
      let minIndex = itemsHeight.indexOf(Math.min(...itemsHeight))
      this.elementListY[i] = itemsHeight[minIndex]
      item.style.width = `${width}px`
      item.style.left = `${(width + gap) * minIndex}px`
      item.style.top = `${itemsHeight[minIndex]}px`
      // item.style.transform = `translate(${(width + gap) * minIndex}px, ${itemsHeight[minIndex]}px)`
      const itemBounding = item.getBoundingClientRect()
      itemsHeight[minIndex] += itemBounding.height * width / itemBounding.width + gap
    })
    masonryElement.style.height = `${Math.max(...itemsHeight)}px`
  }
}

