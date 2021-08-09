# flow builder

```
$ yarn add @keboola/flow-builder
```

### Usage

```tsx
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
