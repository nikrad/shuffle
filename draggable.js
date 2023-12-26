/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/@shopify/draggable@1.1.3/build/esm/index.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
class t {
  constructor(t) {
    (this._canceled = !1), (this.data = t);
  }
  get type() {
    return this.constructor.type;
  }
  get cancelable() {
    return this.constructor.cancelable;
  }
  cancel() {
    this._canceled = !0;
  }
  canceled() {
    return this._canceled;
  }
  clone(t) {
    return new this.constructor({ ...this.data, ...t });
  }
}
(t.type = "event"), (t.cancelable = !1);
class e {
  constructor(t) {
    this.draggable = t;
  }
  attach() {
    throw new Error("Not Implemented");
  }
  detach() {
    throw new Error("Not Implemented");
  }
}
const r = { mouse: 0, drag: 0, touch: 100 };
class n {
  constructor(t = [], e = {}) {
    (this.containers = [...t]),
      (this.options = { ...e }),
      (this.dragging = !1),
      (this.currentContainer = null),
      (this.originalSource = null),
      (this.startEvent = null),
      (this.delay = (function (t) {
        const e = {};
        if (void 0 === t) return { ...r };
        if ("number" == typeof t) {
          for (const n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = t);
          return e;
        }
        for (const n in r)
          Object.prototype.hasOwnProperty.call(r, n) &&
            (void 0 === t[n] ? (e[n] = r[n]) : (e[n] = t[n]));
        return e;
      })(e.delay));
  }
  attach() {
    return this;
  }
  detach() {
    return this;
  }
  addContainer(...t) {
    this.containers = [...this.containers, ...t];
  }
  removeContainer(...t) {
    this.containers = this.containers.filter((e) => !t.includes(e));
  }
  trigger(t, e) {
    const r = document.createEvent("Event");
    return (
      (r.detail = e),
      r.initEvent(e.type, !0, !0),
      t.dispatchEvent(r),
      (this.lastEvent = e),
      e
    );
  }
}
function s(t, e) {
  if (null == t) return null;
  function r(t) {
    return (
      null != t &&
      null != e &&
      ((function (t) {
        return Boolean("string" == typeof t);
      })(e)
        ? Element.prototype.matches.call(t, e)
        : (function (t) {
            return Boolean(t instanceof NodeList || t instanceof Array);
          })(e)
        ? [...e].includes(t)
        : (function (t) {
            return Boolean(t instanceof Node);
          })(e)
        ? e === t
        : !!(function (t) {
            return Boolean("function" == typeof t);
          })(e) && e(t))
    );
  }
  let n = t;
  do {
    if (((n = n.correspondingUseElement || n.correspondingElement || n), r(n)))
      return n;
    n = n?.parentNode || null;
  } while (null != n && n !== document.body && n !== document);
  return null;
}
function i(t, e, r, n) {
  return Math.sqrt((r - t) ** 2 + (n - e) ** 2);
}
class o extends t {
  get originalEvent() {
    return this.data.originalEvent;
  }
  get clientX() {
    return this.data.clientX;
  }
  get clientY() {
    return this.data.clientY;
  }
  get target() {
    return this.data.target;
  }
  get container() {
    return this.data.container;
  }
  get originalSource() {
    return this.data.originalSource;
  }
  get pressure() {
    return this.data.pressure;
  }
}
class a extends o {}
a.type = "drag:start";
class l extends o {}
l.type = "drag:move";
class c extends o {}
c.type = "drag:stop";
class h extends o {}
h.type = "drag:pressure";
const d = Symbol("onContextMenuWhileDragging"),
  u = Symbol("onMouseDown"),
  g = Symbol("onMouseMove"),
  m = Symbol("onMouseUp"),
  p = Symbol("startDrag"),
  v = Symbol("onDistanceChange");
class f extends n {
  constructor(t = [], e = {}) {
    super(t, e),
      (this.mouseDownTimeout = null),
      (this.pageX = null),
      (this.pageY = null),
      (this[d] = this[d].bind(this)),
      (this[u] = this[u].bind(this)),
      (this[g] = this[g].bind(this)),
      (this[m] = this[m].bind(this)),
      (this[p] = this[p].bind(this)),
      (this[v] = this[v].bind(this));
  }
  attach() {
    document.addEventListener("mousedown", this[u], !0);
  }
  detach() {
    document.removeEventListener("mousedown", this[u], !0);
  }
  [u](t) {
    if (0 !== t.button || t.ctrlKey || t.metaKey) return;
    const e = s(t.target, this.containers);
    if (!e) return;
    if (this.options.handle && t.target && !s(t.target, this.options.handle))
      return;
    const r = s(t.target, this.options.draggable);
    if (!r) return;
    const { delay: n } = this,
      { pageX: i, pageY: o } = t;
    Object.assign(this, { pageX: i, pageY: o }),
      (this.onMouseDownAt = Date.now()),
      (this.startEvent = t),
      (this.currentContainer = e),
      (this.originalSource = r),
      document.addEventListener("mouseup", this[m]),
      document.addEventListener("dragstart", b),
      document.addEventListener("mousemove", this[v]),
      (this.mouseDownTimeout = window.setTimeout(() => {
        this[v]({ pageX: this.pageX, pageY: this.pageY });
      }, n.mouse));
  }
  [p]() {
    const t = this.startEvent,
      e = this.currentContainer,
      r = this.originalSource,
      n = new a({
        clientX: t.clientX,
        clientY: t.clientY,
        target: t.target,
        container: e,
        originalSource: r,
        originalEvent: t,
      });
    this.trigger(this.currentContainer, n),
      (this.dragging = !n.canceled()),
      this.dragging &&
        (document.addEventListener("contextmenu", this[d], !0),
        document.addEventListener("mousemove", this[g]));
  }
  [v](t) {
    const { pageX: e, pageY: r } = t,
      { distance: n } = this.options,
      { startEvent: s, delay: o } = this;
    if ((Object.assign(this, { pageX: e, pageY: r }), !this.currentContainer))
      return;
    const a = Date.now() - this.onMouseDownAt,
      l = i(s.pageX, s.pageY, e, r) || 0;
    clearTimeout(this.mouseDownTimeout),
      a < o.mouse
        ? document.removeEventListener("mousemove", this[v])
        : l >= n &&
          (document.removeEventListener("mousemove", this[v]), this[p]());
  }
  [g](t) {
    if (!this.dragging) return;
    const e = document.elementFromPoint(t.clientX, t.clientY),
      r = new l({
        clientX: t.clientX,
        clientY: t.clientY,
        target: e,
        container: this.currentContainer,
        originalEvent: t,
      });
    this.trigger(this.currentContainer, r);
  }
  [m](t) {
    if ((clearTimeout(this.mouseDownTimeout), 0 !== t.button)) return;
    if (
      (document.removeEventListener("mouseup", this[m]),
      document.removeEventListener("dragstart", b),
      document.removeEventListener("mousemove", this[v]),
      !this.dragging)
    )
      return;
    const e = document.elementFromPoint(t.clientX, t.clientY),
      r = new c({
        clientX: t.clientX,
        clientY: t.clientY,
        target: e,
        container: this.currentContainer,
        originalEvent: t,
      });
    this.trigger(this.currentContainer, r),
      document.removeEventListener("contextmenu", this[d], !0),
      document.removeEventListener("mousemove", this[g]),
      (this.currentContainer = null),
      (this.dragging = !1),
      (this.startEvent = null);
  }
  [d](t) {
    t.preventDefault();
  }
}
function b(t) {
  t.preventDefault();
}
function y(t) {
  const { touches: e, changedTouches: r } = t;
  return (e && e[0]) || (r && r[0]);
}
const E = Symbol("onTouchStart"),
  C = Symbol("onTouchEnd"),
  S = Symbol("onTouchMove"),
  w = Symbol("startDrag"),
  x = Symbol("onDistanceChange");
let D = !1;
window.addEventListener(
  "touchmove",
  (t) => {
    D && t.preventDefault();
  },
  { passive: !1 }
);
class L extends n {
  constructor(t = [], e = {}) {
    super(t, e),
      (this.currentScrollableParent = null),
      (this.tapTimeout = null),
      (this.touchMoved = !1),
      (this.pageX = null),
      (this.pageY = null),
      (this[E] = this[E].bind(this)),
      (this[C] = this[C].bind(this)),
      (this[S] = this[S].bind(this)),
      (this[w] = this[w].bind(this)),
      (this[x] = this[x].bind(this));
  }
  attach() {
    document.addEventListener("touchstart", this[E]);
  }
  detach() {
    document.removeEventListener("touchstart", this[E]);
  }
  [E](t) {
    const e = s(t.target, this.containers);
    if (!e) return;
    if (this.options.handle && t.target && !s(t.target, this.options.handle))
      return;
    const r = s(t.target, this.options.draggable);
    if (!r) return;
    const { distance: n = 0 } = this.options,
      { delay: i } = this,
      { pageX: o, pageY: a } = y(t);
    Object.assign(this, { pageX: o, pageY: a }),
      (this.onTouchStartAt = Date.now()),
      (this.startEvent = t),
      (this.currentContainer = e),
      (this.originalSource = r),
      document.addEventListener("touchend", this[C]),
      document.addEventListener("touchcancel", this[C]),
      document.addEventListener("touchmove", this[x]),
      e.addEventListener("contextmenu", O),
      n && (D = !0),
      (this.tapTimeout = window.setTimeout(() => {
        this[x]({ touches: [{ pageX: this.pageX, pageY: this.pageY }] });
      }, i.touch));
  }
  [w]() {
    const t = this.startEvent,
      e = this.currentContainer,
      r = y(t),
      n = this.originalSource,
      s = new a({
        clientX: r.pageX,
        clientY: r.pageY,
        target: t.target,
        container: e,
        originalSource: n,
        originalEvent: t,
      });
    this.trigger(this.currentContainer, s),
      (this.dragging = !s.canceled()),
      this.dragging && document.addEventListener("touchmove", this[S]),
      (D = this.dragging);
  }
  [x](t) {
    const { distance: e } = this.options,
      { startEvent: r, delay: n } = this,
      s = y(r),
      o = y(t),
      a = Date.now() - this.onTouchStartAt,
      l = i(s.pageX, s.pageY, o.pageX, o.pageY);
    Object.assign(this, o),
      clearTimeout(this.tapTimeout),
      a < n.touch
        ? document.removeEventListener("touchmove", this[x])
        : l >= e &&
          (document.removeEventListener("touchmove", this[x]), this[w]());
  }
  [S](t) {
    if (!this.dragging) return;
    const { pageX: e, pageY: r } = y(t),
      n = document.elementFromPoint(e - window.scrollX, r - window.scrollY),
      s = new l({
        clientX: e,
        clientY: r,
        target: n,
        container: this.currentContainer,
        originalEvent: t,
      });
    this.trigger(this.currentContainer, s);
  }
  [C](t) {
    if (
      (clearTimeout(this.tapTimeout),
      (D = !1),
      document.removeEventListener("touchend", this[C]),
      document.removeEventListener("touchcancel", this[C]),
      document.removeEventListener("touchmove", this[x]),
      this.currentContainer &&
        this.currentContainer.removeEventListener("contextmenu", O),
      !this.dragging)
    )
      return;
    document.removeEventListener("touchmove", this[S]);
    const { pageX: e, pageY: r } = y(t),
      n = document.elementFromPoint(e - window.scrollX, r - window.scrollY);
    t.preventDefault();
    const s = new c({
      clientX: e,
      clientY: r,
      target: n,
      container: this.currentContainer,
      originalEvent: t,
    });
    this.trigger(this.currentContainer, s),
      (this.currentContainer = null),
      (this.dragging = !1),
      (this.startEvent = null);
  }
}
function O(t) {
  t.preventDefault(), t.stopPropagation();
}
const F = Symbol("onMouseDown"),
  X = Symbol("onMouseUp"),
  Y = Symbol("onDragStart"),
  M = Symbol("onDragOver"),
  T = Symbol("onDragEnd"),
  A = Symbol("onDrop"),
  N = Symbol("reset");
