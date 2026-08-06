import bcrypt from "bcryptjs";
import mongoose from "mongoose";

/**
 * The four roles this authentication foundation supports. Kept here (not a
 * shared roles constant yet) since this is the only model that references
 * them so far — promote to a shared `constants/roles.js` if a second model
 * needs the same enum.
 */
export const USER_ROLES = Object.freeze([
  "student",
  "recruiter",
  "tpo",
  "admin",
]);

/**
 * The subset of USER_ROLES the *public* /auth/register endpoint accepts.
 * Admin and TPO stay in USER_ROLES — the schema, login, and every other
 * flow still fully support them — but those accounts are only ever created
 * by an authenticated admin panel (not built yet), never by public
 * self-registration. Enforced in validators/auth.validator.js.
 */
export const PUBLIC_REGISTRATION_ROLES = Object.freeze(["student", "recruiter"]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: USER_ROLES,
        message: "Role must be one of: student, recruiter, tpo, admin",
      },
      required: [true, "Role is required"],
      default: "student",
    },
    college: {
      type: String,
      trim: true,
      maxlength: [150, "College name cannot exceed 150 characters"],
      default: "",
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, "Enter a valid phone number"],
      default: "",
    },
    profileImage: {
      type: String,
      trim: true,
      default: "",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    // Hash of the most recently issued refresh token, so logout / password
    // reset can invalidate it without maintaining a separate token store.
    refreshTokenHash: {
      type: String,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

/**
 * Soft-delete scoping. Every find-style query excludes deleted users by
 * default; pass `.setOptions({ includeDeleted: true })` on a query to see
 * them (used by the duplicate-email check during registration, which must
 * consider soft-deleted accounts too). Single model for now, so this lives
 * inline — extract to a shared `plugins/softDelete.js` once a second model
 * needs the same behavior.
 */
function excludeSoftDeleted() {
  if (this.getOptions().includeDeleted) return;
  this.where({ isDeleted: { $ne: true } });
}
userSchema.pre(/^find/, excludeSoftDeleted);
userSchema.pre("countDocuments", excludeSoftDeleted);

userSchema.methods.softDelete = async function softDelete(deletedById = null) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedById;
  await this.save({ validateBeforeSave: false });
};

// Hash the password whenever it's set or changed — never on every save.
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

/**
 * Shape returned to clients — strips every sensitive/internal field
 * regardless of what was selected on the query it came from. Controllers
 * should send `user.toSafeJSON()`, never the raw document.
 */
userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    fullName: this.fullName,
    email: this.email,
    role: this.role,
    college: this.college,
    phoneNumber: this.phoneNumber,
    profileImage: this.profileImage,
    emailVerified: this.emailVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const User = mongoose.model("User", userSchema);
export default User;
