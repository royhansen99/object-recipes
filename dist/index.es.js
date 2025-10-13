function h(r) {
  if (r === null || typeof r != "object") return r;
  const t = Array.isArray(r) ? [] : {};
  for (const n in r)
    Object.prototype.hasOwnProperty.call(r, n) && (t[n] = h(r[n]));
  return t;
}
function y(r, t) {
  if (Object.is(r, t)) return !0;
  const [n, i] = [r, t].map(
    (e) => e === null ? "null" : Array.isArray(e) ? "array" : typeof e == "object" ? "object" : "other"
  );
  if (!["array", "object"].includes(n) || n !== i) return !1;
  for (const e of Object.keys(r))
    if (!y(r[e], t[e]))
      return !1;
  return !0;
}
const o = (r, t, n, i = !1) => {
  let e = r;
  for (let s = 0; s < t.length; s++) {
    const l = t[s];
    if (e === null || typeof e != "object")
      throw new Error(
        "One or more path levels are not valid. The entire nested structure you specified must be spreadable down to (but not including) the last item."
      );
    const a = e[l];
    if (s === t.length - 1)
      if (i) {
        if (Object.is(a, n))
          return !0;
      } else return e[l] = n, !0;
    else !i && a !== null && typeof a == "object" && (e[l] = Array.isArray(e[l]) ? [...e[l]] : { ...e[l] });
    e = e[l];
  }
  return !1;
}, c = (r, t, n) => {
  const i = t.replace(/\[([^\[\]]*)\]/g, ".$1").replace(/^\./, "").split(".");
  if (o(r, i, n, !0)) return r;
  const e = Array.isArray(r) ? [...r] : { ...r };
  return o(e, i, n), e;
};
class u {
  constructor(t, n) {
    this.equalityFn = Object.is, this.entity = t, n != null && n.deepEqual && (this.equalityFn = n.deepEqual === !0 ? y : n.deepEqual);
  }
  getEqualityFn(t) {
    return t === void 0 ? this.equalityFn : t === !1 ? Object.is : t === !0 ? y : t;
  }
  set(t, n) {
    const i = this.getEqualityFn(n);
    return Object.keys(t).filter(
      (s) => !i(t[s], this.entity[s])
    ).length !== 0 ? Array.isArray(this.entity) ? new u(t) : new u({ ...this.entity, ...t }) : this;
  }
  setPath(t, n, i) {
    const e = this.getEqualityFn(i), s = c(this.entity, t, n);
    return e(s, this.entity) ? this : new u(s);
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
function f(r, t) {
  return new u(r, t);
}
export {
  u as EntityClass,
  f as entity
};
