# dom-js
Ultra-lightweight library that streamlines HTML DOM and SVG element creation, with a few additional, oft-recreated utility methods thrown in for good measure. Minified under 2Kb.

## DOM methods
All methods are static methods against the `DOM` object in the global namespace.

### DOM.el()
Create a new DOM (HTML) element, passing any number of additional attributes to be applied to the element.

```
 @param  {String} [type="div"] HTML tag name
 @param  {Object} [opts={}]    Attribute name-value pairs
 @return {[type]}              DOM element
 ```

#### Examples:
``` JavaScript
DOM.el();
// <div></div>

DOM.el("ul", { class : "events" });
// <ul class="events"></ul>

DOM.el("img", {
  width : 100,
  height : 100,
  src : "assets/logo.png",
  onload : reveal
});
// <img width="100" height="100" src="assets/logo.png" onload="function reveal(event){}">
```

### Dom.apply()
Applies attributes to the DOM element using Element.setAttribute()

```
@param  {HTMLElement} el
@param  {Object} [atts={}]  Name-value attribute pairs applied using el.setAttribute()
@return {HTMLElement}       returns the original element with the attributes applied, for chaining
```

#### Example
``` JavaScript
let el = document.getElementById("save-button");
DOM.apply(el, {
  disabled : "disabled",
  transform : "scale(80%)"
});
```

### DOM.empty()
Empties node and returns it for chaining

```
@param  {Node} node Any valid DOM Node
@return {Node} The same node, now emptied of all children, for chaining
```

#### Examples
``` JavaScript
let container = document.getElementById("contents");
DOM.empty(container);
children.forEach(child => container.appendChild(child));
```

``` JavaScript
// Chaining
DOM.empty(document.getElementById("parent")).classList.remove("has-children");
```

### DOM.expand()
Extremely lightweight mini moustache/handlebars. Expands {{varname}} from vars object.

Useful when the string template is coming from another source, like PHP.

```
@param  {String} template   String to expand into
@param  {Object} vars       varname : value pairs, matching {{varname}} in template String
@return {String}            template string with values expanded into placeholders
```

#### Example
``` JavaScript
let template = "Hello, {{place}}!";
console.log(DOM.expand(template, { place : "world" }));
// Hello, world!
```

### DOM.debounce()
Take a function and return a debounced function, with an optional delay time.

This is very useful on things like `onresize` callbacks or delayed for submission `onchange`, etc, where you want the events to "settle" before they fire to avoid a very rapid number of similar events.

```
@param  {Function} callback        The function you want to "debounce"
@param  {Number}   [delayTime=300] Optional delay before the callback function is executed
@return {[type]}                   Debounced function
```

#### Example
``` JavaScript
function init(){
  console.log("did something!");
}
window.onresize = DOM.debounce(init);
```

### DOM.Animator()
Simple way to add animation loops.

First, call Animator() and assign to a constant, like this:
``` JavaScript
const animate = Animator();
```

Now, you can add animation loops using your new `animate()` function.

Pass your collection (group), your animation callback, and optionally a framerate, if other than the standard 60 fps. What you do inside the callback is up to you.

The callback will receive the collection, a timestamp (counting up from the time you called animator()), and the framerate, in case you want to use that to calculate your deltas.

See example in the repository.


## SVG methods
These are static methods against the global SVG object, intended specifically for creating, grouping and parenting SVG elements.

There are no shape-specific helper functions, so you still have to know your [SVG spec](https://developer.mozilla.org/en-US/docs/Web/API/SVGElement).

### SVG.new()
Create a new SVG container element, adding in a list of SVG child shapes

```
@param {SVGElement[]} shapes  One or more SVG shapes (created with SVG.shape())
@param {Object} [opts]        Hash of property:value pairs. Gets applied to the generated SVG
@param {int[]} [viewBox]      Optional viewbox dimensions. [100], [100, 200], [10, 10, 100, 200] are all valid
@return SVGElement
```

### SVG.shape()
Create an SVG child chape, to be added to an SVG container element via `SVG.new()`

```
@param  {String} [type="rect"] Valid SVGElement type, typically an SVGGeometryElement
@param  {Object} [opts={}]     Attribute name-value pairs to be applied to the element
@return {[type]}               SVGElement, with attributes applied.
```

### SVG.group()
Return a new SVG group, containing a bunch of SVG child shapes (created with `SVG.shape()`)

```
@param  {SVGElement[]}  [shapes=[]]   An array of SVGElements to be added to the group
@param  {Object} [opts={}]            Attribute name-value pairs to be applied to the group
@return {[type]}                      SVGGElement
```
