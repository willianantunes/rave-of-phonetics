import {TextConfiguration} from "../../../../../../rave_of_phonetics/apps/core/static/core/js/domain/TextConfiguration";

test('Should create text configuration domain', () => {
    const textConfiguration = new TextConfiguration(null, "Jafar", "en-us", 1, 1)

    expect(textConfiguration.createdAt).toBeDefined()
    expect(textConfiguration.rate).toBe(1)
    expect(textConfiguration.pitch).toBe(1)
    expect(textConfiguration.text).toBe("Jafar")
    expect(textConfiguration.language).toBe("en-us")
})
