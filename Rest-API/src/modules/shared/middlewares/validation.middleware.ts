import { RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";
import { UnprocessableEntityException } from "../utils/exceptions";

interface ValidateSchemas {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
}

export const validate = (schemas: ValidateSchemas): RequestHandler =>
  async (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }

      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }

      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return next(
          new UnprocessableEntityException(
            "Validation Failed",
            formattedErrors
          )
        );
      }

      return next(error);
    }
  };