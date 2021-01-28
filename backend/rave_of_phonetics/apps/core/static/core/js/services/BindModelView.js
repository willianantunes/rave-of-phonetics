import {ProxyFactory} from "../utils/ProxyFactory";

export class BindModelView {
    constructor(model, view, ...props) {
        const proxy = ProxyFactory.create(model, props, model => {
            view.update(model)
        })

        view.update(model)

        return proxy
    }
}
