# Fleet

Parallaxing for all. One bound onScroll event to tween any number of transitions.

## How it works

~~~~
initFleet();
~~~~

is all that is needed to bind scroll and resize handlers to the document which cycles through fleet nodes (by default, initFleet({**nds**:'.fleet'})) and the children on which to apply the transition styles (by default, initFleet({**affectedChildren**:'.item'})). The markup therefore has two levels:
~~~~
<div class="fleet" data-fleet="">
    <div class="item"></div>
</div>
~~~~
The fleet node where the animations are defined, and the children on which they take effect.

## The data-fleet attribute

~~~~
data-fleet="{'ind': 0, 'ofst': 0.5, 'len': 1.5, 'points': [['move',0,0.2,[0,0.5],[0,0]], ['move',0,-1,[0,0],[0,0.5]], ['opacity',0,0.3,0.5,1], ['opacity',0,-0.1,1,0.8]]}"
~~~~

All fleet information is stored in the data-fleet attribute of that fleet node, in a JSON object. The properties are:

+ **len**: Length (in viewport heights, ei. 1 === 100vh) that fleet node is 'onstage'
+ **ofst**: Offset (in viewport heights) when fleet node starts onstage, counting from the **ind**. 
+ **ind**: index of node within the animation sequence. This is the most complex property; it defaults to 'organic', which counts its index as whenever the top boundary of the fleet node reaches the top of the viewport. An index of 0 starts the onstage from a scrollTop of 0, and an index of 1 starts the onstage when the scrollTop reaches beyond the length/height of all fleet nodes with an index of 0. This allows for instances where lengthy text might be briefly onstage on desktop, but would require a longer onstage on mobile. It delays fleet nodes of a greater index until the lesser index has finished.
  So a fleet node with {**ind**:1, **ofst**:0.5, **len**:1} will  start 50vh after all **ind**:0 fleet nodes have finished, and run for 100vh. Its offset and length together are 150vh, and if there are no other fleet nodes of the same index which have an offset + length > 150vh, then nodes of **ind**:2 will start after that point.
+ **points**: An array of animations to occur during the onstage period. Multiple animations of the same type can be bound to the same fleet node. Event handler functions can be added or overwritten when fleet is initiated:
~~~~
var customEvent = function(nds, perc, ...) {
    /* nds are the items within the fleet node, perc is the percentage/100 that the animation is at. Other arguments are passed straight from the point handler */
});
initFleet({
    **nds**: 'section', 
    **events**: { 'cust': customEvent }
});
~~~~
    
### Events
All events take the following arguments:

    [*eventName*, *ofst*, *len*, ...]
    
Where

+ *eventName*: The event triggered. See build-in events below.
+ *len*: Length (in viewport heights, ei. 1 === 100vh) that animation occurs. If a negative number, length and offset count back from the end of the onstage period.
+ *ofst*: Offset (in viewport heights) from either beginning or end of onstage period that animation starts.
      
The built-in event handlers are:

+ 'class': [..., '*className*'] Adds a class while onstage. Accepts one class.
+ 'move': [..., [*startXvw*, *startYvh*], [*endXvw*, *endXvh*]] Move items relative to the viewport. (assumes items are position:fixed)
+ 'shift': [..., [*startXperc*, *startYperc*], [*endXperc*, *endXperc*]] Move items relative to themselves. (assumes items are position:relative)
+ 'opacity': [..., *startOpacity*, *endOpacity*]
   
## Features

### Nested fleet nodes
Because a fleet node only animates items which are its direct children, nested fleet nodes are possible.
  
### Dynamic content
New fleet nodes can be added; just run initFleet() afterwards to hook them into the handlers.

## Dependencies
- jQuery