const z = Symbol("onMouseForceWillBegin"),
  P = Symbol("onMouseForceDown"),
  I = Symbol("onMouseDown"),
  $ = Symbol("onMouseForceChange"),
  k = Symbol("onMouseMove"),
  B = Symbol("onMouseUp"),
  q = Symbol("onMouseForceGlobalChange");
var j = Object.freeze({
  __proto__: null,
  Sensor: n,
  MouseSensor: f,
  TouchSensor: L,
  DragSensor: class extends n {
    constructor(t = [], e = {}) {
      super(t, e),
        (this.mouseDownTimeout = null),
        (this.draggableElement = null),
        (this.nativeDraggableElement = null),
        (this[F] = this[F].bind(this)),
        (this[X] = this[X].bind(this)),
        (this[Y] = this[Y].bind(this)),
        (this[M] = this[M].bind(this)),
        (this[T] = this[T].bind(this)),
        (this[A] = this[A].bind(this));
    }
    attach() {
      document.addEventListener("mousedown", this[F], !0);
    }
    detach() {
      document.removeEventListener("mousedown", this[F], !0);
    }
    [Y](t) {
      t.dataTransfer.setData("text", ""),
        (t.dataTransfer.effectAllowed = this.options.type);
      const e = document.elementFromPoint(t.clientX, t.clientY),
        r = this.draggableElement;
      if (!r) return;
      const n = new a({
        clientX: t.clientX,
        clientY: t.clientY,
        target: e,
        originalSource: r,
        container: this.currentContainer,
        originalEvent: t,
      });
      setTimeout(() => {
        this.trigger(this.currentContainer, n),
          n.canceled() ? (this.dragging = !1) : (this.dragging = !0);
      }, 0);
    }
    [M](t) {
      if (!this.dragging) return;
      const e = document.elementFromPoint(t.clientX, t.clientY),
        r = this.currentContainer,
        n = new l({
          clientX: t.clientX,
          clientY: t.clientY,
          target: e,
          container: r,
          originalEvent: t,
        });
      this.trigger(r, n),
        n.canceled() ||
          (t.preventDefault(), (t.dataTransfer.dropEffect = this.options.type));
    }
    [T](t) {
      if (!this.dragging) return;
      document.removeEventListener("mouseup", this[X], !0);
      const e = document.elementFromPoint(t.clientX, t.clientY),
        r = this.currentContainer,
        n = new c({
          clientX: t.clientX,
          clientY: t.clientY,
          target: e,
          container: r,
          originalEvent: t,
        });
      this.trigger(r, n),
        (this.dragging = !1),
        (this.startEvent = null),
        this[N]();
    }
    [A](t) {
      t.preventDefault();
    }
    [F](t) {
      if (t.target && (t.target.form || t.target.contenteditable)) return;
      const e = t.target;
      if (
        ((this.currentContainer = s(e, this.containers)),
        !this.currentContainer)
      )
        return;
      if (this.options.handle && e && !s(e, this.options.handle)) return;
      const r = s(e, this.options.draggable);
      if (!r) return;
      const n = s(t.target, (t) => t.draggable);
      n && ((n.draggable = !1), (this.nativeDraggableElement = n)),
        document.addEventListener("mouseup", this[X], !0),
        document.addEventListener("dragstart", this[Y], !1),
        document.addEventListener("dragover", this[M], !1),
        document.addEventListener("dragend", this[T], !1),
        document.addEventListener("drop", this[A], !1),
        (this.startEvent = t),
        (this.mouseDownTimeout = setTimeout(() => {
          (r.draggable = !0), (this.draggableElement = r);
        }, this.delay.drag));
    }
    [X]() {
      this[N]();
    }
    [N]() {
      clearTimeout(this.mouseDownTimeout),
        document.removeEventListener("mouseup", this[X], !0),
        document.removeEventListener("dragstart", this[Y], !1),
        document.removeEventListener("dragover", this[M], !1),
        document.removeEventListener("dragend", this[T], !1),
        document.removeEventListener("drop", this[A], !1),
        this.nativeDraggableElement &&
          ((this.nativeDraggableElement.draggable = !0),
          (this.nativeDraggableElement = null)),
        this.draggableElement &&
          ((this.draggableElement.draggable = !1),
          (this.draggableElement = null));
    }
  },
  ForceTouchSensor: class extends n {
    constructor(t = [], e = {}) {
      super(t, e),
        (this.mightDrag = !1),
        (this[z] = this[z].bind(this)),
        (this[P] = this[P].bind(this)),
        (this[I] = this[I].bind(this)),
        (this[$] = this[$].bind(this)),
        (this[k] = this[k].bind(this)),
        (this[B] = this[B].bind(this));
    }
    attach() {
      for (const t of this.containers)
        t.addEventListener("webkitmouseforcewillbegin", this[z], !1),
          t.addEventListener("webkitmouseforcedown", this[P], !1),
          t.addEventListener("mousedown", this[I], !0),
          t.addEventListener("webkitmouseforcechanged", this[$], !1);
      document.addEventListener("mousemove", this[k]),
        document.addEventListener("mouseup", this[B]);
    }
    detach() {
      for (const t of this.containers)
        t.removeEventListener("webkitmouseforcewillbegin", this[z], !1),
          t.removeEventListener("webkitmouseforcedown", this[P], !1),
          t.removeEventListener("mousedown", this[I], !0),
          t.removeEventListener("webkitmouseforcechanged", this[$], !1);
      document.removeEventListener("mousemove", this[k]),
        document.removeEventListener("mouseup", this[B]);
    }
    [z](t) {
      t.preventDefault(), (this.mightDrag = !0);
    }
    [P](t) {
      if (this.dragging) return;
      const e = document.elementFromPoint(t.clientX, t.clientY),
        r = t.currentTarget;
      if (this.options.handle && e && !s(e, this.options.handle)) return;
      const n = s(e, this.options.draggable);
      if (!n) return;
      const i = new a({
        clientX: t.clientX,
        clientY: t.clientY,
        target: e,
        container: r,
        originalSource: n,
        originalEvent: t,
      });
      this.trigger(r, i),
        (this.currentContainer = r),
        (this.dragging = !i.canceled()),
        (this.mightDrag = !1);
    }
    [B](t) {
      if (!this.dragging) return;
      const e = new c({
        clientX: t.clientX,
        clientY: t.clientY,
        target: null,
        container: this.currentContainer,
        originalEvent: t,
      });
      this.trigger(this.currentContainer, e),
        (this.currentContainer = null),
        (this.dragging = !1),
        (this.mightDrag = !1);
    }
    [I](t) {
      this.mightDrag &&
        (t.stopPropagation(), t.stopImmediatePropagation(), t.preventDefault());
    }
    [k](t) {
      if (!this.dragging) return;
      const e = document.elementFromPoint(t.clientX, t.clientY),
        r = new l({
          clientX: t.clientX,
          clientY: t.clientY,
          target: e,
          container: this.currentContainer,
          originalEvent: t,
        });
      this.trigger(this.currentContainer, r);
    }
    [$](t) {
      if (this.dragging) return;
      const e = t.target,
        r = t.currentTarget,
        n = new h({
          pressure: t.webkitForce,
          clientX: t.clientX,
          clientY: t.clientY,
          target: e,
          container: r,
          originalEvent: t,
        });
      this.trigger(r, n);
    }
    [q](t) {
      if (!this.dragging) return;
      const e = t.target,
        r = new h({
          pressure: t.webkitForce,
          clientX: t.clientX,
          clientY: t.clientY,
          target: e,
          container: this.currentContainer,
          originalEvent: t,
        });
      this.trigger(this.currentContainer, r);
    }
  },
  DragMoveSensorEvent: l,
  DragPressureSensorEvent: h,
  DragStartSensorEvent: a,
  DragStopSensorEvent: c,
  SensorEvent: o,
});
class _ extends t {
  constructor(t) {
    super(t), (this.data = t);
  }
  get dragEvent() {
    return this.data.dragEvent;
  }
}
_.type = "collidable";
class H extends _ {
  get collidingElement() {
    return this.data.collidingElement;
  }
}
H.type = "collidable:in";
class R extends _ {
  get collidingElement() {
    return this.data.collidingElement;
  }
}
R.type = "collidable:out";
const U = Symbol("onDragMove"),
  W = Symbol("onDragStop"),
  V = Symbol("onRequestAnimationFrame");
