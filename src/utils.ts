export function uniqueArrayOfObjects<
  T extends { [sheetName: string]: string[] }
>(array: T[]): T[] {
  return array.reduceRight((acc, item) => {
    const key = Object.keys(item)[0];
    const currentItem = acc.find((i) => Object.keys(i)[0] === key);

    if (!currentItem) {
      acc.push(item);
    } else {
      const currentArray = currentItem[key];

      (currentItem[key] as any) = [...new Set([...currentArray, ...item[key]])];
    }
    return acc;
  }, [] as T[]);
}

export function mergeArrayOfObjects<T extends Object, U extends Object>(
  defaultValues: U = {} as U,
  ...arrays: Array<T | U>[]
) {
  const [array1, ...restArrays] = arrays;

  for (const array of restArrays) {
    if (array.length) {
      Object.keys(array[0]).forEach((key) => {
        if (!(key in defaultValues)) {
          (defaultValues as any)[key] = null;
        }
      });
    }
  }

  return array1?.map((obj, i) => {
    const mergedObject = Object.assign({}, obj, defaultValues) as T & U;

    for (const array of restArrays) {
      Object.assign(mergedObject, array[i] || defaultValues);
    }

    return mergedObject;
  });
}
