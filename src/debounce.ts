export const debounce = (
    function() {
        let timer = 0
        return function(callback: Function, delay: number) {
            clearTimeout(timer)
            timer = setTimeout(callback, delay)
        }
    }
)()