function G(t, e) {
  return function (r) {
    (function (t, e) {
      if (t.v)
        throw new Error(
          "attempted to call " + e + " after decoration was finished"
        );
    })(e, "addInitializer"),
      J(r, "An initializer"),
      t.push(r);
  };
}
function K(t, e) {
  if (!t(e))
    throw new TypeError("Attempted to access private element on non-instance");
}
function Z(t, e, r, n, s, i, o, a, l, c, h) {
  var d;
  switch (i) {
    case 1:
      d = "accessor";
      break;
    case 2:
      d = "method";
      break;
    case 3:
      d = "getter";
      break;
    case 4:
      d = "setter";
      break;
    default:
      d = "field";
  }
  var u,
    g,
    m = { kind: d, name: a ? "#" + r : r, static: o, private: a, metadata: h },
    p = { v: !1 };
  if ((0 !== i && (m.addInitializer = G(s, p)), a || (0 !== i && 2 !== i)))
    if (2 === i)
      u = function (t) {
        return K(c, t), n.value;
      };
    else {
      var v = 0 === i || 1 === i;
      (v || 3 === i) &&
        (u = a
          ? function (t) {
              return K(c, t), n.get.call(t);
            }
          : function (t) {
              return n.get.call(t);
            }),
        (v || 4 === i) &&
          (g = a
            ? function (t, e) {
                K(c, t), n.set.call(t, e);
              }
            : function (t, e) {
                n.set.call(t, e);
              });
    }
  else
    (u = function (t) {
      return t[r];
    }),
      0 === i &&
        (g = function (t, e) {
          t[r] = e;
        });
  var f = a
    ? c.bind()
    : function (t) {
        return r in t;
      };
  m.access =
    u && g
      ? { get: u, set: g, has: f }
      : u
      ? { get: u, has: f }
      : { set: g, has: f };
  try {
    return t.call(e, l, m);
  } finally {
    p.v = !0;
  }
}
function J(t, e) {
  if ("function" != typeof t) throw new TypeError(e + " must be a function");
}
function Q(t, e) {
  var r = typeof e;
  if (1 === t) {
    if ("object" !== r || null === e)
      throw new TypeError(
        "accessor decorators must return an object with get, set, or init properties or void 0"
      );
    void 0 !== e.get && J(e.get, "accessor.get"),
      void 0 !== e.set && J(e.set, "accessor.set"),
      void 0 !== e.init && J(e.init, "accessor.init");
  } else if ("function" !== r) {
    throw new TypeError(
      (0 === t ? "field" : 5 === t ? "class" : "method") +
        " decorators must return a function or void 0"
    );
  }
}
function tt(t) {
  return function () {
    return t(this);
  };
}
function et(t) {
  return function (e) {
    t(this, e);
  };
}
function rt(t, e, r, n, s, i, o, a, l, c, h) {
  var d,
    u,
    g,
    m,
    p,
    v,
    f = r[0];
  n || Array.isArray(f) || (f = [f]),
    a
      ? (d =
          0 === i || 1 === i
            ? { get: tt(r[3]), set: et(r[4]) }
            : 3 === i
            ? { get: r[3] }
            : 4 === i
            ? { set: r[3] }
            : { value: r[3] })
      : 0 !== i && (d = Object.getOwnPropertyDescriptor(e, s)),
    1 === i
      ? (g = { get: d.get, set: d.set })
      : 2 === i
      ? (g = d.value)
      : 3 === i
      ? (g = d.get)
      : 4 === i && (g = d.set);
  for (var b = n ? 2 : 1, y = f.length - 1; y >= 0; y -= b) {
    var E;
    void 0 !==
      (m = Z(f[y], n ? f[y - 1] : void 0, s, d, l, i, o, a, g, c, h)) &&
      (Q(i, m),
      0 === i
        ? (E = m)
        : 1 === i
        ? ((E = m.init),
          (p = m.get || g.get),
          (v = m.set || g.set),
          (g = { get: p, set: v }))
        : (g = m),
      void 0 !== E &&
        (void 0 === u
          ? (u = E)
          : "function" == typeof u
          ? (u = [u, E])
          : u.push(E)));
  }
  if (0 === i || 1 === i) {
    if (void 0 === u)
      u = function (t, e) {
        return e;
      };
    else if ("function" != typeof u) {
      var C = u;
      u = function (t, e) {
        for (var r = e, n = C.length - 1; n >= 0; n--) r = C[n].call(t, r);
        return r;
      };
    } else {
      var S = u;
      u = function (t, e) {
        return S.call(t, e);
      };
    }
    t.push(u);
  }
  0 !== i &&
    (1 === i
      ? ((d.get = g.get), (d.set = g.set))
      : 2 === i
      ? (d.value = g)
      : 3 === i
      ? (d.get = g)
      : 4 === i && (d.set = g),
    a
      ? 1 === i
        ? (t.push(function (t, e) {
            return g.get.call(t, e);
          }),
          t.push(function (t, e) {
            return g.set.call(t, e);
          }))
        : 2 === i
        ? t.push(g)
        : t.push(function (t, e) {
            return g.call(t, e);
          })
      : Object.defineProperty(e, s, d));
}
function nt(t, e) {
  e &&
    t.push(function (t) {
      for (var r = 0; r < e.length; r++) e[r].call(t);
      return t;
    });
}
function st(t, e) {
  return Object.defineProperty(
    t,
    Symbol.metadata || Symbol.for("Symbol.metadata"),
    { configurable: !0, enumerable: !0, value: e }
  );
}
function it(t, e, r, n, s, i) {
  if (arguments.length >= 6)
    var o = i[Symbol.metadata || Symbol.for("Symbol.metadata")];
  var a = Object.create(void 0 === o ? null : o),
    l = (function (t, e, r, n) {
      for (
        var s, i, o, a = [], l = new Map(), c = new Map(), h = 0;
        h < e.length;
        h++
      ) {
        var d = e[h];
        if (Array.isArray(d)) {
          var u,
            g,
            m = d[1],
            p = d[2],
            v = d.length > 3,
            f = 16 & m,
            b = !!(8 & m),
            y = r;
          if (
            ((m &= 7),
            b
              ? ((u = t),
                0 !== m && (g = i = i || []),
                v &&
                  !o &&
                  (o = function (e) {
                    return ot(e) === t;
                  }),
                (y = o))
              : ((u = t.prototype), 0 !== m && (g = s = s || [])),
            0 !== m && !v)
          ) {
            var E = b ? c : l,
              C = E.get(p) || 0;
            if (!0 === C || (3 === C && 4 !== m) || (4 === C && 3 !== m))
              throw new Error(
                "Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " +
                  p
              );
            E.set(p, !(!C && m > 2) || m);
          }
          rt(a, u, d, f, p, m, b, v, g, y, n);
        }
      }
      return nt(a, s), nt(a, i), a;
    })(t, e, s, a);
  return (
    r.length || st(t, a),
    {
      e: l,
      get c() {
        return (function (t, e, r, n) {
          if (e.length) {
            for (
              var s = [], i = t, o = t.name, a = r ? 2 : 1, l = e.length - 1;
              l >= 0;
              l -= a
            ) {
              var c = { v: !1 };
              try {
                var h = e[l].call(r ? e[l - 1] : void 0, i, {
                  kind: "class",
                  name: o,
                  addInitializer: G(s, c),
                  metadata: n,
                });
              } finally {
                c.v = !0;
              }
              void 0 !== h && (Q(5, h), (i = h));
            }
            return [
              st(i, n),
              function () {
                for (var t = 0; t < s.length; t++) s[t].call(i);
              },
            ];
          }
        })(t, r, n, a);
      },
    }
  );
}
function ot(t) {
  if (Object(t) !== t)
    throw TypeError(
      "right-hand side of 'in' should be an object, got " +
        (null !== t ? typeof t : "null")
    );
  return t;
}
function at(t, { name: e, addInitializer: r }) {
  r(function () {
    this[e] = t.bind(this);
  });
}
class lt extends t {
  constructor(t) {
    super(t), (this.data = t);
  }
  get source() {
    return this.data.source;
  }
  get originalSource() {
    return this.data.originalSource;
  }
  get mirror() {
    return this.data.mirror;
  }
  get sourceContainer() {
    return this.data.sourceContainer;
  }
  get sensorEvent() {
    return this.data.sensorEvent;
  }
  get originalEvent() {
    return this.sensorEvent ? this.sensorEvent.originalEvent : null;
  }
}
lt.type = "drag";
class ct extends lt {}
(ct.type = "drag:start"), (ct.cancelable = !0);
class ht extends lt {}
ht.type = "drag:move";
class dt extends lt {
  get overContainer() {
    return this.data.overContainer;
  }
  get over() {
    return this.data.over;
  }
}
(dt.type = "drag:over"), (dt.cancelable = !0);
class ut extends lt {
  get overContainer() {
    return this.data.overContainer;
  }
  get over() {
    return this.data.over;
  }
}
ut.type = "drag:out";
class gt extends lt {
  get overContainer() {
    return this.data.overContainer;
  }
}
gt.type = "drag:over:container";
class mt extends lt {
  get overContainer() {
    return this.data.overContainer;
  }
}
mt.type = "drag:out:container";
class pt extends lt {
  get pressure() {
    return this.data.pressure;
  }
}
pt.type = "drag:pressure";
class vt extends lt {}
(vt.type = "drag:stop"), (vt.cancelable = !0);
class ft extends lt {}
var bt, yt;
ft.type = "drag:stopped";
class Et extends e {
  constructor(t) {
    bt(super(t)),
      (this.lastWidth = 0),
      (this.lastHeight = 0),
      (this.mirror = null);
  }
  attach() {
    this.draggable
      .on("mirror:created", this.onMirrorCreated)
      .on("drag:over", this.onDragOver)
      .on("drag:over:container", this.onDragOver);
  }
  detach() {
    this.draggable
      .off("mirror:created", this.onMirrorCreated)
      .off("mirror:destroy", this.onMirrorDestroy)
      .off("drag:over", this.onDragOver)
      .off("drag:over:container", this.onDragOver);
  }
  getOptions() {
    return this.draggable.options.resizeMirror || {};
  }
  onMirrorCreated({ mirror: t }) {
    this.mirror = t;
  }
  onMirrorDestroy() {
    this.mirror = null;
  }
  onDragOver(t) {
    this.resize(t);
  }
  resize(t) {
    requestAnimationFrame(() => {
      let e = null;
      const { overContainer: r } = t;
      if (null == this.mirror || null == this.mirror.parentNode) return;
      this.mirror.parentNode !== r && r.appendChild(this.mirror),
        t.type === dt.type && (e = t.over);
      const n = e || this.draggable.getDraggableElementsForContainer(r)[0];
      var s;
      n &&
        ((s = () => {
          const t = n.getBoundingClientRect();
          null == this.mirror ||
            (this.lastHeight === t.height && this.lastWidth === t.width) ||
            ((this.mirror.style.width = `${t.width}px`),
            (this.mirror.style.height = `${t.height}px`),
            (this.lastWidth = t.width),
            (this.lastHeight = t.height));
        }),
        requestAnimationFrame(() => {
          requestAnimationFrame(s);
        }));
    });
  }
}
(yt = Et),
  ([bt] = it(
    yt,
    [
      [at, 2, "onMirrorCreated"],
      [at, 2, "onMirrorDestroy"],
      [at, 2, "onDragOver"],
    ],
    [],
    0,
    void 0,
    e
  ).e);
class Ct extends t {
  get dragEvent() {
    return this.data.dragEvent;
  }
  get snappable() {
    return this.data.snappable;
  }
}
Ct.type = "snap";
class St extends Ct {}
(St.type = "snap:in"), (St.cancelable = !0);
class wt extends Ct {}
(wt.type = "snap:out"), (wt.cancelable = !0);
const xt = Symbol("onDragStart"),
  Dt = Symbol("onDragStop"),
  Lt = Symbol("onDragOver"),
  Ot = Symbol("onDragOut"),
  Ft = Symbol("onMirrorCreated"),
  Xt = Symbol("onMirrorDestroy");
var Yt, Mt;
const Tt = { duration: 150, easingFunction: "ease-in-out", horizontal: !1 };
class At extends e {
  constructor(t) {
    Yt(super(t)),
      (this.options = { ...Tt, ...this.getOptions() }),
      (this.lastAnimationFrame = null);
  }
  attach() {
    this.draggable.on("sortable:sorted", this.onSortableSorted);
  }
  detach() {
    this.draggable.off("sortable:sorted", this.onSortableSorted);
  }
  getOptions() {
    return this.draggable.options.swapAnimation || {};
  }
  onSortableSorted({ oldIndex: t, newIndex: e, dragEvent: r }) {
    const { source: n, over: s } = r;
    this.lastAnimationFrame && cancelAnimationFrame(this.lastAnimationFrame),
      (this.lastAnimationFrame = requestAnimationFrame(() => {
        t >= e ? Nt(n, s, this.options) : Nt(s, n, this.options);
      }));
  }
}
function Nt(t, e, { duration: r, easingFunction: n, horizontal: s }) {
  for (const r of [t, e]) r.style.pointerEvents = "none";
  if (s) {
    const r = t.offsetWidth;
    (t.style.transform = `translate3d(${r}px, 0, 0)`),
      (e.style.transform = `translate3d(-${r}px, 0, 0)`);
  } else {
    const r = t.offsetHeight;
    (t.style.transform = `translate3d(0, ${r}px, 0)`),
      (e.style.transform = `translate3d(0, -${r}px, 0)`);
  }
  requestAnimationFrame(() => {
    for (const s of [t, e])
      s.addEventListener("transitionend", zt),
        (s.style.transition = `transform ${r}ms ${n}`),
        (s.style.transform = "");
  });
}
function zt(t) {
  var e;
  null != t.target &&
    ((e = t.target), Boolean("style" in e)) &&
    ((t.target.style.transition = ""),
    (t.target.style.pointerEvents = ""),
    t.target.removeEventListener("transitionend", zt));
}
(Mt = At), ([Yt] = it(Mt, [[at, 2, "onSortableSorted"]], [], 0, void 0, e).e);
const Pt = Symbol("onSortableSorted"),
  It = Symbol("onSortableSort"),
  $t = { duration: 150, easingFunction: "ease-in-out" };
