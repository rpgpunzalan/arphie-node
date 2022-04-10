const { getSuppliers, addSupplier, getSupplierSummary } = require("../services/supplier.service");


module.exports = {
    getSuppliersHandler: async (req, res) => {
        const suppliers = await getSuppliers();
        res.send({suppliers})
    },
    addSupplierHandler: async (req, res) => {
        const supplier = await addSupplier(req.body);
        res.send(supplier)
    },
    getSupplierSummaryHandler: async (req, res) => {
        const supplierSummary = await getSupplierSummary();
        res.send({supplierSummary})
    }
}