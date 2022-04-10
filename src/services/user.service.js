const getData = require('../utils/getData');
const searchValByKey = require('../utils/searchValByKey');

module.exports = {
    validatePassword: async ({email, password}) => {
        const userRows = await getData('USERS');
        const users = [];
        userRows.map((user) => {
            users.push({
                id: user.ID,
                email: user.EMAIL,
                password: user.PASSWORD,
                name: user.NAME,
                accessLevel: +user['ACCESS LEVEL']
            })
        })
        const user = searchValByKey(users, 'email', email)[0];
        if(!user) {
            return false;
        }
        if (user.password != password) {
            return false;
        }
        return user;
    },

    getAgents: ( async () => {
        const agentRows = await getData('AGENTS');
        const agents = [];
        agentRows.map(item=>{
            agents.push({
                email: item['EMAIL'],
                name: item['NAME'],
            })
        })
        return agents;
    }),

    addUser: (async ({email, password, name, accessLevel}) => {
        const userRows = await getSheet('USERS');
        return userRows.addRow({EMAIL: email, PASSWORD: password, NAME: name, "ACCESS LEVEL": accessLevel})
        .then((data) => {
            return true
        })
        .catch((e) => {
            return false
        })
    })
}