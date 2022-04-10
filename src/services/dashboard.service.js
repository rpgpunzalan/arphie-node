const getData = require('../utils/getData');
const _ = require('lodash');

module.exports = {
    getTotals: async () => {
        const dashboardRows = await getData('DASHBOARD');
        const dashboard = [];
        dashboardRows.map(item=>{
            dashboard.push({
                totalSales: item['TOTALSALES'],
                totalCogs: item['TOTALCOGS'],
                totalOrders: item['TOTALORDERS'],
                averageOrder: item['AVERAGEORDER']
            })
        })
        return dashboard[0];
    },

    getDashboardGraph: async () => {
        const dashboardRows = await getData('DASHBOARDGRAPH');
        const dashboard = [];
        dashboardRows.map(item=>{
            dashboard.push({
                sales: item['SALES'],
                purchases: item['PURCHASES'],
                expenses: item['EXPENSES'],
            })
        })
        return dashboard;
    }
}