const COMPONENT_DIR = "./component";


const playerData = [
    {
        playerID : "player-1",
        inventory : ["sword", "mace", "spear"]
    },
    {
        playerID : "player-2",
        inventory : ["dagger", "longbow", "throwing stars"]
    }
]

if (! DOM.components) throw new DOMException("customElements not available on this browser", "componentsUnsupported");

const components = DOM.initComponents(COMPONENT_DIR, {

});
