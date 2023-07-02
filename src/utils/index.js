"use strict";

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (!obj[key]) {
      delete obj[key];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "Object" && !Array.isArray(obj[key])) {
      const res = updateNestedObjectParser(obj[key]);
      Object.keys(res).forEach((otherKey) => {
        final[`${key}.${otherKey}`] = res[otherKey];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};

export {
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
};
