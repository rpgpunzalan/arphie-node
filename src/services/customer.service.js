const getData = require('../utils/getData');
const getSheet = require('../utils/getSheet');
const _ = require('lodash');

module.exports = {

    getCustomerSummary: async () => {
        const customerSummaryRows = await getData('CUSTOMERSUMMARY');
        const customerSummary = [];
        let totalReceivables = 0;
        customerSummaryRows.map(item=>{
            customerSummary.push({
                customer: item.NAME,
                sales: +item.SALES,
                payments: +item.PAYMENTS,
                receivables: +item.RECEIVABLES,
                color: item.COLOR
            })
            totalReceivables += +item.RECEIVABLES
        })
        _.remove(customerSummary, {sales: 0});
        console.log(customerSummary)
        return {customerSummary, totalReceivables};
    },

    getCustomers: async () => {
        const customerRows = await getData('CUSTOMERS');
        const customers = [];
        customerRows.map(item=>{
            customers.push({
                name: item['NAME'],
                address: item['ADDRESS'],
                contactNumber: item['CONTACT NUMoogBER']
            })
        })
        return _.sortBy(customers, 'name');
    }
}