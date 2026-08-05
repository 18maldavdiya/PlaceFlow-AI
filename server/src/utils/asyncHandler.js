/**
 * Wraps an async Express handler so a rejected promise is forwarded to
 * `next(error)` automatically — without this, a thrown error inside an
 * `async` controller crashes the process instead of reaching the global
 * error handler. Every controller should be wrapped in this.
 */
export function asyncHandler(handler) {
  return function wrapped(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export default asyncHandler;
