;(function () {
  const paletteTypeLocalStorageKey = "rop-palette-type"
  const paletteTypeLight = "light"
  const paletteTypeDark = "dark"
  // Just a mock function. Actually it will be updated in useWindowsDarkModeStrategy.js
  window.__onThemeChange = function () {}

  // This will be called in your React code!
  window.__toggleTheme = function () {
    const currentTheme = window.__theme
    const newTheme = currentTheme ? (currentTheme === paletteTypeLight ? paletteTypeDark : paletteTypeLight) : paletteTypeLight
    setDesirablePaletteType(newTheme)
    try {
      localStorage.setItem(paletteTypeLocalStorageKey, newTheme)
    } catch (err) {}

    return newTheme
  }

  function setDesirablePaletteType(newPaletteType) {
    window.__theme = newPaletteType
    window.__onThemeChange(newPaletteType)
  }

  function configureCurrentPaletteType() {
    let usedPalleteType
    try {
      usedPalleteType = localStorage.getItem(paletteTypeLocalStorageKey)
    } catch (err) {}

    const userHasDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches

    if (userHasDarkMode) {
      setDesirablePaletteType(usedPalleteType || paletteTypeDark)
    } else {
      setDesirablePaletteType(usedPalleteType || paletteTypeLight)
    }
  }

  configureCurrentPaletteType()
})()
