import {$, $$} from "../utils/dom";

export class PageLayoutController {
    constructor() {
        this._divContainer = $('.page-header nav > div');
        this._divRow = $('.page-header nav > div > div');
        this._divCol = $('.page-header nav > div > div > div');
        this._evaluateScreen()
        this._initAllEvents()
    }

    _initAllEvents() {
        this._applySideNavWhenMobileIsUsed();
        window.addEventListener('resize', () => this._evaluateScreen());
    }

    _applySideNavWhenMobileIsUsed() {
        const elems = $$('.sidenav');
        M.Sidenav.init(elems);
    }

    _evaluateScreen() {
        if (window.innerWidth > 992) {
            this._divContainer.className = "container"
            this._divRow.className = "row"
            this._divCol.className = "col s12"
        } else {
            this._divContainer.className = null
            this._divRow.className = null
            this._divCol.className = null
        }
    }
}
