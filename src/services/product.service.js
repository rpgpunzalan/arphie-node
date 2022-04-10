const getData = require('../utils/getData');
const getSheet = require('../utils/getSheet');
const _ = require('lodash')

module.exports = {
    getInventory: async () => {
        const inventoryRows = await getData('INVENTORY');
        const inventory = [];
        inventoryRows.map(item=>{
            inventory.push({
                item: item.ITEM,
                initialQty: item['INITIAL QTY'],
                initialCost: item['INITIAL COST'],
                qty: item['QTY'] ? parseInt(item['QTY'].replace(/,/g, '')) : 0,
                cost: item['COST'] ? parseFloat(item['COST'].replace(/,/g, '')) : 0,
                amount: (item['QTY'] && item['COST']) ? parseInt(item['QTY'].replace(/,/g, ''))* parseFloat(item['COST'].replace(/,/g, '')) : 0
            })
        })
        return inventory;
    },

    addProduct: async ({itemName, initialQty, initialCost}) => {
        const productsRows = await getSheet('PRODUCTS');
        return productsRows.addRow({ITEM: itemName.toUpperCase(), "INITIAL QTY": initialQty, "INITIAL COST": initialCost})
        .then((data) => {
            return true
        })
        .catch((e) => {
            return false
        })
    },

    stockViewer: async ({itemName, initialQty = 0}) => {
        // const stockViewerRows = await getSheet('STOCKVIEWERSELECTOR');
        const stockViewerData = await getData('CONSOLIDATED');
        const stockFlow = [];
        
        const filteredData = _.filter(stockViewerData, {ITEM: itemName});
        filteredData.map((data)=> {
            stockFlow.push({
                date: data.DATE,
                reference: data.REFERENCE,
                item: data.ITEM,
                entity: data.ENTITY,
                qty: data.QTY,
            })
        })
        // const grouped = _.mapValues(_.groupBy(stockFlow, 'date'), plist => plist.map(flow=> {
        //     return {...flow}
        // }))
        const stockFlowRet = [];
        let runningBalance = +initialQty;
        stockFlow.map(({date, reference, qty}) => {
            stockFlowRet.push({
                date,
                reference,
                in: qty > 0 ? qty : '-',
                out: qty < 0 ? qty*-1 : '-',
                balance: runningBalance += +qty
            })
        })
        return stockFlowRet

        
    }
}