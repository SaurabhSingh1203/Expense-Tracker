import mongoose from "mongoose";

const insightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    content: {
      type: String,
      required: true
    },
    summarySnapshot: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

export default mongoose.model("Insight", insightSchema);
