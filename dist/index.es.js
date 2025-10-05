function c(n) {
  if (n === null || typeof n != "object") return n;
  const t = Array.isArray(n) ? [] : {};
  for (const r in n)
    Object.prototype.hasOwnProperty.call(n, r) && (t[r] = c(n[r]));
  return t;
}
function y(n, t) {
  if (Object.is(n, t)) return !0;
  const [r, i] = [n, t].map(
    (e) => e === null ? "null" : Array.isArray(e) ? "array" : typeof e == "object" ? "object" : "other"
  );
  if (!["array", "object"].includes(r) || r !== i) return !1;
  for (const e of Object.keys(n))
    if (!y(n[e], t[e]))
      return !1;
  return !0;
}
const o = (n, t, r, i = !1) => {
  let e = n;
  for (let s = 0; s < t.length; s++) {
    const l = t[s];
    if (e === null || typeof e != "object")
      throw new Error(
        "One or more path levels are not valid. The entire nested structure you specified must be spreadable down to (but not including) the last item."
      );
    const a = e[l];
    if (s === t.length - 1)
      if (i) {
        if (Object.is(a, r))
          return !0;
      } else return e[l] = r, !0;
    else !i && a !== null && typeof a == "object" && (e[l] = Array.isArray(e[l]) ? [...e[l]] : { ...e[l] });
    e = e[l];
  }
  return !1;
}, h = (n, t, r) => {
  const i = t.replace(/\[([^\[\]]*)\]/g, ".$1").split(".");
  if (o(n, i, r, !0)) return n;
  const e = { ...n };
  return o(e, i, r), e;
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
    ).length !== 0 ? new u({ ...this.entity, ...t }) : this;
  }
  setPath(t, r, i) {
    const e = this.getEqualityFn(i), s = h(this.entity, t, r);
    return e(s, this.entity) ? this : new u(s);
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
function f(n, t) {
  return new u(n, t);
}
export {
  u as EntityClass,
  f as entity
};
