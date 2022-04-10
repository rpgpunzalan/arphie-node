const { getTotals } = require("../services/dashboard.service")

module.exports = {
    getTotalsHandler: async (req, res) => {
        const dashboardTotals = await getTotals();
        res.send(dashboardTotals)
    }
}