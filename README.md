# flow builder

```
$ yarn add @keboola/flow-builder
```

### Usage

#### ESM/CJS

Ensure that `react@16.x.x` and `react-dom@16.x.x` are installed as peer dependencies.

```tsx
import "@keboola/flow-builder/dist/Graph.css"; // include this CSS file in your bundle
import * as Flow from "@keboola/flow-builder";

<Flow.Graph edges={["a.out->b+c+d.in"]}>
  <Flow.Node name="a" position={[50, 50]}>
    <Flow.Output name="out" />
    <div className="content">Node A</div>
  </Flow.Node>
  <Flow.Group name="b+c+d" position={[50, 200]}>
    <Flow.Input name="in" />
    <Flow.Node name="b">
      <div className="content">Node B</div>
    </Flow.Node>
    <Flow.Node name="c">
      <div className="content">Node C</div>
    </Flow.Node>
    <Flow.Node name="d">
      <div className="content">Node D</div>
    </Flow.Node>
  </Flow.Group>
</Flow.Graph>;
```

#### UMD

`flow-builder` can also be used directly in the browser:

```html
<!-- React + ReactDOM -->
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<!-- flow-builder -->
<link
  crossorigin
  rel="stylesheet"
  href="https://unpkg.com/@keboola/flow-builder@<version>/dist/Graph.css"
/>
<script
  crossorigin
  type="text/javascript"
  src="https://unpkg.com/@keboola/flow-builder@<version>/dist/index.umd.js"
></script>
```

### Local development

```
$ yarn dev
```
