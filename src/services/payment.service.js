const getData = require('../utils/getData');
const getSheet = require('../utils/getSheet');

module.exports = {
    addPayment: async ({date, invoiceNumber, customer, orNumber, amount}) => {
        const paymentRows = await getSheet('CUSTOMERPAYMENTS');
        return paymentRows.addRow({'PAYMENT DATE': date, 'INVOICE NUMBER': invoiceNumber, CUSTOMER: customer, "OR NUMBER": orNumber, AMOUNT: amount})
        .then((data) => {
            return true
        })
        .catch((e) => {
            return false
        })
    }
}