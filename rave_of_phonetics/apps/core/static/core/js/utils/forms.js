export function checkedRadioValue(radios) {
    return Array.from(radios).find(radio => radio.checked).value
}
