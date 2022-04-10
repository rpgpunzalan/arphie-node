const { getPurchases, addPurchase, bulkAddPurchases, getPurchase, deletePurchase, deleteAndUpdatePurchase } = require("../services/purchase.service");


module.exports = {
    getPurchasesHandler: async (req, res) => {
        const purchases = await getPurchases();
        res.send({purchases})
    },
    addPurchaseHandler: async (req, res) => {
        const purchase = await addPurchase(req.body);
        res.send(purchase)
    },
    bulkAddPurchaseHandler: async (req, res) => {
        const purchase = await bulkAddPurchases(req.body);
        res.send(purchase)
    },
    getPurchaseHandler: async (req, res) => {
        const purchase = await getPurchase(req.params);
        res.send(purchase)
    },
    deletePurchaseHandler: async (req, res) => {
        const purchase = await deletePurchase(req.params);
        res.send(purchase);
    },
    deleteAndUpdatePurchaseHandler: async (req, res) => {
        const purchase = await deleteAndUpdatePurchase(req.body, req.params);
        res.send(purchase);
    }
}