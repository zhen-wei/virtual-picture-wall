(
  function() {
    const entryTypes = [
      'paint',
      'largest-contentful-paint',
      'layout-shift',
      'first-input',
      'longtask'
    ]
    new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          switch(entry.entryType) {
            case 'paint':
              console.log('FP: 白屏時間')
              console.log('FP:', entry.startTime)
              break;
            case 'largest-contentful-paint':
              console.log('LCP: 顯示最大內容元素所需時間 – 載入速度 ( Good: ≤2500ms Poor: >4000ms )')
              console.log('LCP:', entry.startTime)
              break;
            case 'first-input':
              console.log('FID: 首次輸入 ( Good: ≤100ms Poor: >300ms )')
              console.log('FID:', entry.startTime)
              break
            case 'layout-shift':
              console.log('CLS: 配置轉移 - 頁面穩定性 ( Good: ≤0.1 Poor: >0.25 )')
              // @ts-ignore
              console.log('CLS:', entry.value)
              break;
            case 'longtask':
              console.log('長任務')
              console.log(entry)
            
          }
        }
    }).observe({entryTypes});
  }
)();