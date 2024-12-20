let updateButton = DOM.id("update-dom-button");
let updateValueDIV = DOM.id("update-dom-value");

const State = DOM.State({ value2 : "press button" });
State.value1 = "testing 1-2-3";
State.value1.bind(updateValueDIV, "content");
//updateValueDIV.bind({ content : State.value1 });

updateButton.on("click", () => { State.value1 = Math.random(); });
console.log(updateButton.parentNode);