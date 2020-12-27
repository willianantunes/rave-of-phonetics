export function checkedRadioValue(radios) {
    return Array.from(radios).find(radio => radio.checked).value
}

export const $ = document.querySelector.bind(document)
export const $$ = document.querySelectorAll.bind(document)
