- [x] have DOM automatically import all elements that have an ID and add it to DOM.els (or something)
    - make sure DOM.el() also adds items that have IDs to this list
    - then you can avoid document.getElementById() a million times
    
- [x] create DOM.append() which takes an element and an arbitrary number of parameters and does an appendChild() for each one
    - avoids silly sequential appendChild() calls
    - maybe it returns the parent element
    
- [ ] add Javadoc to new functions

- [ ] update README with new tutorials and fix old ones for 2.0