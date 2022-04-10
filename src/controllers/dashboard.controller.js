const { getTotals, getDashboardGraph } = require("../services/dashboard.service")

module.exports = {
    getTotalsHandler: async (req, res) => {
        const dashboardTotals = await getTotals();
        res.send(dashboardTotals)
    },

    getDashboardGraphHandler: async (req, res) => {
        const dashboardGraph = await  getDashboardGraph();
        res.send(dashboardGraph);
    }
}