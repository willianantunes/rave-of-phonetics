class ProxyFactory {
    static create(object, validPropertiesNames, hookCallable) {
        return new Proxy(object, {
            get(target, prop, receiver) {
                if (ProxyFactory._isFunction(target[prop]) && validPropertiesNames.includes(prop)) {
                    return function () {
                        target[prop].apply(target, arguments)
                        hookCallable(target)
                    }
                } else {
                    return target[prop]
                }
            },
            set(target, prop, value, receiver) {
                const updated = Reflect.set(target, prop, value)
                if (validPropertiesNames.includes(prop)) hookCallable(target)
                return updated
            }
        })
    }

    static _isFunction(fn) {
        return typeof (fn) === typeof (Function)
    }
}
