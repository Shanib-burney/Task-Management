// import { Request } from "express";

// declare global {
//   interface TypedRequest<TBody = any, TQuery = any, TParams = any> extends Request {
//     body: TBody;
//     query: TQuery;
//     params: TParams;
//   }
// }

// export {};

// This empty export is necessary to make this a module


declare global {
  namespace Express {
    export interface Request {
      requestId: string;
      // You can add other things here later, like:
      // user?: { id: string; role: string };
    }
  }
}
export {}; 