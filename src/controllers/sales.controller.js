const res = require("express/lib/response");
const { getSales, addSales, deleteAndUpdateSale } = require("../services/sales.service");
const { getAgents } = require("../services/user.service");


module.exports = {
    getSalesHandler: async (req, res) => {
        const sales = await getSales();
        res.send({sales})
    },

    getSalesAgentsHandler: async(req, res) => {
        const agents = await getAgents();
        res.send({agents});
    },

    addSalesHandler: async (req, res) =>{
        const sales = await addSales(req.body);
        res.send(sales)
    },

    deleteAndUpdateSaleHandler: async (req, res) => {
        const sales = await deleteAndUpdateSale(req.params, req.body)
        res.send(sales);
    }
}
