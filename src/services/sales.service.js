const getData = require('../utils/getData');
const getSheet = require('../utils/getSheet');
const _ = require('lodash');

module.exports = {
    getSales: async () => {
        const salesRows = await getData('SALESWBALANCE');
        const sales = [];
        const salesInvoiceList = [];
        salesRows.map(item=>{
            sales.push({
                date : item['DATE'],
                invoiceNumber: item['INVOICE NUMBER'],
                customer: item['CUSTOMER'],
                item: item['ITEM'],
                lotNumber: item['LOT NUMBER'],
                expiryDate: item['EXPIRY DATE'],
                qty: item['QTY'],
                srp: item['SRP'],
                amount: ['AMOUNT'],
                agent: item['AGENT'],
                agentName: item['AGENT NAME'],
                cogs: item['COST OF GOODS SOLD'],
                balance: item['BALANCE']
            })
            salesInvoiceList.push(item['INVOICE NUMBER']);
        })
        const grouped = _.mapValues(_.groupBy(sales, 'invoiceNumber'), slist => slist.map(sale=> {
            let sum = +sale.qty * +sale.srp
            return _.omit({...sale, sum}, 'invoiceNumber')
        }))
        const retSales = [];
        _.uniq(salesInvoiceList).map(invoiceNumber=>{
            let totalAmount = 0;
            let salesDate, customer, agent, agentName, balance;
            let itemList = [];
            grouped[invoiceNumber].map(item=>{
                totalAmount += +item.sum;
                salesDate = item.date;
                customer = item.customer;
                agent = item.agent;
                agentName = item.agentName;
                balance = item.balance
                itemList.push({
                    item: item.item, 
                    qty: item.qty,
                    lotNumber: item.lotNumber,
                    expiryDate: item.expiryDate,
                    srp: item.srp,
                })
            })
            retSales.push({date: salesDate, customer, invoiceNumber, totalAmount, itemList, agent, agentName, balance});
        })
        return retSales;
    },

    addSales: async (bulk) => {
        const salesRows = await getSheet('SALES');
        let bulkItems = [];
        bulk.map(({date, invoiceNumber, customer, item, agent, agentName, lotNumber, expiryDate, qty, srp})=>{
            bulkItems.push({
                DATE: date,
                "INVOICE NUMBER": invoiceNumber,
                CUSTOMER: customer.name,
                ITEM: item,
                "LOT NUMBER": lotNumber,
                "EXPIRY DATE": expiryDate,
                QTY: qty,
                SRP: srp,
                AMOUNT: +qty * +srp,
                AGENT: agent.toString(),
                "AGENT NAME": agentName,
            })
        })
        return salesRows.addRows(bulkItems)
        .then(data => {
            return data['INVOICE NUMBER'];
        })
    },

    deleteAndUpdateSale: async ({invoiceNumber}, bulk) => {
        const salesRows = await getSheet('SALES');
        let bulkItems = [];
        bulk.map(({date, invoiceNumber, customer, item, agent, agentName, lotNumber, expiryDate, qty, srp})=>{
            bulkItems.push({
                DATE: date,
                "INVOICE NUMBER": invoiceNumber,
                CUSTOMER: customer.name,
                ITEM: item,
                "LOT NUMBER": lotNumber,
                "EXPIRY DATE": expiryDate,
                QTY: qty,
                SRP: srp,
                AMOUNT: +qty * +srp,
                AGENT: agent.toString(),
                "AGENT NAME": agentName,
            })
        })
        const rows = await salesRows.getRows();
        _.remove(rows, {'INVOICE NUMBER': invoiceNumber})
        console.log(rows)
        const headerValues = salesRows.headerValues;
        return salesRows.clear().then(()=>{
            return salesRows.setHeaderRow(headerValues)
            .then(()=>{
                return salesRows.addRows(rows)
                .then(()=>{
                    return salesRows.addRows(bulkItems)
                    .then(() => {
                        return bulkItems;
                    })
                })
            })
        });

        
    }
}