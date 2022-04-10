const { addVoucher, getVouchers, addVoucherDecision } = require("../services/voucher.service");


module.exports = {
    addVoucherHandler: async (req, res) => {
        const voucher = await addVoucher(req.body);
        res.send(voucher)
    },

    getVouchersHandler: async (req, res) => {
        const vouchers = await getVouchers();
        res.send(vouchers)
    },

    addVoucherDecisionHandler: async (req, res) => {
        const voucher = await addVoucherDecision(req.body);
        res.send(voucher);
    }
}