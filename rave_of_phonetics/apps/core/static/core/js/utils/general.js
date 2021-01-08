export function debounce(fn, milissegundos = 500) {

    let timer = 0;

    return (event) => {
        if(event) event.preventDefault();
        clearTimeout(timer);
        timer = setTimeout(() => fn(), milissegundos);
    }
}
