class MessageView {
    constructor(selector) {
        this._element = $(selector)
    }

    _template(model) {
        return model.text ? `<p>${model.text}</p>` : ''
    }

    update(model) {
        this._element.innerHTML = this._template(model)
    }
}