function kt(t) {
  (t.target.style.transition = ""),
    (t.target.style.pointerEvents = ""),
    t.target.removeEventListener("transitionend", kt);
}
var Bt = Object.freeze({
  __proto__: null,
  Collidable: class extends e {
    constructor(t) {
      super(t),
        (this.currentlyCollidingElement = null),
        (this.lastCollidingElement = null),
        (this.currentAnimationFrame = null),
        (this[U] = this[U].bind(this)),
        (this[W] = this[W].bind(this)),
        (this[V] = this[V].bind(this));
    }
    attach() {
      this.draggable.on("drag:move", this[U]).on("drag:stop", this[W]);
    }
    detach() {
      this.draggable.off("drag:move", this[U]).off("drag:stop", this[W]);
    }
    getCollidables() {
      const t = this.draggable.options.collidables;
      return "string" == typeof t
        ? Array.prototype.slice.call(document.querySelectorAll(t))
        : t instanceof NodeList || t instanceof Array
        ? Array.prototype.slice.call(t)
        : t instanceof HTMLElement
        ? [t]
        : "function" == typeof t
        ? t()
        : [];
    }
    [U](t) {
      const e = t.sensorEvent.target;
      (this.currentAnimationFrame = requestAnimationFrame(this[V](e))),
        this.currentlyCollidingElement && t.cancel();
      const r = new H({
          dragEvent: t,
          collidingElement: this.currentlyCollidingElement,
        }),
        n = new R({
          dragEvent: t,
          collidingElement: this.lastCollidingElement,
        }),
        s = Boolean(
          this.currentlyCollidingElement &&
            this.lastCollidingElement !== this.currentlyCollidingElement
        ),
        i = Boolean(
          !this.currentlyCollidingElement && this.lastCollidingElement
        );
      s
        ? (this.lastCollidingElement && this.draggable.trigger(n),
          this.draggable.trigger(r))
        : i && this.draggable.trigger(n),
        (this.lastCollidingElement = this.currentlyCollidingElement);
    }
    [W](t) {
      const e = this.currentlyCollidingElement || this.lastCollidingElement,
        r = new R({ dragEvent: t, collidingElement: e });
      e && this.draggable.trigger(r),
        (this.lastCollidingElement = null),
        (this.currentlyCollidingElement = null);
    }
    [V](t) {
      return () => {
        const e = this.getCollidables();
        this.currentlyCollidingElement = s(t, (t) => e.includes(t));
      };
    }
  },
  ResizeMirror: Et,
  defaultResizeMirrorOptions: {},
  Snappable: class extends e {
    constructor(t) {
      super(t),
        (this.firstSource = null),
        (this.mirror = null),
        (this[xt] = this[xt].bind(this)),
        (this[Dt] = this[Dt].bind(this)),
        (this[Lt] = this[Lt].bind(this)),
        (this[Ot] = this[Ot].bind(this)),
        (this[Ft] = this[Ft].bind(this)),
        (this[Xt] = this[Xt].bind(this));
    }
    attach() {
      this.draggable
        .on("drag:start", this[xt])
        .on("drag:stop", this[Dt])
        .on("drag:over", this[Lt])
        .on("drag:out", this[Ot])
        .on("droppable:over", this[Lt])
        .on("droppable:out", this[Ot])
        .on("mirror:created", this[Ft])
        .on("mirror:destroy", this[Xt]);
    }
    detach() {
      this.draggable
        .off("drag:start", this[xt])
        .off("drag:stop", this[Dt])
        .off("drag:over", this[Lt])
        .off("drag:out", this[Ot])
        .off("droppable:over", this[Lt])
        .off("droppable:out", this[Ot])
        .off("mirror:created", this[Ft])
        .off("mirror:destroy", this[Xt]);
    }
    [xt](t) {
      t.canceled() || (this.firstSource = t.source);
    }
    [Dt]() {
      this.firstSource = null;
    }
    [Lt](t) {
      if (t.canceled()) return;
      const e = t.source || t.dragEvent.source;
      if (e === this.firstSource) return void (this.firstSource = null);
      const r = new St({ dragEvent: t, snappable: t.over || t.droppable });
      this.draggable.trigger(r),
        r.canceled() ||
          (this.mirror && (this.mirror.style.display = "none"),
          e.classList.remove(
            ...this.draggable.getClassNamesFor("source:dragging")
          ),
          e.classList.add(...this.draggable.getClassNamesFor("source:placed")),
          setTimeout(() => {
            e.classList.remove(
              ...this.draggable.getClassNamesFor("source:placed")
            );
          }, this.draggable.options.placedTimeout));
    }
    [Ot](t) {
      if (t.canceled()) return;
      const e = t.source || t.dragEvent.source,
        r = new wt({ dragEvent: t, snappable: t.over || t.droppable });
      this.draggable.trigger(r),
        r.canceled() ||
          (this.mirror && (this.mirror.style.display = ""),
          e.classList.add(
            ...this.draggable.getClassNamesFor("source:dragging")
          ));
    }
    [Ft]({ mirror: t }) {
      this.mirror = t;
    }
    [Xt]() {
      this.mirror = null;
    }
  },
  SwapAnimation: At,
  defaultSwapAnimationOptions: Tt,
  SortAnimation: class extends e {
    constructor(t) {
      super(t),
        (this.options = { ...$t, ...this.getOptions() }),
        (this.lastAnimationFrame = null),
        (this.lastElements = []),
        (this[Pt] = this[Pt].bind(this)),
        (this[It] = this[It].bind(this));
    }
    attach() {
      this.draggable.on("sortable:sort", this[It]),
        this.draggable.on("sortable:sorted", this[Pt]);
    }
    detach() {
      this.draggable.off("sortable:sort", this[It]),
        this.draggable.off("sortable:sorted", this[Pt]);
    }
    getOptions() {
      return this.draggable.options.sortAnimation || {};
    }
    [It]({ dragEvent: t }) {
      const { sourceContainer: e } = t,
        r = this.draggable.getDraggableElementsForContainer(e);
      this.lastElements = Array.from(r).map((t) => ({
        domEl: t,
        offsetTop: t.offsetTop,
        offsetLeft: t.offsetLeft,
      }));
    }
    [Pt]({ oldIndex: t, newIndex: e }) {
      if (t === e) return;
      const r = [];
      let n, s, i;
      t > e
        ? ((n = e), (s = t - 1), (i = 1))
        : ((n = t + 1), (s = e), (i = -1));
      for (let t = n; t <= s; t++) {
        const e = this.lastElements[t],
          n = this.lastElements[t + i];
        r.push({ from: e, to: n });
      }
      cancelAnimationFrame(this.lastAnimationFrame),
        (this.lastAnimationFrame = requestAnimationFrame(() => {
          r.forEach((t) =>
            (function ({ from: t, to: e }, { duration: r, easingFunction: n }) {
              const s = t.domEl,
                i = t.offsetLeft - e.offsetLeft,
                o = t.offsetTop - e.offsetTop;
              (s.style.pointerEvents = "none"),
                (s.style.transform = `translate3d(${i}px, ${o}px, 0)`),
                requestAnimationFrame(() => {
                  s.addEventListener("transitionend", kt),
                    (s.style.transition = `transform ${r}ms ${n}`),
                    (s.style.transform = "");
                });
            })(t, this.options)
          );
        }));
    }
  },
  defaultSortAnimationOptions: $t,
});
const qt = Symbol("onInitialize"),
  jt = Symbol("onDestroy"),
  _t = Symbol("announceEvent"),
  Ht = Symbol("announceMessage"),
  Rt = { expire: 7e3 };
const Ut = (function () {
  const t = document.createElement("div");
  return (
    t.setAttribute("id", "draggable-live-region"),
    t.setAttribute("aria-relevant", "additions"),
    t.setAttribute("aria-atomic", "true"),
    t.setAttribute("aria-live", "assertive"),
    t.setAttribute("role", "log"),
    (t.style.position = "fixed"),
    (t.style.width = "1px"),
    (t.style.height = "1px"),
    (t.style.top = "-1px"),
    (t.style.overflow = "hidden"),
    t
  );
})();
document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(Ut);
});
const Wt = Symbol("onInitialize"),
  Vt = Symbol("onDestroy"),
  Gt = {};
const Kt = [];
class Zt extends t {
  constructor(t) {
    super(t), (this.data = t);
  }
  get source() {
    return this.data.source;
  }
  get originalSource() {
    return this.data.originalSource;
  }
  get sourceContainer() {
    return this.data.sourceContainer;
  }
  get sensorEvent() {
    return this.data.sensorEvent;
  }
  get dragEvent() {
    return this.data.dragEvent;
  }
  get originalEvent() {
    return this.sensorEvent ? this.sensorEvent.originalEvent : null;
  }
}
class Jt extends Zt {}
Jt.type = "mirror:create";
class Qt extends Zt {
  get mirror() {
    return this.data.mirror;
  }
}
Qt.type = "mirror:created";
class te extends Zt {
  get mirror() {
    return this.data.mirror;
  }
}
te.type = "mirror:attached";
class ee extends Zt {
  get mirror() {
    return this.data.mirror;
  }
  get passedThreshX() {
    return this.data.passedThreshX;
  }
  get passedThreshY() {
    return this.data.passedThreshY;
  }
}
(ee.type = "mirror:move"), (ee.cancelable = !0);
class re extends Zt {
  get mirror() {
    return this.data.mirror;
  }
  get passedThreshX() {
    return this.data.passedThreshX;
  }
  get passedThreshY() {
    return this.data.passedThreshY;
  }
}
re.type = "mirror:moved";
class ne extends Zt {
  get mirror() {
    return this.data.mirror;
  }
}
(ne.type = "mirror:destroy"), (ne.cancelable = !0);
const se = Symbol("onDragStart"),
  ie = Symbol("onDragMove"),
  oe = Symbol("onDragStop"),
  ae = Symbol("onMirrorCreated"),
  le = Symbol("onMirrorMove"),
  ce = Symbol("onScroll"),
  he = Symbol("getAppendableContainer"),
  de = {
    constrainDimensions: !1,
    xAxis: !0,
    yAxis: !0,
    cursorOffsetX: null,
    cursorOffsetY: null,
    thresholdX: null,
    thresholdY: null,
  };
