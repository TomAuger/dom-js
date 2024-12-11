(()=>{
  const NUM_SHAPES = 100; // how many shapes do we create?

  // Our container to hold SVGs
  const container = document.getElementsByTagName("main")[0];

  // Initialize our animation engine
  const animator = new DOM.Animator();

  // call init() to get things started
  init();

  // set up a debounced version of init to attach to window.onresize
  const debouncedInit = DOM.debounce(init);
  window.onresize = debouncedInit;
  // I prefer to do it as a 1-liner...
  // window.onresize = DOM.debounce(init)

  function init(){
    // Create a bunch of SVGs
    let things = createShapes();

    // Add them to an SVG container, that will fill the <main> container
    let svg = SVG.new(things, {}, [container.clientWidth, container.clientHeight]);

    // We'll potentially be running this multiple times (ie on resize)
    // so, let's empty the container first.
    DOM.empty(container);
    // And then attach the SVG container we just filled.
    container.appendChild(svg);
    // You can chain these calls, like this:
    // DOM.empty(container).appendChild(svg);

    // Now let's randomize the shape locations
    things.forEach(thing => {
      DOM.apply(thing, {
        x : Math.floor(Math.random() * container.clientWidth),
        y : Math.floor(Math.random() * container.clientHeight)
      })
    });

    // Let's animate these suckers
    animator.stop("things"); // In case we've already run it (onreseize)
    animator.animate("things", things, animateThings);
  }



  // Create a bunch of SVG shapes
  function createShapes(){
    let shapes = [];
    for (let i = 0; i < NUM_SHAPES; ++i){
      // Get a random size
      let radius = Math.ceil((Math.random() * 50 + 100) / 2);

      // Create a circle
      let c = SVG.shape("circle", {
        r : radius,
        cx : 0,
        cy : 0
      });

      // Create a plus shape
      let l1 = SVG.shape("line", {
        x1 : -radius, y1 : 0,
        x2 : radius, y2 : 0
      });
      let l2 = SVG.shape("line", {
        x1 : 0, y1 : -radius,
        x2 : 0, y2 : radius
      });
      let plus = SVG.group([l1, l2], {
        class : "plus"
      });

      // Let's stick them inside their own SVG element so we can transform it
      // more easily
      let thing = SVG.new([c, plus], {
        class : "thing",
        height : radius * 2,
        width : radius * 2
      }, [-radius, -radius, radius * 2, radius * 2]);

      // add it to the shapes Array
      shapes.push(thing);
    }

    return shapes;
  }

  const MOVE = 0.02;
  // Animation callback.
  // Group is the group of objects (in this case, things) that are to be animated
  // timestamp is the number of milliseconds since the last call to animateThings
  // data is any additional data we are passing to the function, including framerate
  function animateThings(group, timestamp, data){
    let ox = container.clientWidth / 2;
    let oy = container.clientHeight / 2;

    // Animate each thing
    for (thing of group){
      let [x, y, width, height] = ["x", "y", "width", "height"].map(att => parseFloat(thing.getAttribute(att)));
      let dx = ox - width/2 - x;
      let dy = oy - height/2 - y;

      // Nothing to animate
      if (!dx && !dy) continue;

      x += dx * MOVE;
      y += dy * MOVE;
      if (Math.abs(dx) < MOVE) x = ox - width/2;
      if (Math.abs(dy) < MOVE) y = oy - height/2;

      DOM.apply(thing, { x : x, y : y });
    }
  }
})();
