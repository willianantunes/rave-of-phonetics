export class ToastView {
    _template(model) {
        return model.text ? M.toast({html: model.text}) : ''
    }

    update(model) {
        this._template(model)
    }
}