function ue({ source: t, ...e }) {
  return be((r) => {
    const n = t.getBoundingClientRect();
    r({ source: t, sourceRect: n, ...e });
  });
}
function ge({ sensorEvent: t, sourceRect: e, options: r, ...n }) {
  return be((s) => {
    const i = null === r.cursorOffsetY ? t.clientY - e.top : r.cursorOffsetY,
      o = null === r.cursorOffsetX ? t.clientX - e.left : r.cursorOffsetX;
    s({
      sensorEvent: t,
      sourceRect: e,
      mirrorOffset: { top: i, left: o },
      options: r,
      ...n,
    });
  });
}
function me({ mirror: t, source: e, options: r, ...n }) {
  return be((s) => {
    let i, o;
    if (r.constrainDimensions) {
      const t = getComputedStyle(e);
      (i = t.getPropertyValue("height")), (o = t.getPropertyValue("width"));
    }
    (t.style.display = null),
      (t.style.position = "fixed"),
      (t.style.pointerEvents = "none"),
      (t.style.top = 0),
      (t.style.left = 0),
      (t.style.margin = 0),
      r.constrainDimensions && ((t.style.height = i), (t.style.width = o)),
      s({ mirror: t, source: e, options: r, ...n });
  });
}
function pe({ mirror: t, mirrorClasses: e, ...r }) {
  return be((n) => {
    t.classList.add(...e), n({ mirror: t, mirrorClasses: e, ...r });
  });
}
function ve({ mirror: t, ...e }) {
  return be((r) => {
    t.removeAttribute("id"), delete t.id, r({ mirror: t, ...e });
  });
}
function fe({ withFrame: t = !1, initial: e = !1 } = {}) {
  return ({
    mirror: r,
    sensorEvent: n,
    mirrorOffset: s,
    initialY: i,
    initialX: o,
    scrollOffset: a,
    options: l,
    passedThreshX: c,
    passedThreshY: h,
    lastMovedX: d,
    lastMovedY: u,
    ...g
  }) =>
    be(
      (t) => {
        const m = {
          mirror: r,
          sensorEvent: n,
          mirrorOffset: s,
          options: l,
          ...g,
        };
        if (s) {
          const t = c
              ? Math.round((n.clientX - s.left - a.x) / (l.thresholdX || 1)) *
                (l.thresholdX || 1)
              : Math.round(d),
            g = h
              ? Math.round((n.clientY - s.top - a.y) / (l.thresholdY || 1)) *
                (l.thresholdY || 1)
              : Math.round(u);
          (l.xAxis && l.yAxis) || e
            ? (r.style.transform = `translate3d(${t}px, ${g}px, 0)`)
            : l.xAxis && !l.yAxis
            ? (r.style.transform = `translate3d(${t}px, ${i}px, 0)`)
            : l.yAxis &&
              !l.xAxis &&
              (r.style.transform = `translate3d(${o}px, ${g}px, 0)`),
            e && ((m.initialX = t), (m.initialY = g)),
            (m.lastMovedX = t),
            (m.lastMovedY = g);
        }
        t(m);
      },
      { frame: t }
    );
}
function be(t, { raf: e = !1 } = {}) {
  return new Promise((r, n) => {
    e
      ? requestAnimationFrame(() => {
          t(r, n);
        })
      : t(r, n);
  });
}
const ye = Symbol("onDragStart"),
  Ee = Symbol("onDragMove"),
  Ce = Symbol("onDragStop"),
  Se = Symbol("scroll"),
  we = { speed: 6, sensitivity: 50, scrollableElements: [] };
function xe() {
  return document.scrollingElement || document.documentElement;
}
class De {
  constructor() {
    this.callbacks = {};
  }
  on(t, ...e) {
    return (
      this.callbacks[t] || (this.callbacks[t] = []),
      this.callbacks[t].push(...e),
      this
    );
  }
  off(t, e) {
    if (!this.callbacks[t]) return null;
    const r = this.callbacks[t].slice(0);
    for (let n = 0; n < r.length; n++)
      e === r[n] && this.callbacks[t].splice(n, 1);
    return this;
  }
  trigger(t) {
    if (!this.callbacks[t.type]) return null;
    const e = [...this.callbacks[t.type]],
      r = [];
    for (let n = e.length - 1; n >= 0; n--) {
      const s = e[n];
      try {
        s(t);
      } catch (t) {
        r.push(t);
      }
    }
    return (
      r.length &&
        console.error(
          `Draggable caught errors while triggering '${t.type}'`,
          r
        ),
      this
    );
  }
}
class Le extends t {
  get draggable() {
    return this.data.draggable;
  }
}
Le.type = "draggable";
class Oe extends Le {}
Oe.type = "draggable:initialize";
class Fe extends Le {}
Fe.type = "draggable:destroy";
const Xe = Symbol("onDragStart"),
  Ye = Symbol("onDragMove"),
  Me = Symbol("onDragStop"),
  Te = Symbol("onDragPressure"),
  Ae = Symbol("dragStop"),
  Ne = {
    "drag:start": (t) =>
      `Picked up ${
        t.source.textContent.trim() || t.source.id || "draggable element"
      }`,
    "drag:stop": (t) =>
      `Released ${
        t.source.textContent.trim() || t.source.id || "draggable element"
      }`,
  },
  ze = {
    "container:dragging": "draggable-container--is-dragging",
    "source:dragging": "draggable-source--is-dragging",
    "source:placed": "draggable-source--placed",
    "container:placed": "draggable-container--placed",
    "body:dragging": "draggable--is-dragging",
    "draggable:over": "draggable--over",
    "container:over": "draggable-container--over",
    "source:original": "draggable--original",
    mirror: "draggable-mirror",
  },
  Pe = {
    draggable: ".draggable-source",
    handle: null,
    delay: {},
    distance: 0,
    placedTimeout: 800,
    plugins: [],
    sensors: [],
    exclude: { plugins: [], sensors: [] },
  };
