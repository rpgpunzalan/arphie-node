const getData = require('../utils/getData');
const getSheet = require('../utils/getSheet');
const _ = require('lodash');

module.exports = {
    getSuppliers: async () => {
        const supplierRows = await getData('SUPPLIERS');
        const suppliers = [];
        supplierRows.map(item=>{
            suppliers.push({
                name: item['NAME'],
                address: item['ADDRESS'],
                contactNumber: item['CONTACT NUMBER']
            })
        })
        return suppliers;
    },

    addSupplier: async ({name, address, contactNumber}) => {
        const supplierRows = await getSheet('SUPPLIERS');
        return supplierRows.addRow({NAME: name.toUpperCase(), ADDRESS: address.toUpperCase(), "CONTACT NUMBER": contactNumber})
        .then((data) => {
            return true
        })
        .catch((e) => {
            return false
        })
    },

    getSupplierSummary: async () => {
        const supplierSummaryRows = await getData('SUPPLIERSUMMARY');
        const supplierSummary = [];
        let totalPayables = 0;
        supplierSummaryRows.map(item=>{
            supplierSummary.push({
                supplier: item.NAME,
                purchases: +item.PURCHASES,
                payments: +item.PAYMENTS,
                payables: +item.PAYABLES,
                color: item.COLOR
            })
            totalPayables += +item.PAYABLES
        })
        _.remove(supplierSummary, {purchases: 0});
        return {supplierSummary, totalPayables};
    }
}