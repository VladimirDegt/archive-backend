const { Schema, model } = require("mongoose");
const handleMongooseError = require("../utils/handleMongooseError");

const fileSchema = new Schema(
  {
    nameCustomer: {
      type: String,
      // required: true,
    },
    numberDocument: {
      type: String,
      // required: true,
    },
    typeDocument: {
      type: String,
      // required: true,
    },
    acts: [
      {
        typeDocument: String,
        nameMonth: String,
        fileURLPDF: String,
        fileURLZIP: String,
      },
    ],
    fileURLPDF: {
      type: String,
      // required: true,
    },
    fileURLZIP: {
      type: String,
      // required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

fileSchema.post("save", handleMongooseError);

const File = model("file", fileSchema);

module.exports = File;
