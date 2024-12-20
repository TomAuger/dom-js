DOM.id("append-p")
    .on("click", () => {
        DOM.el("main").append(DOM.new("p", {
            class : "random-text", content : generateRandomString()
        }));
    });

DOM.id("append-div")
    .on("click", () => {
        let label = DOM.new("label", { content : generateRandomString()} );
        let input = DOM.new("input", { type : "text", placeholder : "type something"} )
            .on("input", (evt) => {
                let checkbox = evt.target.parentNode.nextSibling;
                if (evt.target.value) {
                    checkbox.classList.add("active");
                } else {
                    checkbox.classList.remove("active");
                }
            });
        label.append(input);

        let checkmark = DOM.new("span", { class : "emoji", content : "✅️" });

        let div = DOM.new("div", { class : "input-div" } )
            .append(label, checkmark);

        DOM.el("main").append(div);
    });



function generateRandomString(){
    const alphabet = Array.from("abcdefghijklmnopqrstuvwxyz");
    let string = "";
    let words = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < words; ++i){
        let len = 3 + Math.floor(Math.random() * 10);
        let word = "";
        if (string) string += " ";
        for (let j = 0; j < len; ++j){
            let letter = alphabet[Math.floor(Math.random() * alphabet.length)];
            if (! string && ! word) letter = letter.toUpperCase();
            word += letter;
        }
        string += word;
    }
    return string;
}