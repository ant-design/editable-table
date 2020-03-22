export default fieldValue => {
  return (
    fieldValue &&
    typeof fieldValue === 'object' &&
    !(fieldValue instanceof Array) &&
    !fieldValue._isAMomentObject
  );
};
