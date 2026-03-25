import { multiply, subtract } from "precise-math";
import z from "zod";

export const enumSchema = <T extends Record<string, string | number>>(enumObj: T) => {
  const keys = Object.keys(enumObj).filter(
    (k) => isNaN(Number(k))
  ) as [keyof T & string, ...(keyof T & string)[]];

  return z.enum(keys).transform((val) => enumObj[val] as number);
};

export const idSchema = z.object({ id: z.coerce.number().int().positive() });

export const pagingSchema = z.object({
  page: z.coerce.number().int().optional(),
  size: z.coerce.number().int().optional(),
  paging: z.preprocess((val) => {
    if (typeof val === "string") {
      const v = val.toLowerCase();
      if (["true", "1", "yes"].includes(v)) return true;
      if (["false", "0", "no"].includes(v)) return false;
    }
    return val;
  }, z.boolean().optional())
});

export type pagingDTO = z.infer<typeof pagingSchema>;
export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
}


export function getTakeSkip(model?: pagingDTO): { take: number; skip: number } | undefined {

  console.log("before", model?.paging)

  if (model?.paging) {
    model.paging = Boolean(model.paging);
  }

  console.log("after", model?.paging)
  if (model && (Boolean(model?.paging) ?? true)) {
    const { page, size } = model

    const realPage = subtract(page ? page : 1, 1)
    const take = Number(size ? size : 10)
    const skip = multiply(take, realPage)

    return { take, skip }
  }


}