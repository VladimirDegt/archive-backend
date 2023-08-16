const { Schema, model } = require("mongoose");
const handleMongooseError = require("../utils/handleMongooseError");

const fileSchema = new Schema({
  name: {
    type:String,
    // required: true,
  },
  file: {
    type:String,
    // required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
},
{ versionKey: false, timestamps: true }
);

fileSchema.post("save", handleMongooseError);

const File = model("file", fileSchema);

module.exports = File;