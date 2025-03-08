async submitInvoice() {
      try {
        // Prepare the invoice data
        const invoiceData = {
          companyDetails: this.companyDetails,
          invoiceToDetails: {
            ...this.invoiceToDetails,
            date: new Date(this.invoiceToDetails.date)
          },
          transactionDetails: this.transactionDetails,
          total: this.invoiceTotal,
          generatedBy: 'User' // Explicitly set who generated this invoice
        }
        
        // Create the invoice
        const result = await this.createInvoice(invoiceData)
        
        if (result) {
          // Show success message
          alert('Invoice created successfully!')
          
          // Reset the form
          this.resetForm()
          
          // Redirect to invoice list
          this.$router.push('/invoices')
        }
      } catch (error) {
        console.error('Failed to submit invoice:', error)
        alert('Failed to create invoice: ' + (error.message || 'Unknown error'))
      }
    },