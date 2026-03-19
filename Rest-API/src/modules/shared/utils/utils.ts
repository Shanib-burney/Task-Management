import z from "zod";

export const enumSchema = <T extends Record<string, string | number>>(enumObj: T) => {
  const keys = Object.keys(enumObj).filter(
    (k) => isNaN(Number(k))
  ) as [keyof T & string, ...(keyof T & string)[]];

  return z.enum(keys).transform((val) => enumObj[val] as number);
};