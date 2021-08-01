import { Vector2, v2 } from "./vec2";

/**
 * Manual implementation of `drag*` and `click` events.
 *
 * The effects of native `draggable` aren't all desireable, so this
 * implementation enables full control over the drag behavior.
 */
class MouseState {
  target: EventTarget | null = null;
  minDragDistance = 5;
  private start = v2();
  private dragging = false;

  listen() {
    document.addEventListener("mousedown", this.mdown);
    document.addEventListener("mousemove", this.mmove);
    document.addEventListener("mouseup", this.mup);
  }
  unlisten() {
    document.removeEventListener("mousedown", this.mdown);
    document.removeEventListener("mousemove", this.mmove);
    document.removeEventListener("mouseup", this.mup);
  }

  get targetAsHtml(): HTMLElement | null {
    if (this.target && this.target instanceof HTMLElement) {
      return this.target;
    }
    return null;
  }

  ondragstart = (start: Vector2) => {};
  ondragmove = (current: Vector2) => {};
  ondragend = () => {};
  onclick = () => {};

  private mdown = (e: MouseEvent) => {
    e.stopPropagation();
    this.start.set(v2(e.clientX, e.clientY));

    this.target = e.target;
  };
  private mmove = (e: MouseEvent) => {
    if (!this.target) return;
    if (this.dragging) {
      this.ondragmove(v2(e.clientX, e.clientY));
    } else if (this.start.distance(v2(e.clientX, e.clientY)) > this.minDragDistance) {
      this.dragging = true;
      this.ondragstart(v2(e.clientX, e.clientY));
    }
  };
  private mup = (e: MouseEvent) => {
    if (this.dragging) {
      e.stopPropagation();
      this.ondragend();
      this.dragging = false;
    } else {
      this.onclick();
    }

    this.target = null;
  };
}
