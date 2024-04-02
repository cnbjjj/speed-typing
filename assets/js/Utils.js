function query(selector, all = false, parent = document) {
    if (all)
        return parent.querySelectorAll(selector);
    return parent.querySelector(selector);
}
function event(on, event, call) {
    on.addEventListener(event, call);
    return on;
}
function cssVar(property, value) {
    document.documentElement.style.setProperty(property, value);
}
export {query, event, cssVar};