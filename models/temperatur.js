const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  temperature: {
    type: String,
    required: true,
  },
  humidity: {
    type: String,
    required: true
  },
}, { timestamps: true });

const temp = mongoose.model('temp', tempSchema);
module.exports = temp;