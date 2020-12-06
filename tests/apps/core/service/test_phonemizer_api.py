from phonemizer import phonemize


def test_should_qwerty():
    text = "theoretically"
    greg = phonemize(text, language="en-us", backend="espeak", strip=False)

    assert greg is not None
