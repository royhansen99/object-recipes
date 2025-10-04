function a(e) {
  if (e === null || typeof e != "object") return e;
  const t = Array.isArray(e) ? [] : {};
  for (const r in e)
    Object.prototype.hasOwnProperty.call(e, r) && (t[r] = a(e[r]));
  return t;
}
const c = (e, t, r, i = !1) => {
  let n = e;
  for (let l = 0; l < t.length; l++) {
    const s = t[l];
    if (n === null || typeof n != "object")
      throw new Error(
        "One or more path levels are not valid. The entire nested structure you specified must be spreadable down to (but not including) the last item."
      );
    const u = n[s];
    if (l === t.length - 1)
      if (i) {
        if (Object.is(u, r))
          return !0;
      } else return n[s] = r, !0;
    else !i && u !== null && typeof u == "object" && (n[s] = Array.isArray(n[s]) ? [...n[s]] : { ...n[s] });
    n = n[s];
  }
  return !1;
}, h = (e, t, r) => {
  const i = t.replace(/\[([^\[\]]*)\]/g, ".$1").split(".");
  if (c(e, i, r, !0)) return e;
  const n = { ...e };
  return c(n, i, r), n;
};
class o {
  constructor(t) {
    this.entity = t;
  }
  set(t) {
    return Object.keys(t).filter(
      (i) => !Object.is(t[i], this.entity[i])
    ).length !== 0 ? new o({ ...this.entity, ...t }) : this;
  }
  setPath(t, r) {
    const i = h(this.entity, t, r);
    return Object.is(i, this.entity) ? this : new o(i);
  }
  recipe(t) {
    return t(this);
  }
  get() {
    return this.entity;
  }
  getClone() {
    return a(this.entity);
  }
}
function y(e) {
  return new o(e);
}
export {
  o as EntityClass,
  y as entity
};
