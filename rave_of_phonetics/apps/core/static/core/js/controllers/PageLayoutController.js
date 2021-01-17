import {$$} from "../utils/dom";

export class PageLayoutController {
    constructor() {
        this._initAllEvents()
    }

    _initAllEvents() {
        this._applySideNavWhenMobileIsUsed();
    }

    _applySideNavWhenMobileIsUsed() {
        const elems = $$('.sidenav');
        M.Sidenav.init(elems);
    }
}
