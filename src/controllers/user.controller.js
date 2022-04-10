const { addUser } = require("../services/user.service");


module.exports = {
    addUserHandler: async (req, res) => {
        console.log(req.body)
        const user = await addUser(req.body);
        res.send(user)
    },
}