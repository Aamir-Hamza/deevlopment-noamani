import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentInfo: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      status: String,
      method: String,
      email: String,
      contact: String,
      cardNetwork: String,
      cardLast4: String,
      cardIssuer: String,
      amountRefunded: {
        type: Number,
        default: 0
      },
      refundStatus: {
        type: String,
        enum: ['none', 'partial', 'full'],
        default: 'none'
      },
      transactionTime: {
        type: Date,
        default: Date.now
      },
      currency: {
        type: String,
        default: 'INR'
      }
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema); 