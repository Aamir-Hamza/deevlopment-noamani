import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageHover: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    olfactoryNotes: {
      type: String,
      default: '',
    },
    perfumersWord: {
      type: String,
      default: '',
    },
    knowHow: {
      type: String,
      default: '',
    },
    applicationTips: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    assignedPages: {
      type: [String],
      default: [],
    },
    galleryImages: {
      type: [String],
      default: [],
      validate: [(arr: any[]) => arr.length <= 4, 'Maximum 4 gallery images allowed']
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema); 