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
  - Option 1: Button in the middle of an edge which removes it on click
    - Could be hidden unless cursor is nearby
  - Option 2: Each output corresponds to a single input, and clicking on either end of the edge removes that edge
  - Option 3: Something else
- [x] Custom node content
- [ ] Add nodes
- [ ] Remove nodes
- [ ] Node style customization
  - Border
  - Background
  - Padding
  - Outline
- [x] Node groups
  - [x] Dragging a node into a group adds it to that group
    - All of the node's edges are removed
  - [x] Dragging a node outside of a group removes it from that group
    - If the group only has one node remaining, that group is replaced by its remaining child, and all the edges that reference the group are modified to reference the remaining child
  - [x] Dragging a node over another node groups them together
    - All edges referencing both nodes are removed
- [ ] Node group style customization
  - Border
  - Background
  - Padding
  - Spacing
- [ ] Graph should fully manage its data
  - Copy data from props on initial render
  - Don't re-render on `props.data` change
  - Adding/removing nodes/edges is part of a public API
- [ ] Create documentation + demos
- [ ] Turn this into an actual library and distribute it on NPM

### Cleanup

- Add comments to everything describing behavior and invariants
  - Try to justify each type/non-null assertion
- Refactor out all the math code into a separate `math` module
  - Any math helpers in `util` should be moved into it as well
- Refactor out all the state managing code into actual state machines
- Cache aggressively
  - Paths are recalculated each render (even though they don't have to be)
  - There are tons of `.find`, `.findIndex` calls littered throughout the code
    - This ties into making the `Graph` fully manage its data, because then it can also create hashmaps for more easily accessing nodes/edges/etc.
- Consider not using React at all, because it's not actually being utilised in any meaningful way
  - `setState` is asynchronous and far too slow for interactivity
  - `lit-html`, `svelte` or just vanilla could better serve the purposes of this library