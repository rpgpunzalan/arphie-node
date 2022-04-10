const { getCustomerSummaryHandler, getCustomersHandler } = require('./controllers/customer.controller');
const { getTotalsHandler } = require('./controllers/dashboard.controller');
const { getExpenseHandler, addExpenseHandler, getCategoriesHandler, deleteExpenseHandler, getExpensesHandler } = require('./controllers/expense.controller');
const { addPaymentHandler } = require('./controllers/payment.controller');
const { getInventoryHandler, addProductHandler, stockViewerHandler } = require('./controllers/product.controller');
const { getPurchasesHandler, bulkAddPurchaseHandler, getPurchaseHandler, deletePurchaseHandler, deleteAndUpdatePurchaseHandler } = require('./controllers/purchase.controller');
const { getSalesHandler, getSalesAgentsHandler, addSalesHandler, deleteAndUpdateSaleHandler } = require('./controllers/sales.controller');
const {createSessionHandler} = require('./controllers/session.controller');
const { getSuppliersHandler, addSupplierHandler, getSupplierSummaryHandler } = require('./controllers/supplier.service');
const { addVoucherHandler, getVouchersHandler, addVoucherDecisionHandler } = require('./controllers/voucher.controller');

module.exports = (app) => {

    app.get('/', (req, res) => {
        res.send("Welcome to Arphie API");
    })
    
    app.get('/api/healthcheck', (req, res) => {
        res.send('Ok version 1')
    })

    app.post('/api/sessions', createSessionHandler);

    // Inventory
    app.get('/api/inventory', getInventoryHandler)
    app.post('/api/inventory', addProductHandler)
    app.post('/api/stock-viewer/', stockViewerHandler)

    // Suppliers
    app.get('/api/suppliers', getSuppliersHandler);
    app.get('/api/suppliers/summary/', getSupplierSummaryHandler);
    app.post('/api/suppliers', addSupplierHandler);

    // Purchases
    app.get('/api/purchases', getPurchasesHandler);
    app.post('/api/purchases-bulk', bulkAddPurchaseHandler);
    app.get('/api/purchases/:poNumber', getPurchaseHandler);
    app.delete('/api/purchases/:poNumber', deletePurchaseHandler);
    app.put('/api/purchases/:poNumber', deleteAndUpdatePurchaseHandler);

    //Vouchers
    app.post('/api/vouchers', addVoucherHandler);
    app.get('/api/vouchers', getVouchersHandler)
    app.post('/api/vouchers/decision/', addVoucherDecisionHandler);


    // Sales
    app.get('/api/sales', getSalesHandler);
    app.post('/api/sales', addSalesHandler);
    app.put('/api/sales/:invoiceNumber', deleteAndUpdateSaleHandler)
    app.get('/api/agents', getSalesAgentsHandler);

    // Customers
    app.get('/api/customers', getCustomersHandler);
    app.get('/api/customers/summary', getCustomerSummaryHandler);

    // Customer Payments
    app.post('/api/payments', addPaymentHandler);


    // Expenses
    app.get('/api/expenses', getExpensesHandler);
    app.get('/api/expenses/:expenseNo', getExpenseHandler);
    app.post('/api/expenses', addExpenseHandler)
    app.get('/api/expense-categories', getCategoriesHandler)
    app.delete('/api/expenses/:expenseNo', deleteExpenseHandler)


    app.get('/api/dashboard-totals', getTotalsHandler);
};
