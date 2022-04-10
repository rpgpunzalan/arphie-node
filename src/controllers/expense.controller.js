const { getExpenses, addExpense, getCategories, deleteExpense, getExpense } = require("../services/expense.service");

module.exports = {
    getExpensesHandler: async (req, res) => {
        const expenses = await getExpenses();
        res.send({expenses})
    },
    getExpenseHandler: async (req, res) => {
        const expense = await getExpense(req.params);
        res.send(expense)
    },
    addExpenseHandler: async (req, res) => {
        const expense = await addExpense(req.body);
        res.send(expense)
    },
    getCategoriesHandler: async (req, res)=> {
        const categories = await getCategories();
        res.send({categories})
    },
    deleteExpenseHandler: async (req, res) => {
        const expense = await deleteExpense(req.params)
        res.send(expense)
    }
}