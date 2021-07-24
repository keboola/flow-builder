# flow builder

```
$ npm install && npm start
```

![demo](./demo.gif)

### TODO

- [x] Render nodes
- [x] Render edges
  - [x] Line
  - [ ] Bezier curve
- [x] Move nodes
- [x] Add edges
- [ ] Remove edges
- [x] Custom node content
- [ ] Add nodes
- [ ] Remove nodes
- [ ] Node style customization
  - Border
  - Background
  - Padding
  - Outline
- [ ] Add a button in the middle of an edge for removing it
- [ ] Node groups
  - A node whose children are other nodes, which also manages the child node positions
    - Children are vertically centered and evenly spaced
  - [ ] Dragging a node over another node groups them together
  - [ ] Dragging a node outside of a group removes it from that group
  - [ ] Nodes can be reordered
- [ ] Node group style customization
  - Border
  - Background
  - Padding
  - Spacing
- [ ] Multiple inputs/outputs
  - Fixed set?
  - Dynamically growing set?

### Pending design decisions

- Adding and removing edges
  - Option 1: Each edge gets a button in the middle of it, which appears when the edge is hovered over, and when clicked, removes the edge
  - Option 2: Clicking either the input or output widget on either node will remove the edge
  - Option 3: The only way to remove edges is to remove either of the connected nodes
  - Option 4: Something else
- Responsivity
  - Positions are currently specified in "grid values", which can be made responsive by changing the grid cell size + the content of each node is arbitrary, so they may be responsive with no extra effort
  - Mobile screens?