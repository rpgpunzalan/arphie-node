const { getCustomerSummary, getCustomers } = require("../services/customer.service");

module.exports = {
    getCustomersHandler: async (req, res) => {
        const customers = await getCustomers();
        res.send({customers});
    },
    getCustomerSummaryHandler: async (req, res) => {
        const customerSummary = await getCustomerSummary();
        res.send({customerSummary})
    }
}