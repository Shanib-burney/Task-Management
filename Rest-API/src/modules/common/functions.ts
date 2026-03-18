import { ZodObject } from "zod";

export const validate = (schema: ZodObject<any>) => (req: any, res: any, next: any) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ error: result.error });
  }
  req.body = result.data;
  next();
};
