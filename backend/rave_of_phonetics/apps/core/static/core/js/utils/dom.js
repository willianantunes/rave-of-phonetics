export function checkedRadioValue(radios) {
    return Array.from(radios).find(radio => radio.checked).value
}

export function checkRadioGivenCondition(radios, callable) {
    const someRadio = Array.from(radios).find(callable)
    if (someRadio) someRadio.checked = true
}

export const $ = document.querySelector.bind(document)
export const $$ = document.querySelectorAll.bind(document)
