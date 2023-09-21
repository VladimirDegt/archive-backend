// const { Schema, model } = require("mongoose");
// const handleMongooseError = require("../utils/handleMongooseError");

// const fileSchema = new Schema(
//   {
//     nameCustomer: {
//       type: String,
//     },
//     numberDocument: {
//       type: Number,
//     },
//     typeDocument: {
//       type: String,
//     },
//     acts: [
//       {
//         typeDocument: String,
//         nameMonth: String,
//         fileURLPDF: String,
//         fileURLZIP: String,
//         numberAct: String,
//         price: String,
//         date: String,
//         month: String,
//       },
//     ],
//     fileURLPDF: {
//       type: String,
//     },
//     fileURLZIP: {
//       type: String,
//     },
//     owner: {
//       type: Schema.Types.ObjectId,
//       ref: "user",
//     },
//   },
//   { versionKey: false, timestamps: true }
// );

// fileSchema.post("save", handleMongooseError);

// const File = model("file", fileSchema);

// module.exports = File;
