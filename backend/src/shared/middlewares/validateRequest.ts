import type { NextFunction, Request, Response } from "express";
import { type AnyZodObject, ZodError } from "zod";
import { sendError } from "../utils/apiResponse.js";

export function validateRequest(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query;
      if (parsed.params !== undefined) req.params = parsed.params;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues.map((issue) => ({
          field: issue.path.slice(1).join(".") || issue.path.join("."),
          location: issue.path[0] as string | undefined,
          message: issue.message
        }));
        sendError(res, "Validasi input gagal", 422, issues);
        return;
      }
      next(err);
    }
  };
}

