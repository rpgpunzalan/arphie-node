const moment = require('moment');
const getData = require('../utils/getData');
const getSheet = require('../utils/getSheet');
const _ = require('lodash');


const getNextPoIndex = async () => {
    const purchaseRows = await getData('PURCHASES');
    poIndexes = [];
    purchaseRows.map(item=>{
        poIndexes.push(item['POINDEX']);
    })
    return (+_.max(_.uniq(poIndexes)))+1;
}

module.exports = {

    getPurchase: async({poNumber}) => {
        console.log(poNumber)
        const purchaseRows = await getData('PURCHASES');
        const purchases = [];
        const poNumberList = [];
        purchaseRows.map(item=>{
            purchases.push({
                date: item['DATE'],
                poNumber: item['PO NUMBER'],
                supplier: item['SUPPLIER'],
                item: item['ITEM'],
                qty: item['QTY'],
                cost: item['COST']
            })
            poNumberList.push(item['PO NUMBER']);
        })


        const grouped = _.mapValues(_.groupBy(purchases, 'poNumber'), plist => plist.map(purchase=> {
            let sum = +purchase.qty * +purchase.cost
            return {...purchase, sum}
        }))

        return grouped[poNumber];
    },
    getPurchases: async () => {
        const purchaseRows = await getData('PURCHASESWBALANCE');
        const purchases = [];
        const poNumberList = [];
        purchaseRows.map(item=>{
            purchases.push({
                date: item['DATE'],
                poNumber: item['PO NUMBER'],
                supplier: item['SUPPLIER'],
                item: item['ITEM'],
                qty: item['QTY'],
                cost: item['COST'],
                poIndex: item['POINDEX'],
                balance: item['BALANCE']
            })
            poNumberList.push(item['PO NUMBER']);
        })


        const grouped = _.mapValues(_.groupBy(purchases, 'poNumber'), plist => plist.map(purchase=> {
            let sum = +purchase.qty * +purchase.cost
            return _.omit({...purchase, sum}, 'poNumber')
        }))
        const retPurchases = [];
        _.uniq(poNumberList).map(poNumber=>{
            let totalAmount = 0;
            let poDate, poSupplier, poIndex, balance;
            let itemList = [];
            grouped[poNumber].map(item=>{
                totalAmount += +item.sum;
                poDate = item.date,
                poSupplier = item.supplier
                balance = item.balance
                itemList.push({
                    item: item.item, 
                    qty: item.qty,
                    cost: item.cost
                }),
                poIndex= item.poIndex,
                balance = item.balance
            })
            retPurchases.push({date: poDate, supplier: poSupplier, poNumber, totalAmount, itemList, poIndex, balance});
        })
        return retPurchases;
    },

    addPurchase: async ({date, supplier, item, qty, cost}) => {
        const purchaseRows = await getSheet('PURCHASES');
        const rowCount = purchaseRows.rowCount;
        const poNumber = `${moment().format('yyyy')}-${('0000'+(+rowCount+1)).slice(4)}`
        console.log(rowCount, poNumber)
        return purchaseRows.addRow({DATE: date, "PO NUMBER": poNumber, SUPPLIER: supplier.name, ITEM: item, QTY: qty, COST: cost})
        .then((data) => {
            return poNumber
        })
        .catch((e) => {
            return false
        })
    },

    bulkAddPurchases: async (bulk) => {
        const purchaseRows = await getSheet('PURCHASES');
        purchaseData = await getData('PURCHASES');
        let poIndex = 1;
        if(purchaseData.length>0){
            poIndex = await getNextPoIndex();
        }
        let poNumber;
        if(!bulk.poNumber){
            poNumber = `${moment().format('yyyy')}-${('0000'+(+poIndex)).slice(('0000'+(+poIndex)).length-4)}`
        }
        else {
            poNumber = bulk.poNumber;
        }
        let bulkItems = [];
        bulk.map(({date, supplier, item, qty, cost})=>{
            bulkItems.push({
                DATE: date,
                "PO NUMBER": poNumber,
                SUPPLIER: supplier.name,
                ITEM: item,
                QTY: qty,
                COST: cost,
                POINDEX: poIndex
            })
        })
        return purchaseRows.addRows(bulkItems)
            .then((data) => {
                return poNumber
            })
            .catch((e) => {
                console.log(e)
                return false
            })
        
    },

    deletePurchase: async ({poNumber}) => {
        const purchaseRows = await getSheet('PURCHASES');
        purchaseData = await getData('PURCHASES');
        const rows = await purchaseRows.getRows();
        rows.map(row=>{
            console
            if (row["PO NUMBER"]== poNumber) {
                row.delete();
            }
        })
    },

    deleteAndUpdatePurchase: async (bulk, {poNumber}) => {
        const purchaseRows = await getSheet('PURCHASES');
        purchaseData = await getData('PURCHASES');
        let bulkItems = [];
        bulk.map(({date, supplier, item, qty, cost, poIndex})=>{
            bulkItems.push({
                DATE: date,
                "PO NUMBER": poNumber,
                SUPPLIER: supplier.name,
                ITEM: item,
                QTY: qty,
                COST: cost,
                POINDEX: poIndex
            })
        })

        const rows = await purchaseRows.getRows();

        _.remove(rows, {'PO NUMBER': poNumber})
        const headerValues = purchaseRows.headerValues;
        return purchaseRows.clear().then(()=>{
            return purchaseRows.setHeaderRow(headerValues)
            .then(()=>{
                return purchaseRows.addRows(rows)
                .then(()=>{
                    return purchaseRows.addRows(bulkItems)
                    .then(() => {
                        return bulkItems;
                    })
                })
            })
        });
        
    }
}