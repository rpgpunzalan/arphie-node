const { addPayment } = require("../services/payment.service")


module.exports = {
    addPaymentHandler: async (req, res) => {
        const payment = addPayment(req.body);
        res.send(payment)
    }
}