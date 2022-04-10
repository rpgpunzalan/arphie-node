const getData = require('../utils/getData');
const getSheet = require('../utils/getSheet');
const _ = require('lodash')

module.exports = {
    getExpense: async({expenseNo}) => {
        const expenseRows = await getData('EXPENSES');
        let retExp = {}
        expenseRows.map(item=>{
            if (item['EXPENSE NO'] == expenseNo) {
                retExp =  {
                    date: item['DATE'],
                    expenseNo: item['EXPENSE NO'],
                    biller: item['BILLER'],
                    particulars: item['PARTICULARS'],
                    amount: item['AMOUNT'],
                    category: item.CATEGORY,
                    agent: item.AGENT,
                    agentName: item['AGENT NAME'],
                }
            }
        })
        return retExp;
    },
    getExpenses: async () => {
        const expenseRows = await getData('EXPENSEWBALANCE');
        const expenses = [];
        expenseRows.map(item=>{
            expenses.push({
                date: item.DATE,
                expenseNo: item['EXPENSE NO'],
                biller: item.BILLER,
                particulars: item.PARTICULARS,
                amount: item.AMOUNT,
                category: item.CATEGORY,
                agent: item.AGENT,
                agentName: item['AGENT NAME'],
                balance: item['BALANCE']
            })
        })
        return expenses;
    },

    addExpense: async ({date, biller, particulars, amount, category, agent, agentName}) => {
        const expenseRows = await getSheet('EXPENSES');
        return expenseRows.addRow({DATE: date, "EXPENSE NO": +expenseRows.rowCount+1, BILLER: biller.toUpperCase(), PARTICULARS: particulars.toUpperCase(), AMOUNT: amount, CATEGORY: category.name, AGENT: agent, "AGENT NAME": agentName})
        .then((data) => {
            return true
        })
        .catch((e) => {
            return false
        })
    },

    getCategories: async () => {
        const categoryRows = await getData('EXPENSECATEGORIES');
        const categories = [];
        categoryRows.map(item=>{
            categories.push({
                name: item.CATEGORY,
                color: item.COLOR
            })
        })
        return categories;
    },

    deleteExpense: async ({expenseNo}) => {
        const expenseRows = await getSheet('EXPENSES');

        return (await expenseRows.getRows()).map(data => {
            if(data['EXPENSE NO'] == expenseNo){
                data.delete().then(()=>{return true}).catch(()=> {return false})
            }
        })

    }
}