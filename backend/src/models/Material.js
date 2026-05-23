const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a material title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: [
      'SSC',
      'UPSC',
      'Programming',
      'Government Jobs',
      'Spoken English',
      'NEET/JEE',
    ],
  },
  type: {
    type: String,
    required: [true, 'Please specify the material type'],
    enum: ['pdf', 'video', 'zip'],
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide the file URL'],
  },
  filePublicId: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
  },
  thumbnailPublicId: {
    type: String,
  },
  accessType: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Material', materialSchema);
