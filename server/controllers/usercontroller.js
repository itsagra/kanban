const { User } = require('../models/index')
const { compare } = require('../helpers/bcrypt')
const { createToken } = require('../helpers/jwt')

class UserController {
	static async register (req, res, next) {
		try {
			const newUser = req.body
			const createNewUser = await User.create(newUser)
			res.status(201).json({
					id: createNewUser.id,
					email: createNewUser.email
			})
		} catch (error) {
			const err = []
			error.errors.forEach(element => {
					err.push(element.message)
			});
			res.status(400).json({ error: err.join(',') })
		}
	}

	static async login(req, res, next) {
		try {
			const userLogin = req.body
			const findUser = await User.findOne({
					where: {
							email: userLogin.email
					}
			})
			if (!findUser) {
					res.status(401).json({ error: 'Wrong Email or Password'})
			} else if (!compare(userLogin.password, findUser.password)) {
					res.status(401).json({ error: 'Wrong Email or Password'})
			} else {
					const token = createToken({
							id: findUser.id,
							email: findUser.email
					})
					res.status(200).json({ token })
			}
		} catch (error) {
				console.log(error)
				res.status(400).json(error)
		}
	}
}

module.exports = UserController