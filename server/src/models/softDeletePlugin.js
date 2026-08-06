import mongoose from "mongoose";

/**
 * Shared soft-delete behavior for every dashboard-foundation model (Job,
 * Application, StudentProfile, Notification). Extracted here once a second
 * model needed the pattern already inlined in `user.model.js` — that file
 * is part of the locked Authentication module and is left untouched, but
 * every new model applies this plugin instead of repeating it.
 *
 * Usage: `schema.plugin(applySoftDelete);` before compiling the model.
 */
export function applySoftDelete(schema) {
  schema.add({
    isDeleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, default: null, select: false },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      select: false,
    },
  });

  function excludeSoftDeleted() {
    if (this.getOptions().includeDeleted) return;
    this.where({ isDeleted: { $ne: true } });
  }
  schema.pre(/^find/, excludeSoftDeleted);
  schema.pre("countDocuments", excludeSoftDeleted);

  schema.methods.softDelete = async function softDelete(deletedById = null) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedById;
    await this.save({ validateBeforeSave: false });
  };
}

export default applySoftDelete;
