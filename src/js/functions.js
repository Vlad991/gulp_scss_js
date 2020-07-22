const domLoaded = (callback) => {
    document.addEventListener('DOMContentLoaded', callback);
};

const el = (selector) => {
    let elObject = document.querySelector(selector);
    if (elObject) {
        elObject.on = function (event, func) {
            this.addEventListener(event, func);
        };
    } else {
        return null;
    }
    return elObject;
};

const elAll = (selector) => {
    let elObjectArray = document.querySelectorAll(selector);
    elObjectArray.on = function (event, func) {
        this.forEach(elObject => {
            elObject.addEventListener(event, func);
        });
    };
    return elObjectArray;
}

const tab = (linkSelector, linkActiveClass, itemSelector, itemActiveClass, event) => {
    elAll(linkSelector).on(event, function (e) {
        let attr = this.getAttribute('data-tab');
        elAll(linkSelector).forEach(link => link.classList.remove(linkActiveClass));
        elAll(itemSelector).forEach(item => item.classList.remove(itemActiveClass));
        el(linkSelector + "[data-tab='" + attr + "']").classList.add(linkActiveClass);
        el(itemSelector + "[data-tab='" + attr + "']").classList.add(itemActiveClass);
    });
};

const collapse = (collapseSelector, itemsSelector, itemsActiveClass, event) => {
    el(collapseSelector).on(event, function (e) {
        e.stopPropagation();
        el(itemsSelector).classList.toggle(itemsActiveClass);
    });
    elAll(itemsSelector).on(event, function (e) {
        e.stopPropagation();
    })
    document.addEventListener(event, function () {
        el(itemsSelector).classList.remove(itemsActiveClass);
    })
};

const collapseSelect = (collapseSelector, selectedSelector, itemsSelector, itemsActiveClass, event) => {
    el(collapseSelector).on(event, function (e) {
        e.stopPropagation();
        el(itemsSelector).classList.toggle(itemsActiveClass);
    });
    elAll(itemsSelector).on(event, function (e) {
        e.stopPropagation();
    });
    elAll(itemsSelector + ' > *').on(event, function (e) {
        e.stopPropagation();
        let value = this.getAttribute('data-value');
        el(selectedSelector).innerHTML = this.innerHTML;
        el(collapseSelector + ' input').setAttribute('value', value);
    });
    document.addEventListener(event, function () {
        el(itemsSelector).classList.remove(itemsActiveClass);
    });
};

export {domLoaded, el, elAll, tab, collapse, collapseSelect};