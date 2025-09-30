function y(e) {
  if (e === null || typeof e != "object") return e;
  const t = Array.isArray(e) ? [] : {};
  for (const i in e)
    Object.prototype.hasOwnProperty.call(e, i) && (t[i] = y(e[i]));
  return t;
}
const a = (e, t, i) => {
  const s = t.replace(/(\[[^\[\]]*\])/g, ".$1").split("."), c = { ...e };
  let n = c;
  for (let l = 0; l < s.length; l++) {
    let r = s[l];
    if (r.slice(0, 1) === "[" && (r = r.slice(1, -1)), n === null || typeof n != "object")
      throw new Error(
        "One or more path levels are not valid. The entire nested structure you specified must be spreadable down to (but not including) the last item."
      );
    const u = n[r];
    l === s.length - 1 ? n[r] = i : u !== null && typeof u == "object" && (n[r] = Array.isArray(n[r]) ? [...n[r]] : { ...n[r] }), n = n[r];
  }
  return c;
};
class o {
  constructor(t) {
    this.entity = t;
  }
  set(t) {
    return new o({ ...this.entity, ...t });
  }
  setPath(t, i) {
    return new o(a(this.entity, t, i));
  }
  recipe(t) {
    return t(this);
  }
  get() {
    return this.entity;
  }
  getClone() {
    return y(this.entity);
  }
}
function h(e) {
  return new o(e);
}
export {
  o as EntityClass,
  h as entity
};
