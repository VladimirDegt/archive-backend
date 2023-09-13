const { Schema, model } = require("mongoose");
const handleMongooseError = require("../utils/handleMongooseError");

const multiDataStore  = new Schema(
  {
    customer: {
      type: [String],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

multiDataStore.post("save", handleMongooseError);

const MultiDataStore = model("multiDataStore", multiDataStore);

module.exports = MultiDataStore;
