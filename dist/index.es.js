function h(e) {
  if (e === null || typeof e != "object") return e;
  const t = Array.isArray(e) ? [] : {};
  for (const r in e)
    Object.prototype.hasOwnProperty.call(e, r) && (t[r] = h(e[r]));
  return t;
}
function o(e, t) {
  if (Object.is(e, t)) return !0;
  const [r, i] = [e, t].map(
    (n) => n === null ? "null" : Array.isArray(n) ? "array" : typeof n == "object" ? "object" : "other"
  );
  if (!["array", "object"].includes(r) || r !== i) return !1;
  for (const n of Object.keys(e))
    if (!o(e[n], t[n]))
      return !1;
  return !0;
}
const l = (e, t, r, i = !1) => {
  let n = e;
  for (let s = 0; s < t.length; s++) {
    const u = t[s];
    if (n === null || typeof n != "object")
      throw new Error(
        "One or more path levels are not valid. The entire nested structure you specified must be spreadable down to (but not including) the last item."
      );
    const a = n[u];
    if (s === t.length - 1)
      if (i) {
        if (Object.is(a, r))
          return !0;
      } else return n[u] = r, !0;
    else !i && a !== null && typeof a == "object" && (n[u] = Array.isArray(n[u]) ? [...n[u]] : { ...n[u] });
    n = n[u];
  }
  return !1;
}, f = (e, t, r) => {
  const i = t.replace(/\[([^\[\]]*)\]/g, ".$1").replace(/^\./, "").split(".");
  if (!t.length) return r;
  if (l(e, i, r, !0)) return e;
  const n = Array.isArray(e) ? [...e] : { ...e };
  return l(n, i, r), n;
}, c = (e, t, r) => {
  if (!t.length) return r;
  if (l(e, t, r, !0)) return e;
  const i = Array.isArray(e) ? [...e] : { ...e };
  return l(i, t, r), i;
};
class y {
  constructor(t, r) {
    this.equalityFn = Object.is, this.entity = t, r != null && r.deepEqual && (this.equalityFn = r.deepEqual === !0 ? o : r.deepEqual);
  }
  getEqualityFn(t) {
    return t === void 0 ? this.equalityFn : t === !1 ? Object.is : t === !0 ? o : t;
  }
  set(t, r) {
    const i = this.getEqualityFn(r);
    return Array.isArray(this.entity) ? i(this.entity, t) ? this : new y(t) : Object.keys(t).filter(
      (s) => !i(t[s], this.entity[s])
    ).length !== 0 ? Array.isArray(this.entity) ? new y(t) : new y({ ...this.entity, ...t }) : this;
  }
  setPath(t, r, i) {
    const n = this.getEqualityFn(i), s = f(this.entity, t, r);
    return n(s, this.entity) ? this : new y(s);
  }
  setKeysPath(t, r, i) {
    const n = this.getEqualityFn(i), s = c(this.entity, t, r);
    return n(s, this.entity) ? this : new y(s);
  }
  recipe(t) {
    return t(this);
  }
  get() {
    return this.entity;
  }
  getClone() {
    return h(this.entity);
  }
}
function p(e, t) {
  return new y(e, t);
}
function A(...e) {
  const t = (r, i) => i.reduce(
    (n, s) => n.recipe(s),
    p(r)
  ).get();
  return e[0] instanceof Function ? (r) => t(r, e) : t(e[0], e.slice(1));
}
export {
  y as EntityClass,
  p as entity,
  A as recipe
};
