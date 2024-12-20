// dom.js - super lightweight utility functions for working with the DOM and SVGs
// (c) Tom Auger, 2019
// V01.4

// =============
var DOM = {}

/**
 * Create a new DOM (HTML) element, passing any number of
 * additional attributes to be applied to the element.
 *
 * @param  {String} [type="div"] HTML tag name
 * @param  {Object} [opts={}]    Attribute name-value pairs
 * @return {[type]}              DOM element
 *
 * @example
 *
 *  DOM.el();
 *  > <div></div>
 *
 *  DOM.el("ul", { class : "events" });
 *  > <ul class="events"></ul>
 *
 *  DOM.el("img", {
 *    width : 100,
 *    height : 100,
 *    src : "assets/logo.png",
 *    onload : reveal
 *  });
 *  > <img width="100" height="100" src="assets/logo.png" onload="function reveal(event){}">
 */
DOM.el = function(type = "div", opts = {}){
    let e = document.createElement(type);
    return DOM.apply(e, opts);
};

/**
 * Applies attributes to the DOM element using Element.setAttribute()
 * @param  {HTMLElement} el
 * @param  {Object} [atts={}] Name-value attribute pairs applied using el.setAttribute()
 * @return {HTMLElement} returns the original element with the attributes applied, for chaining
 *
 * @example
 *
 *  let el = document.getElementById("save-button");
 *  DOM.apply(el, {
 *    disabled : "disabled",
 *    transform : "scale(80%)"
 *  });
 */
DOM.apply = function(el, atts = {}){
  for (let att in atts){
    el.setAttribute(att, atts[att]);
  }
  return el;
}

/**
 * Empties node and returns it for chaining
 * @param  {Node} node Any valid DOM Node
 * @return {Node} The same node, now emptied of all children, for chaining
 *
 * @example
 *
 *  let container = document.getElementById("contents");
 *  DOM.empty(container);
 *  children.forEach(child => container.appendChild(child));
 *
 *
 *  DOM.empty(document.getElementById("parent")).classList.remove("has-children");
 */
DOM.empty = function(node){
  while(node.childNodes.length) node.firstChild.remove();
  return node;
}

/**
 * Extremely lightweight mini moustache/handlebars. Expands {{varname}} from vars object.
 * Useful when the string template is coming from another source, like PHP.
 *
 * @param  {String} template String to expand into
 * @param  {Object} vars     varname : value pairs, matching {{varname}} in template String
 * @return {String} template string with values expanded into placeholders
 *
 * @example
 *
 *  let template = "Hello, {{place}}!";
 *  console.log(DOM.expand(template, { place : "world" }));
 *
 * > Hello, world!
 */
DOM.expand = function(template, vars){
    for (let [match, varName] of template.matchAll(/\{\{(.+?)\}\}/g)){
        if (vars.hasOwnProperty(varName)){
            while(template.indexOf(match) > -1){
                template = template.replace(match, vars[varName])
            }
        }
    }
    return template;
}

/**
 * Take a function and return a debounced function, with an optional delay time.
 * This is very useful on things like onresize callbacks or delayed form
 * submission onchange, etc, where you want the events to "settle" before
 * they fire to avoid a very rapid number of similar events.
 * @param  {Function} callback        The function you want to "debounce"
 * @param  {Number}   [delayTime=300] Optional delay before the callback function is executed
 * @return {Function}                   Debounced function
 *
 * @example
 *
 *  function init(){
 *    console.log("did something!");
 *  }
 *  window.onresize = DOM.debounce(init);
 */
DOM.debounce = function (callback, delayTime = 300){
  let timerID;
  return () => {
    if (timerID) clearTimeout(timerID);
    timerID = setTimeout(callback, delayTime);
  }
}


// Simple way to add animation loops.
// First, call Animator() and assign to a constant, like this:
// const animate = Animator();
//
// Now, you can add animation loops using your new animate() function.
// pass your collection (group), your animation callback, and optionally a framerate,
// if other than the standard 60 fps. What you do inside the callback is up to you.
// The callback will receive the collection, a timestamp (counting up from the time you called animator()),
// and the framerate, in case you want to use that to calculate your deltas.
//
// See example in the repository
DOM.Animator = function(_framerate = 60){
  let animations = {};
  let framerate = _framerate;
  let lastTimestamp;
  let deltaSum = numFrames = 0;
  const REPORT_MILLIS = 1000;
  let nextReportMillis = 0;

  function tick(timestamp){
    let delta;

    // Performance logging
    if (lastTimestamp) {
      delta = timestamp - lastTimestamp;
      deltaSum += delta;
      numFrames++;

      if (timestamp > nextReportMillis){
        //console.log("Average framerate: ", deltaSum / numFrames);
        nextReportMillis = timestamp + REPORT_MILLIS;
      }
    }
    lastTimestamp = timestamp;

    for (let name in animations){
      let { group, callback, data } = animations[name];

      if (typeof callback == "function" && group.length){
        callback(group, timestamp, data);
      }
    }
    window.requestAnimationFrame(tick);
  }

  window.requestAnimationFrame(tick);

  return {
    animate : function (name, animationObject, animationCallback = function(){}, animationData = { framerate : framerate }){
      if (! Array.isArray(animationObject)) animationObject = [animationObject];

      animations[name] = {
        name: name,
        group: animationObject,
        callback: animationCallback,
        data : animationData
      };
    },

    stop : function (name) {
      delete animations[name];
    }
  }
}


// ----------------------------------

// Ultra lightweight SVG creation library.
// @TODO add NS to property application
var SVG = {};


/**
 * Create a new SVG container element, adding in a list of SVG child shapes
 *
 * @param {SVGElement[]} shapes - One or more SVG shapes (created with SVG.shape())
 * @param {Object} [opts] Hash of property:value pairs. Gets applied to the generated SVG
 * @param {int[]} [viewBox] Optional viewbox dimensions. [100], [100, 200], [10, 10, 100, 200] are all valid
 *
 * @return SVGElement
 */
SVG.new  = function(shapes = [], opts = {}, viewBox = []){
  let s = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  for (let el of shapes){
    s.appendChild(el);
  }

  if (viewBox && viewBox.length){
    let x1 = y1 = 0;
    let width, height;

    switch(viewBox.length){
      case 1 : width = height = parseInt(viewBox); break;
      case 2 : [width, height] = viewBox; break;
      case 4 : [x1, y1, width, height] = viewBox; break;
    }

    if (width && height){
      s.setAttribute("viewBox", `${x1} ${y1} ${width} ${height}`);
    }
  }

  return DOM.apply(s, opts);
}

/**
 * Create an SVG child chape, to be added to an SVG container element via SVG.new()
 * @param  {String} [type="rect"] Valid SVGElement type, typically an SVGGeometryElement
 * @param  {Object} [opts={}]     Attribute name-value pairs to be applied to the element
 * @return {[type]}               SVGElement, with attributes applied.
 */
SVG.shape = function(type = "rect", opts = {}){
  let s = document.createElementNS("http://www.w3.org/2000/svg", type);
  return DOM.apply(s, opts);
}

/**
 * Return a new SVG group, containing a bunch of SVG child shapes (created with SVG.shape())
 * @param  {SVGElement[]}  [shapes=[]] An array of SVGElements to be added to the group
 * @param  {Object} [opts={}]   Attribute name-value pairs to be applied to the group
 * @return {[type]}             SVGGElement
 */
SVG.group = function(shapes = [], opts = {}){
  let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  for (let el of shapes){
    g.appendChild(el);
  }
  return DOM.apply(g, opts);
}