class Ie {
  constructor(t = [document.body], e = {}) {
    if (t instanceof NodeList || t instanceof Array) this.containers = [...t];
    else {
      if (!(t instanceof HTMLElement))
        throw new Error(
          "Draggable containers are expected to be of type `NodeList`, `HTMLElement[]` or `HTMLElement`"
        );
      this.containers = [t];
    }
    (this.options = {
      ...Pe,
      ...e,
      classes: { ...ze, ...(e.classes || {}) },
      announcements: { ...Ne, ...(e.announcements || {}) },
      exclude: {
        plugins: (e.exclude && e.exclude.plugins) || [],
        sensors: (e.exclude && e.exclude.sensors) || [],
      },
    }),
      (this.emitter = new De()),
      (this.dragging = !1),
      (this.plugins = []),
      (this.sensors = []),
      (this[Xe] = this[Xe].bind(this)),
      (this[Ye] = this[Ye].bind(this)),
      (this[Me] = this[Me].bind(this)),
      (this[Te] = this[Te].bind(this)),
      (this[Ae] = this[Ae].bind(this)),
      document.addEventListener("drag:start", this[Xe], !0),
      document.addEventListener("drag:move", this[Ye], !0),
      document.addEventListener("drag:stop", this[Me], !0),
      document.addEventListener("drag:pressure", this[Te], !0);
    const r = Object.values(Ie.Plugins).filter(
        (t) => !this.options.exclude.plugins.includes(t)
      ),
      n = Object.values(Ie.Sensors).filter(
        (t) => !this.options.exclude.sensors.includes(t)
      );
    this.addPlugin(...r, ...this.options.plugins),
      this.addSensor(...n, ...this.options.sensors);
    const s = new Oe({ draggable: this });
    this.on("mirror:created", ({ mirror: t }) => (this.mirror = t)),
      this.on("mirror:destroy", () => (this.mirror = null)),
      this.trigger(s);
  }
  destroy() {
    document.removeEventListener("drag:start", this[Xe], !0),
      document.removeEventListener("drag:move", this[Ye], !0),
      document.removeEventListener("drag:stop", this[Me], !0),
      document.removeEventListener("drag:pressure", this[Te], !0);
    const t = new Fe({ draggable: this });
    this.trigger(t),
      this.removePlugin(...this.plugins.map((t) => t.constructor)),
      this.removeSensor(...this.sensors.map((t) => t.constructor));
  }
  addPlugin(...t) {
    const e = t.map((t) => new t(this));
    return (
      e.forEach((t) => t.attach()),
      (this.plugins = [...this.plugins, ...e]),
      this
    );
  }
  removePlugin(...t) {
    return (
      this.plugins
        .filter((e) => t.includes(e.constructor))
        .forEach((t) => t.detach()),
      (this.plugins = this.plugins.filter((e) => !t.includes(e.constructor))),
      this
    );
  }
  addSensor(...t) {
    const e = t.map((t) => new t(this.containers, this.options));
    return (
      e.forEach((t) => t.attach()),
      (this.sensors = [...this.sensors, ...e]),
      this
    );
  }
  removeSensor(...t) {
    return (
      this.sensors
        .filter((e) => t.includes(e.constructor))
        .forEach((t) => t.detach()),
      (this.sensors = this.sensors.filter((e) => !t.includes(e.constructor))),
      this
    );
  }
  addContainer(...t) {
    return (
      (this.containers = [...this.containers, ...t]),
      this.sensors.forEach((e) => e.addContainer(...t)),
      this
    );
  }
  removeContainer(...t) {
    return (
      (this.containers = this.containers.filter((e) => !t.includes(e))),
      this.sensors.forEach((e) => e.removeContainer(...t)),
      this
    );
  }
  on(t, ...e) {
    return this.emitter.on(t, ...e), this;
  }
  off(t, e) {
    return this.emitter.off(t, e), this;
  }
  trigger(t) {
    return this.emitter.trigger(t), this;
  }
  getClassNameFor(t) {
    return this.getClassNamesFor(t)[0];
  }
  getClassNamesFor(t) {
    const e = this.options.classes[t];
    return e instanceof Array
      ? e
      : "string" == typeof e || e instanceof String
      ? [e]
      : [];
  }
  isDragging() {
    return Boolean(this.dragging);
  }
  getDraggableElements() {
    return this.containers.reduce(
      (t, e) => [...t, ...this.getDraggableElementsForContainer(e)],
      []
    );
  }
  getDraggableElementsForContainer(t) {
    return [...t.querySelectorAll(this.options.draggable)].filter(
      (t) => t !== this.originalSource && t !== this.mirror
    );
  }
  cancel() {
    this[Ae]();
  }
  [Xe](t) {
    const e = $e(t),
      { target: r, container: n, originalSource: i } = e;
    if (!this.containers.includes(n)) return;
    if (this.options.handle && r && !s(r, this.options.handle))
      return void e.cancel();
    (this.originalSource = i),
      (this.sourceContainer = n),
      this.lastPlacedSource &&
        this.lastPlacedContainer &&
        (clearTimeout(this.placedTimeoutID),
        this.lastPlacedSource.classList.remove(
          ...this.getClassNamesFor("source:placed")
        ),
        this.lastPlacedContainer.classList.remove(
          ...this.getClassNamesFor("container:placed")
        )),
      (this.source = this.originalSource.cloneNode(!0)),
      this.originalSource.parentNode.insertBefore(
        this.source,
        this.originalSource
      ),
      (this.originalSource.style.display = "none");
    const o = new ct({
      source: this.source,
      originalSource: this.originalSource,
      sourceContainer: n,
      sensorEvent: e,
    });
    if ((this.trigger(o), (this.dragging = !o.canceled()), o.canceled()))
      return (
        this.source.remove(), void (this.originalSource.style.display = null)
      );
    this.originalSource.classList.add(
      ...this.getClassNamesFor("source:original")
    ),
      this.source.classList.add(...this.getClassNamesFor("source:dragging")),
      this.sourceContainer.classList.add(
        ...this.getClassNamesFor("container:dragging")
      ),
      document.body.classList.add(...this.getClassNamesFor("body:dragging")),
      ke(document.body, "none"),
      requestAnimationFrame(() => {
        const e = $e(t).clone({ target: this.source });
        this[Ye]({ ...t, detail: e });
      });
  }
  [Ye](t) {
    if (!this.dragging) return;
    const e = $e(t),
      { container: r } = e;
    let n = e.target;
    const i = new ht({
      source: this.source,
      originalSource: this.originalSource,
      sourceContainer: r,
      sensorEvent: e,
    });
    this.trigger(i),
      i.canceled() && e.cancel(),
      (n = s(n, this.options.draggable));
    const o = s(e.target, this.containers),
      a = e.overContainer || o,
      l = this.currentOverContainer && a !== this.currentOverContainer,
      c = this.currentOver && n !== this.currentOver,
      h = a && this.currentOverContainer !== a,
      d = o && n && this.currentOver !== n;
    if (c) {
      const t = new ut({
        source: this.source,
        originalSource: this.originalSource,
        sourceContainer: r,
        sensorEvent: e,
        over: this.currentOver,
        overContainer: this.currentOverContainer,
      });
      this.currentOver.classList.remove(
        ...this.getClassNamesFor("draggable:over")
      ),
        (this.currentOver = null),
        this.trigger(t);
    }
    if (l) {
      const t = new mt({
        source: this.source,
        originalSource: this.originalSource,
        sourceContainer: r,
        sensorEvent: e,
        overContainer: this.currentOverContainer,
      });
      this.currentOverContainer.classList.remove(
        ...this.getClassNamesFor("container:over")
      ),
        (this.currentOverContainer = null),
        this.trigger(t);
    }
    if (h) {
      a.classList.add(...this.getClassNamesFor("container:over"));
      const t = new gt({
        source: this.source,
        originalSource: this.originalSource,
        sourceContainer: r,
        sensorEvent: e,
        overContainer: a,
      });
      (this.currentOverContainer = a), this.trigger(t);
    }
    if (d) {
      n.classList.add(...this.getClassNamesFor("draggable:over"));
      const t = new dt({
        source: this.source,
        originalSource: this.originalSource,
        sourceContainer: r,
        sensorEvent: e,
        overContainer: a,
        over: n,
      });
      (this.currentOver = n), this.trigger(t);
    }
  }
  [Ae](t) {
    if (!this.dragging) return;
    this.dragging = !1;
    const e = new vt({
      source: this.source,
      originalSource: this.originalSource,
      sensorEvent: t ? t.sensorEvent : null,
      sourceContainer: this.sourceContainer,
    });
    this.trigger(e),
      e.canceled() ||
        this.source.parentNode.insertBefore(this.originalSource, this.source),
      this.source.remove(),
      (this.originalSource.style.display = ""),
      this.source.classList.remove(...this.getClassNamesFor("source:dragging")),
      this.originalSource.classList.remove(
        ...this.getClassNamesFor("source:original")
      ),
      this.originalSource.classList.add(
        ...this.getClassNamesFor("source:placed")
      ),
      this.sourceContainer.classList.add(
        ...this.getClassNamesFor("container:placed")
      ),
      this.sourceContainer.classList.remove(
        ...this.getClassNamesFor("container:dragging")
      ),
      document.body.classList.remove(...this.getClassNamesFor("body:dragging")),
      ke(document.body, ""),
      this.currentOver &&
        this.currentOver.classList.remove(
          ...this.getClassNamesFor("draggable:over")
        ),
      this.currentOverContainer &&
        this.currentOverContainer.classList.remove(
          ...this.getClassNamesFor("container:over")
        ),
      (this.lastPlacedSource = this.originalSource),
      (this.lastPlacedContainer = this.sourceContainer),
      (this.placedTimeoutID = setTimeout(() => {
        this.lastPlacedSource &&
          this.lastPlacedSource.classList.remove(
            ...this.getClassNamesFor("source:placed")
          ),
          this.lastPlacedContainer &&
            this.lastPlacedContainer.classList.remove(
              ...this.getClassNamesFor("container:placed")
            ),
          (this.lastPlacedSource = null),
          (this.lastPlacedContainer = null);
      }, this.options.placedTimeout));
    const r = new ft({
      source: this.source,
      originalSource: this.originalSource,
      sensorEvent: t ? t.sensorEvent : null,
      sourceContainer: this.sourceContainer,
    });
    this.trigger(r),
      (this.source = null),
      (this.originalSource = null),
      (this.currentOverContainer = null),
      (this.currentOver = null),
      (this.sourceContainer = null);
  }
  [Me](t) {
    this[Ae](t);
  }
  [Te](t) {
    if (!this.dragging) return;
    const e = $e(t),
      r = this.source || s(e.originalEvent.target, this.options.draggable),
      n = new pt({ sensorEvent: e, source: r, pressure: e.pressure });
    this.trigger(n);
  }
}
function $e(t) {
  return t.detail;
}
function ke(t, e) {
  (t.style.webkitUserSelect = e),
    (t.style.mozUserSelect = e),
    (t.style.msUserSelect = e),
    (t.style.oUserSelect = e),
    (t.style.userSelect = e);
}
(Ie.Plugins = {
  Announcement: class extends e {
    constructor(t) {
      super(t),
        (this.options = { ...Rt, ...this.getOptions() }),
        (this.originalTriggerMethod = this.draggable.trigger),
        (this[qt] = this[qt].bind(this)),
        (this[jt] = this[jt].bind(this));
    }
    attach() {
      this.draggable.on("draggable:initialize", this[qt]);
    }
    detach() {
      this.draggable.off("draggable:destroy", this[jt]);
    }
    getOptions() {
      return this.draggable.options.announcements || {};
    }
    [_t](t) {
      const e = this.options[t.type];
      e && "string" == typeof e && this[Ht](e),
        e && "function" == typeof e && this[Ht](e(t));
    }
    [Ht](t) {
      !(function (t, { expire: e }) {
        const r = document.createElement("div");
        (r.textContent = t),
          Ut.appendChild(r),
          setTimeout(() => {
            Ut.removeChild(r);
          }, e);
      })(t, { expire: this.options.expire });
    }
    [qt]() {
      this.draggable.trigger = (t) => {
        try {
          this[_t](t);
        } finally {
          this.originalTriggerMethod.call(this.draggable, t);
        }
      };
    }
    [jt]() {
      this.draggable.trigger = this.originalTriggerMethod;
    }
  },
  Focusable: class extends e {
    constructor(t) {
      super(t),
        (this.options = { ...Gt, ...this.getOptions() }),
        (this[Wt] = this[Wt].bind(this)),
        (this[Vt] = this[Vt].bind(this));
    }
    attach() {
      this.draggable
        .on("draggable:initialize", this[Wt])
        .on("draggable:destroy", this[Vt]);
    }
    detach() {
      this.draggable
        .off("draggable:initialize", this[Wt])
        .off("draggable:destroy", this[Vt]),
        this[Vt]();
    }
    getOptions() {
      return this.draggable.options.focusable || {};
    }
    getElements() {
      return [
        ...this.draggable.containers,
        ...this.draggable.getDraggableElements(),
      ];
    }
    [Wt]() {
      requestAnimationFrame(() => {
        this.getElements().forEach((t) =>
          (function (t) {
            const e = Boolean(!t.getAttribute("tabindex") && -1 === t.tabIndex);
            e && (Kt.push(t), (t.tabIndex = 0));
          })(t)
        );
      });
    }
    [Vt]() {
      requestAnimationFrame(() => {
        this.getElements().forEach((t) =>
          (function (t) {
            const e = Kt.indexOf(t);
            -1 !== e && ((t.tabIndex = -1), Kt.splice(e, 1));
          })(t)
        );
      });
    }
  },
  Mirror: class extends e {
    constructor(t) {
      super(t),
        (this.options = { ...de, ...this.getOptions() }),
        (this.scrollOffset = { x: 0, y: 0 }),
        (this.initialScrollOffset = { x: window.scrollX, y: window.scrollY }),
        (this[se] = this[se].bind(this)),
        (this[ie] = this[ie].bind(this)),
        (this[oe] = this[oe].bind(this)),
        (this[ae] = this[ae].bind(this)),
        (this[le] = this[le].bind(this)),
        (this[ce] = this[ce].bind(this));
    }
    attach() {
      this.draggable
        .on("drag:start", this[se])
        .on("drag:move", this[ie])
        .on("drag:stop", this[oe])
        .on("mirror:created", this[ae])
        .on("mirror:move", this[le]);
    }
    detach() {
      this.draggable
        .off("drag:start", this[se])
        .off("drag:move", this[ie])
        .off("drag:stop", this[oe])
        .off("mirror:created", this[ae])
        .off("mirror:move", this[le]);
    }
    getOptions() {
      return this.draggable.options.mirror || {};
    }
    [se](t) {
      if (t.canceled()) return;
      "ontouchstart" in window &&
        document.addEventListener("scroll", this[ce], !0),
        (this.initialScrollOffset = { x: window.scrollX, y: window.scrollY });
      const {
        source: e,
        originalSource: r,
        sourceContainer: n,
        sensorEvent: s,
      } = t;
      this.lastMirrorMovedClient = { x: s.clientX, y: s.clientY };
      const i = new Jt({
        source: e,
        originalSource: r,
        sourceContainer: n,
        sensorEvent: s,
        dragEvent: t,
      });
      if (
        (this.draggable.trigger(i),
        (function (t) {
          return /^drag/.test(t.originalEvent.type);
        })(s) || i.canceled())
      )
        return;
      const o = this[he](e) || n;
      this.mirror = e.cloneNode(!0);
      const a = new Qt({
          source: e,
          originalSource: r,
          sourceContainer: n,
          sensorEvent: s,
          dragEvent: t,
          mirror: this.mirror,
        }),
        l = new te({
          source: e,
          originalSource: r,
          sourceContainer: n,
          sensorEvent: s,
          dragEvent: t,
          mirror: this.mirror,
        });
      this.draggable.trigger(a),
        o.appendChild(this.mirror),
        this.draggable.trigger(l);
    }
    [ie](t) {
      if (!this.mirror || t.canceled()) return;
      const {
        source: e,
        originalSource: r,
        sourceContainer: n,
        sensorEvent: s,
      } = t;
      let i = !0,
        o = !0;
      if (this.options.thresholdX || this.options.thresholdY) {
        const { x: t, y: e } = this.lastMirrorMovedClient;
        if (
          (Math.abs(t - s.clientX) < this.options.thresholdX
            ? (i = !1)
            : (this.lastMirrorMovedClient.x = s.clientX),
          Math.abs(e - s.clientY) < this.options.thresholdY
            ? (o = !1)
            : (this.lastMirrorMovedClient.y = s.clientY),
          !i && !o)
        )
          return;
      }
      const a = new ee({
        source: e,
        originalSource: r,
        sourceContainer: n,
        sensorEvent: s,
        dragEvent: t,
        mirror: this.mirror,
        passedThreshX: i,
        passedThreshY: o,
      });
      this.draggable.trigger(a);
    }
    [oe](t) {
      if (
        ("ontouchstart" in window &&
          document.removeEventListener("scroll", this[ce], !0),
        (this.initialScrollOffset = { x: 0, y: 0 }),
        (this.scrollOffset = { x: 0, y: 0 }),
        !this.mirror)
      )
        return;
      const { source: e, sourceContainer: r, sensorEvent: n } = t,
        s = new ne({
          source: e,
          mirror: this.mirror,
          sourceContainer: r,
          sensorEvent: n,
          dragEvent: t,
        });
      this.draggable.trigger(s), s.canceled() || this.mirror.remove();
    }
    [ce]() {
      this.scrollOffset = {
        x: window.scrollX - this.initialScrollOffset.x,
        y: window.scrollY - this.initialScrollOffset.y,
      };
    }
    [ae]({ mirror: t, source: e, sensorEvent: r }) {
      const n = this.draggable.getClassNamesFor("mirror");
      t.style.display = "none";
      const s = {
        mirror: t,
        source: e,
        sensorEvent: r,
        mirrorClasses: n,
        scrollOffset: this.scrollOffset,
        options: this.options,
        passedThreshX: !0,
        passedThreshY: !0,
      };
      return Promise.resolve(s)
        .then(ue)
        .then(ge)
        .then(me)
        .then(pe)
        .then(fe({ initial: !0 }))
        .then(ve)
        .then(
          ({ mirrorOffset: t, initialX: e, initialY: r, ...n }) => (
            (this.mirrorOffset = t),
            (this.initialX = e),
            (this.initialY = r),
            (this.lastMovedX = e),
            (this.lastMovedY = r),
            { mirrorOffset: t, initialX: e, initialY: r, ...n }
          )
        );
    }
    [le](t) {
      if (t.canceled()) return null;
      const e = {
        mirror: t.mirror,
        sensorEvent: t.sensorEvent,
        mirrorOffset: this.mirrorOffset,
        options: this.options,
        initialX: this.initialX,
        initialY: this.initialY,
        scrollOffset: this.scrollOffset,
        passedThreshX: t.passedThreshX,
        passedThreshY: t.passedThreshY,
        lastMovedX: this.lastMovedX,
        lastMovedY: this.lastMovedY,
      };
      return Promise.resolve(e)
        .then(fe({ raf: !0 }))
        .then(
          ({ lastMovedX: t, lastMovedY: e, ...r }) => (
            (this.lastMovedX = t),
            (this.lastMovedY = e),
            { lastMovedX: t, lastMovedY: e, ...r }
          )
        )
        .then((e) => {
          const r = new re({
            source: t.source,
            originalSource: t.originalSource,
            sourceContainer: t.sourceContainer,
            sensorEvent: t.sensorEvent,
            dragEvent: t.dragEvent,
            mirror: this.mirror,
            passedThreshX: t.passedThreshX,
            passedThreshY: t.passedThreshY,
          });
          return this.draggable.trigger(r), e;
        });
    }
    [he](t) {
      const e = this.options.appendTo;
      return "string" == typeof e
        ? document.querySelector(e)
        : e instanceof HTMLElement
        ? e
        : "function" == typeof e
        ? e(t)
        : t.parentNode;
    }
  },
  Scrollable: class extends e {
    constructor(t) {
      super(t),
        (this.options = { ...we, ...this.getOptions() }),
        (this.currentMousePosition = null),
        (this.scrollAnimationFrame = null),
        (this.scrollableElement = null),
        (this.findScrollableElementFrame = null),
        (this[ye] = this[ye].bind(this)),
        (this[Ee] = this[Ee].bind(this)),
        (this[Ce] = this[Ce].bind(this)),
        (this[Se] = this[Se].bind(this));
    }
    attach() {
      this.draggable
        .on("drag:start", this[ye])
        .on("drag:move", this[Ee])
        .on("drag:stop", this[Ce]);
    }
    detach() {
      this.draggable
        .off("drag:start", this[ye])
        .off("drag:move", this[Ee])
        .off("drag:stop", this[Ce]);
    }
    getOptions() {
      return this.draggable.options.scrollable || {};
    }
    getScrollableElement(t) {
      return this.hasDefinedScrollableElements()
        ? s(t, this.options.scrollableElements) || document.documentElement
        : (function (t) {
            if (!t) return xe();
            const e = getComputedStyle(t).getPropertyValue("position"),
              r = "absolute" === e,
              n = s(
                t,
                (t) =>
                  (!r ||
                    !(function (t) {
                      const e =
                        getComputedStyle(t).getPropertyValue("position");
                      return "static" === e;
                    })(t)) &&
                  (function (t) {
                    const e = /(auto|scroll)/,
                      r = getComputedStyle(t, null),
                      n =
                        r.getPropertyValue("overflow") +
                        r.getPropertyValue("overflow-y") +
                        r.getPropertyValue("overflow-x");
                    return e.test(n);
                  })(t)
              );
            return "fixed" !== e && n ? n : xe();
          })(t);
    }
    hasDefinedScrollableElements() {
      return Boolean(0 !== this.options.scrollableElements.length);
    }
    [ye](t) {
      this.findScrollableElementFrame = requestAnimationFrame(() => {
        this.scrollableElement = this.getScrollableElement(t.source);
      });
    }
    [Ee](t) {
      if (
        ((this.findScrollableElementFrame = requestAnimationFrame(() => {
          this.scrollableElement = this.getScrollableElement(
            t.sensorEvent.target
          );
        })),
        !this.scrollableElement)
      )
        return;
      const e = t.sensorEvent,
        r = { x: 0, y: 0 };
      "ontouchstart" in window &&
        ((r.y =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0),
        (r.x =
          window.pageXOffset ||
          document.documentElement.scrollLeft ||
          document.body.scrollLeft ||
          0)),
        (this.currentMousePosition = {
          clientX: e.clientX - r.x,
          clientY: e.clientY - r.y,
        }),
        (this.scrollAnimationFrame = requestAnimationFrame(this[Se]));
    }
    [Ce]() {
      cancelAnimationFrame(this.scrollAnimationFrame),
        cancelAnimationFrame(this.findScrollableElementFrame),
        (this.scrollableElement = null),
        (this.scrollAnimationFrame = null),
        (this.findScrollableElementFrame = null),
        (this.currentMousePosition = null);
    }
    [Se]() {
      if (!this.scrollableElement || !this.currentMousePosition) return;
      cancelAnimationFrame(this.scrollAnimationFrame);
      const { speed: t, sensitivity: e } = this.options,
        r = this.scrollableElement.getBoundingClientRect(),
        n = r.bottom > window.innerHeight,
        s = r.top < 0 || n,
        i = xe(),
        o = this.scrollableElement,
        a = this.currentMousePosition.clientX,
        l = this.currentMousePosition.clientY;
      if (o === document.body || o === document.documentElement || s) {
        const { innerHeight: r, innerWidth: n } = window;
        l < e ? (i.scrollTop -= t) : r - l < e && (i.scrollTop += t),
          a < e ? (i.scrollLeft -= t) : n - a < e && (i.scrollLeft += t);
      } else {
        const { offsetHeight: n, offsetWidth: s } = o;
        r.top + n - l < e
          ? (o.scrollTop += t)
          : l - r.top < e && (o.scrollTop -= t),
          r.left + s - a < e
            ? (o.scrollLeft += t)
            : a - r.left < e && (o.scrollLeft -= t);
      }
      this.scrollAnimationFrame = requestAnimationFrame(this[Se]);
    }
  },
}),
  (Ie.Sensors = { MouseSensor: f, TouchSensor: L });
