const userController = {}

userController.addUser = (req,res) => { //Lo que requiere y lo que responde
    const edad = req.body.edad
    res.json(edad)
}

module.exports = userController