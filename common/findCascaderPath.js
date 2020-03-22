const findCascaderPath = (tree, value) => {
  const path = [];
  const findItem = (lTree, lValue) => {
    for (const item of lTree) {
      if (item.value === lValue) {
        path.push(item);
        return true;
      }
      if (item.children) {
        path.push(item);
        if (findItem(item.children, lValue)) {
          return true;
        }
        path.pop();
      }
    }
    return false;
  };
  findItem(tree, value);
  return path;
};
export default findCascaderPath;