class Be extends t {
  constructor(t) {
    super(t), (this.data = t);
  }
  get dragEvent() {
    return this.data.dragEvent;
  }
}
Be.type = "droppable";
class qe extends Be {
  get dropzone() {
    return this.data.dropzone;
  }
}
(qe.type = "droppable:start"), (qe.cancelable = !0);
class je extends Be {
  get dropzone() {
    return this.data.dropzone;
  }
}
(je.type = "droppable:dropped"), (je.cancelable = !0);
class _e extends Be {
  get dropzone() {
    return this.data.dropzone;
  }
}
(_e.type = "droppable:returned"), (_e.cancelable = !0);
class He extends Be {
  get dropzone() {
    return this.data.dropzone;
  }
}
(He.type = "droppable:stop"), (He.cancelable = !0);
const Re = Symbol("onDragStart"),
  Ue = Symbol("onDragMove"),
  We = Symbol("onDragStop"),
  Ve = Symbol("dropInDropZone"),
  Ge = Symbol("returnToOriginalDropzone"),
  Ke = Symbol("closestDropzone"),
  Ze = Symbol("getDropzones");
const Je = {
    "droppable:dropped": function ({ dragEvent: t, dropzone: e }) {
      return `Dropped ${
        t.source.textContent.trim() || t.source.id || "draggable element"
      } into ${e.textContent.trim() || e.id || "droppable element"}`;
    },
    "droppable:returned": function ({ dragEvent: t, dropzone: e }) {
      return `Returned ${
        t.source.textContent.trim() || t.source.id || "draggable element"
      } from ${e.textContent.trim() || e.id || "droppable element"}`;
    },
  },
  Qe = {
    "droppable:active": "draggable-dropzone--active",
    "droppable:occupied": "draggable-dropzone--occupied",
  },
  tr = { dropzone: ".draggable-droppable" };
