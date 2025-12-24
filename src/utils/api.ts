/**
 * Xóa các thuộc tính có giá trị rỗng (null, undefined, '') khỏi object
 */
export const cleanObject = (obj: any) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (
      newObj[key] === null ||
      newObj[key] === undefined ||
      newObj[key] === '' ||
      (Array.isArray(newObj[key]) && newObj[key].length === 0)
    ) {
      delete newObj[key];
    }
  });
  return newObj;
};
