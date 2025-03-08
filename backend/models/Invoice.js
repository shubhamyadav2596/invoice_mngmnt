import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true
  },
  companyDetails: {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    gstin: { type: String },
    address: { type: String, required: true }
  },
  invoiceToDetails: {
    date: { type: Date, required: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true }
  },
  transactionDetails: [{
    product: { type: String, required: true },
    rate: { type: Number, required: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  generatedBy: { type: String, enum: ['User', 'Panel'], default: 'User' },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate invoice number before saving
invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    try {
      // Get count of documents to generate sequential number
      const count = await mongoose.model('Invoice').countDocuments();
      // Format: INV-YYMMDD-COUNT
      const date = new Date();
      const year = date.getFullYear().toString().substr(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      this.invoiceNumber = `INV-${year}${month}${day}-${count + 1}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;