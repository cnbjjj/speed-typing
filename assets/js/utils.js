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
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function log(...args) {
    console.log(...args);
}
export {query, event, cssVar, shuffle, log};