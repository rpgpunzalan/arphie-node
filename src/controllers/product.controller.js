const { getInventory, addProduct, stockViewer } = require("../services/product.service")

module.exports = {
    getInventoryHandler: async (req, res) => {
        const inventory = await getInventory();
        res.send({inventory})
    },
    addProductHandler: async (req, res) => {
        const product = await addProduct(req.body);
        res.send(product)
    },
    stockViewerHandler: async (req, res) => {
        console.log(req.body)
        const stockViewerRet = await stockViewer(req.body);
        res.send(stockViewerRet)
    }
}