import { ApiError } from "../utils/ApiError.js";

/**
 * Role gate — always mounted after `protect`, which is what populates
 * `req.user`. Usage: `router.get("/x", protect, authorize("tpo", "admin"), handler)`.
 */
export function authorize(...allowedRoles) {
  return function roleCheck(req, res, next) {
    if (!req.user) {
      return next(ApiError.unauthorized("You must be logged in to do that."));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden("You don't have permission to do that."),
      );
    }
    return next();
  };
}

export default authorize;
