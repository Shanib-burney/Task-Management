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
    const errors: Array<{ location: string; field: string; message: string }> = [];

    if (schemas.body) {
      try {
        req.body = await schemas.body.parseAsync(req.body);
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          errors.push(
            ...error.issues.map((err) => ({
              location: "body",
              field: err.path.join("."),
              message: err.message,
            }))
          );
        } else {
          return next(error);
        }
      }
    }
    if (schemas.query) {
      try {
        res.locals.validatedQuery = await schemas.query.parseAsync(req.query);
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          errors.push(
            ...error.issues.map((err) => ({
              location: "query",
              field: err.path.join("."),
              message: err.message,
            }))
          );
        } else {
          return next(error);
        }
      }
    }

    if (schemas.params) {
      try {
        req.params = await schemas.params.parseAsync(req.params);
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          errors.push(
            ...error.issues.map((err) => ({
              location: "params",
              field: err.path.join("."),
              message: err.message,
            }))
          );
        } else {
          return next(error);
        }
      }
    }

    if (errors.length > 0) {
      return next(
        new UnprocessableEntityException("Validation Failed", errors)
      );
    }

    next();
  };