class er extends Ie {
  constructor(t = [], e = {}) {
    super(t, {
      ...tr,
      ...e,
      classes: { ...Qe, ...(e.classes || {}) },
      announcements: { ...Je, ...(e.announcements || {}) },
    }),
      (this.dropzones = null),
      (this.lastDropzone = null),
      (this.initialDropzone = null),
      (this[Re] = this[Re].bind(this)),
      (this[Ue] = this[Ue].bind(this)),
      (this[We] = this[We].bind(this)),
      this.on("drag:start", this[Re])
        .on("drag:move", this[Ue])
        .on("drag:stop", this[We]);
  }
  destroy() {
    super.destroy(),
      this.off("drag:start", this[Re])
        .off("drag:move", this[Ue])
        .off("drag:stop", this[We]);
  }
  [Re](t) {
    if (t.canceled()) return;
    this.dropzones = [...this[Ze]()];
    const e = s(t.sensorEvent.target, this.options.dropzone);
    if (!e) return void t.cancel();
    const r = new qe({ dragEvent: t, dropzone: e });
    if ((this.trigger(r), r.canceled())) t.cancel();
    else {
      this.initialDropzone = e;
      for (const t of this.dropzones)
        t.classList.contains(this.getClassNameFor("droppable:occupied")) ||
          t.classList.add(...this.getClassNamesFor("droppable:active"));
    }
  }
  [Ue](t) {
    if (t.canceled()) return;
    const e = this[Ke](t.sensorEvent.target);
    e &&
    !e.classList.contains(this.getClassNameFor("droppable:occupied")) &&
    this[Ve](t, e)
      ? (this.lastDropzone = e)
      : (e && e !== this.initialDropzone) ||
        !this.lastDropzone ||
        (this[Ge](t), (this.lastDropzone = null));
  }
  [We](t) {
    const e = new He({
      dragEvent: t,
      dropzone: this.lastDropzone || this.initialDropzone,
    });
    this.trigger(e);
    const r = this.getClassNamesFor("droppable:occupied");
    for (const t of this.dropzones)
      t.classList.remove(...this.getClassNamesFor("droppable:active"));
    this.lastDropzone &&
      this.lastDropzone !== this.initialDropzone &&
      this.initialDropzone.classList.remove(...r),
      (this.dropzones = null),
      (this.lastDropzone = null),
      (this.initialDropzone = null);
  }
  [Ve](t, e) {
    const r = new je({ dragEvent: t, dropzone: e });
    if ((this.trigger(r), r.canceled())) return !1;
    const n = this.getClassNamesFor("droppable:occupied");
    return (
      this.lastDropzone && this.lastDropzone.classList.remove(...n),
      e.appendChild(t.source),
      e.classList.add(...n),
      !0
    );
  }
  [Ge](t) {
    const e = new _e({ dragEvent: t, dropzone: this.lastDropzone });
    this.trigger(e),
      e.canceled() ||
        (this.initialDropzone.appendChild(t.source),
        this.lastDropzone.classList.remove(
          ...this.getClassNamesFor("droppable:occupied")
        ));
  }
  [Ke](t) {
    return this.dropzones ? s(t, this.dropzones) : null;
  }
  [Ze]() {
    const t = this.options.dropzone;
    return "string" == typeof t
      ? document.querySelectorAll(t)
      : t instanceof NodeList || t instanceof Array
      ? t
      : "function" == typeof t
      ? t()
      : [];
  }
}
class rr extends t {
  constructor(t) {
    super(t), (this.data = t);
  }
  get dragEvent() {
    return this.data.dragEvent;
  }
}
rr.type = "swappable";
class nr extends rr {}
(nr.type = "swappable:start"), (nr.cancelable = !0);
class sr extends rr {
  get over() {
    return this.data.over;
  }
  get overContainer() {
    return this.data.overContainer;
  }
}
(sr.type = "swappable:swap"), (sr.cancelable = !0);
class ir extends rr {
  get swappedElement() {
    return this.data.swappedElement;
  }
}
ir.type = "swappable:swapped";
class or extends rr {}
or.type = "swappable:stop";
const ar = Symbol("onDragStart"),
  lr = Symbol("onDragOver"),
  cr = Symbol("onDragStop");
const hr = {
  "swappabled:swapped": function ({ dragEvent: t, swappedElement: e }) {
    return `Swapped ${
      t.source.textContent.trim() || t.source.id || "swappable element"
    } with ${e.textContent.trim() || e.id || "swappable element"}`;
  },
};
class dr extends Ie {
  constructor(t = [], e = {}) {
    super(t, { ...e, announcements: { ...hr, ...(e.announcements || {}) } }),
      (this.lastOver = null),
      (this[ar] = this[ar].bind(this)),
      (this[lr] = this[lr].bind(this)),
      (this[cr] = this[cr].bind(this)),
      this.on("drag:start", this[ar])
        .on("drag:over", this[lr])
        .on("drag:stop", this[cr]);
  }
  destroy() {
    super.destroy(),
      this.off("drag:start", this._onDragStart)
        .off("drag:over", this._onDragOver)
        .off("drag:stop", this._onDragStop);
  }
  [ar](t) {
    const e = new nr({ dragEvent: t });
    this.trigger(e), e.canceled() && t.cancel();
  }
  [lr](t) {
    if (t.over === t.originalSource || t.over === t.source || t.canceled())
      return;
    const e = new sr({
      dragEvent: t,
      over: t.over,
      overContainer: t.overContainer,
    });
    if ((this.trigger(e), e.canceled())) return;
    this.lastOver && this.lastOver !== t.over && ur(this.lastOver, t.source),
      this.lastOver === t.over
        ? (this.lastOver = null)
        : (this.lastOver = t.over),
      ur(t.source, t.over);
    const r = new ir({ dragEvent: t, swappedElement: t.over });
    this.trigger(r);
  }
  [cr](t) {
    const e = new or({ dragEvent: t });
    this.trigger(e), (this.lastOver = null);
  }
}
function ur(t, e) {
  const r = e.parentNode,
    n = t.parentNode;
  !(function (t) {
    const e = document.createElement("div");
    t(e), e.remove();
  })((s) => {
    n.insertBefore(s, t), r.insertBefore(t, e), n.insertBefore(e, s);
  });
}
class gr extends t {
  constructor(t) {
    super(t), (this.data = t);
  }
  get dragEvent() {
    return this.data.dragEvent;
  }
}
gr.type = "sortable";
class mr extends gr {
  get startIndex() {
    return this.data.startIndex;
  }
  get startContainer() {
    return this.data.startContainer;
  }
}
(mr.type = "sortable:start"), (mr.cancelable = !0);
class pr extends gr {
  get currentIndex() {
    return this.data.currentIndex;
  }
  get over() {
    return this.data.over;
  }
  get overContainer() {
    return this.data.dragEvent.overContainer;
  }
}
(pr.type = "sortable:sort"), (pr.cancelable = !0);
class vr extends gr {
  get oldIndex() {
    return this.data.oldIndex;
  }
  get newIndex() {
    return this.data.newIndex;
  }
  get oldContainer() {
    return this.data.oldContainer;
  }
  get newContainer() {
    return this.data.newContainer;
  }
}
vr.type = "sortable:sorted";
class fr extends gr {
  get oldIndex() {
    return this.data.oldIndex;
  }
  get newIndex() {
    return this.data.newIndex;
  }
  get oldContainer() {
    return this.data.oldContainer;
  }
  get newContainer() {
    return this.data.newContainer;
  }
}
fr.type = "sortable:stop";
const br = Symbol("onDragStart"),
  yr = Symbol("onDragOverContainer"),
  Er = Symbol("onDragOver"),
  Cr = Symbol("onDragStop");
const Sr = {
  "sortable:sorted": function ({ dragEvent: t }) {
    const e = t.source.textContent.trim() || t.source.id || "sortable element";
    if (t.over) {
      const r = t.over.textContent.trim() || t.over.id || "sortable element";
      return t.source.compareDocumentPosition(t.over) &
        Node.DOCUMENT_POSITION_FOLLOWING
        ? `Placed ${e} after ${r}`
        : `Placed ${e} before ${r}`;
    }
    return `Placed ${e} into a different container`;
  },
};
class wr extends Ie {
  constructor(t = [], e = {}) {
    super(t, { ...e, announcements: { ...Sr, ...(e.announcements || {}) } }),
      (this.startIndex = null),
      (this.startContainer = null),
      (this[br] = this[br].bind(this)),
      (this[yr] = this[yr].bind(this)),
      (this[Er] = this[Er].bind(this)),
      (this[Cr] = this[Cr].bind(this)),
      this.on("drag:start", this[br])
        .on("drag:over:container", this[yr])
        .on("drag:over", this[Er])
        .on("drag:stop", this[Cr]);
  }
  destroy() {
    super.destroy(),
      this.off("drag:start", this[br])
        .off("drag:over:container", this[yr])
        .off("drag:over", this[Er])
        .off("drag:stop", this[Cr]);
  }
  index(t) {
    return this.getSortableElementsForContainer(t.parentNode).indexOf(t);
  }
  getSortableElementsForContainer(t) {
    return [...t.querySelectorAll(this.options.draggable)].filter(
      (e) =>
        e !== this.originalSource && e !== this.mirror && e.parentNode === t
    );
  }
  [br](t) {
    (this.startContainer = t.source.parentNode),
      (this.startIndex = this.index(t.source));
    const e = new mr({
      dragEvent: t,
      startIndex: this.startIndex,
      startContainer: this.startContainer,
    });
    this.trigger(e), e.canceled() && t.cancel();
  }
  [yr](t) {
    if (t.canceled()) return;
    const { source: e, over: r, overContainer: n } = t,
      s = this.index(e),
      i = new pr({ dragEvent: t, currentIndex: s, source: e, over: r });
    if ((this.trigger(i), i.canceled())) return;
    const o = Dr({
      source: e,
      over: r,
      overContainer: n,
      children: this.getSortableElementsForContainer(n),
    });
    if (!o) return;
    const { oldContainer: a, newContainer: l } = o,
      c = this.index(t.source),
      h = new vr({
        dragEvent: t,
        oldIndex: s,
        newIndex: c,
        oldContainer: a,
        newContainer: l,
      });
    this.trigger(h);
  }
  [Er](t) {
    if (t.over === t.originalSource || t.over === t.source) return;
    const { source: e, over: r, overContainer: n } = t,
      s = this.index(e),
      i = new pr({ dragEvent: t, currentIndex: s, source: e, over: r });
    if ((this.trigger(i), i.canceled())) return;
    const o = Dr({
      source: e,
      over: r,
      overContainer: n,
      children: this.getDraggableElementsForContainer(n),
    });
    if (!o) return;
    const { oldContainer: a, newContainer: l } = o,
      c = this.index(e),
      h = new vr({
        dragEvent: t,
        oldIndex: s,
        newIndex: c,
        oldContainer: a,
        newContainer: l,
      });
    this.trigger(h);
  }
  [Cr](t) {
    const e = new fr({
      dragEvent: t,
      oldIndex: this.startIndex,
      newIndex: this.index(t.source),
      oldContainer: this.startContainer,
      newContainer: t.source.parentNode,
    });
    this.trigger(e), (this.startIndex = null), (this.startContainer = null);
  }
}
function xr(t) {
  return Array.prototype.indexOf.call(t.parentNode.children, t);
}
function Dr({ source: t, over: e, overContainer: r, children: n }) {
  const s = !n.length,
    i = t.parentNode !== r,
    o = e && t.parentNode === e.parentNode;
  return s
    ? (function (t, e) {
        const r = t.parentNode;
        return e.appendChild(t), { oldContainer: r, newContainer: e };
      })(t, r)
    : o
    ? (function (t, e) {
        const r = xr(t),
          n = xr(e);
        r < n
          ? t.parentNode.insertBefore(t, e.nextElementSibling)
          : t.parentNode.insertBefore(t, e);
        return { oldContainer: t.parentNode, newContainer: t.parentNode };
      })(t, e)
    : i
    ? (function (t, e, r) {
        const n = t.parentNode;
        e ? e.parentNode.insertBefore(t, e) : r.appendChild(t);
        return { oldContainer: n, newContainer: t.parentNode };
      })(t, e, r)
    : null;
}
export {
  t as BaseEvent,
  e as BasePlugin,
  Ie as Draggable,
  er as Droppable,
  Bt as Plugins,
  j as Sensors,
  wr as Sortable,
  dr as Swappable,
};
export default null;
//# sourceMappingURL=/sm/9d63eb5034600605412bfb62510c5475cccb4b515c2c0ec28762b8cf463ce9b3.map
