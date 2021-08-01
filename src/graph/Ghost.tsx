import React from "react";
import { Vector2, v2 } from "./util";

/* class GhostNode extends React.Component {
  private _target: Node | null = null;
  private _container!: HTMLDivElement;
  initialOffset = v2();
  render() {
    return (
      <div className="flow-graph--node ghost" ref={el => {
        if (!el) return;
        this._container = el!;
        this._container.style.display = "none";
      }} />
    )
  }
  get pos(): Vector2 { return Vector2.fromElementPosition(this._container); }
  set pos(v: Vector2) { v.applyAsPosition(this._container); }
  get size(): Vector2 { return Vector2.fromElementSize(this._container); }
  set size(v: Vector2) { v.applyAsSize(this._container); }
  get target(): Node | null { return this._target }
  set target(v: Node | null) {
    if (v) {
      this._target = v;
      this.pos = this._target.pos.subtract(this.initialOffset);
      this.size = this._target.size;
      this._container.style.display = "inline-flex";
    } else {
      this._container.style.display = "none";
    }
  }
} */