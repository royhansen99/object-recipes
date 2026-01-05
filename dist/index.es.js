function c(e) {
  if (e === null || typeof e != "object") return e;
  const t = Array.isArray(e) ? [] : {};
  for (const r in e)
    Object.prototype.hasOwnProperty.call(e, r) && (t[r] = c(e[r]));
  return t;
}
function y(e, t) {
  if (Object.is(e, t)) return !0;
  const [r, i] = [e, t].map(
    (n) => n === null ? "null" : Array.isArray(n) ? "array" : typeof n == "object" ? "object" : "other"
  );
  if (!["array", "object"].includes(r) || r !== i) return !1;
  for (const n of Object.keys(e))
    if (!y(e[n], t[n]))
      return !1;
  return !0;
}
const o = (e, t, r, i = !1) => {
  let n = e;
  for (let s = 0; s < t.length; s++) {
    const l = t[s];
    if (n === null || typeof n != "object")
      throw new Error(
        "One or more path levels are not valid. The entire nested structure you specified must be spreadable down to (but not including) the last item."
      );
    const a = n[l];
    if (s === t.length - 1)
      if (i) {
        if (Object.is(a, r))
          return !0;
      } else return n[l] = r, !0;
    else !i && a !== null && typeof a == "object" && (n[l] = Array.isArray(n[l]) ? [...n[l]] : { ...n[l] });
    n = n[l];
  }
  return !1;
}, h = (e, t, r) => {
  const i = t.replace(/\[([^\[\]]*)\]/g, ".$1").replace(/^\./, "").split(".");
  if (o(e, i, r, !0)) return e;
  const n = Array.isArray(e) ? [...e] : { ...e };
  return o(n, i, r), n;
};
class u {
  constructor(t, r) {
    this.equalityFn = Object.is, this.entity = t, r != null && r.deepEqual && (this.equalityFn = r.deepEqual === !0 ? y : r.deepEqual);
  }
  getEqualityFn(t) {
    return t === void 0 ? this.equalityFn : t === !1 ? Object.is : t === !0 ? y : t;
  }
  set(t, r) {
    const i = this.getEqualityFn(r);
    return Object.keys(t).filter(
      (s) => !i(t[s], this.entity[s])
    ).length !== 0 ? Array.isArray(this.entity) ? new u(t) : new u({ ...this.entity, ...t }) : this;
  }
  setPath(t, r, i) {
    const n = this.getEqualityFn(i), s = h(this.entity, t, r);
    return n(s, this.entity) ? this : new u(s);
  }
  recipe(t) {
    return t(this);
  }
  get() {
    return this.entity;
  }
  getClone() {
    return c(this.entity);
  }
}
function f(e, t) {
  return new u(e, t);
}
const p = (...e) => (t) => e.reduce((r, i) => r.recipe(i), f(t)).get();
export {
  u as EntityClass,
  f as entity,
  p as recipe
};
