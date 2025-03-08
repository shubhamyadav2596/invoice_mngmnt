import express from 'express';
import Invoice from '../models/Invoice.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all invoices for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching invoices for user:', req.user.id);
    
    const invoices = await Invoice.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${invoices.length} invoices`);
    
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Server error while fetching invoices' });
  }
});

// Get a specific invoice
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Server error while fetching invoice' });
  }
});

// Create a new invoice
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Creating invoice with data:', JSON.stringify(req.body, null, 2));
    
    const { companyDetails, invoiceToDetails, transactionDetails, total, generatedBy } = req.body;
    
    // Validate required fields
    if (!companyDetails || !invoiceToDetails || !transactionDetails || !Array.isArray(transactionDetails)) {
      return res.status(400).json({ message: 'Missing required invoice data' });
    }
    
    // Create new invoice document
    const invoice = new Invoice({
      companyDetails,
      invoiceToDetails: {
        ...invoiceToDetails,
        date: new Date(invoiceToDetails.date)
      },
      transactionDetails,
      total: total || transactionDetails.reduce((sum, item) => sum + (item.total || 0), 0),
      generatedBy: generatedBy || 'User',
      createdBy: req.user.id
    });
    
    console.log('Saving invoice:', invoice);
    
    // Save to database
    const savedInvoice = await invoice.save();
    console.log('Invoice saved successfully with ID:', savedInvoice._id);
    
    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    
    // Provide more detailed error information
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while creating invoice',
      error: error.message
    });
  }
});

// Update an invoice
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { companyDetails, invoiceToDetails, transactionDetails, total } = req.body;
    
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      {
        companyDetails,
        invoiceToDetails: {
          ...invoiceToDetails,
          date: new Date(invoiceToDetails.date)
        },
        transactionDetails,
        total
      },
      { new: true }
    );
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ message: 'Server error while updating invoice' });
  }
});

// Delete an invoice
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: 'Server error while deleting invoice' });
  }
});

export default router;