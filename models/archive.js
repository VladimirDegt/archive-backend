const { Schema, model } = require("mongoose");
const handleMongooseError = require("../utils/handleMongooseError");

const archiveSchema = new Schema(
  {
    idDocument: {
      type: String,
    },
    dateCreate: {
      type: String,
    },
    nameDocument: {
      type: String,
    },
    typeDocument: {
      type: String,
    },
    numberDocument: {
      type: String,
    },
    emailCustomer: {
      type: String,
    },
    nameCustomer: {
      type: String,
    },
    codeCustomer: {
      type: Schema.Types.Mixed,
    },
    fileURLPDF: {
      type: String,
    },
    fileURLZIP: {
      type: String,
    },
    numberDogovir: {
      type: Number,
    },
    contractStartDate: {
      type: Schema.Types.Mixed,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

archiveSchema.post("save", handleMongooseError);

const Archive = model("archive", archiveSchema);

module.exports = Archive;
