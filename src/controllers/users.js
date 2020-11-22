const { user } = require('../models')
const responseStandart = require('../helpers/response')
const paging = require('../helpers/pagination')
const joi = require('joi')

module.exports = {
    createUser: async (req, res) => {
        const pictures = `uploads/${req.file.filename}`
        const schema = joi.object({
            phone: joi.string().required(),
            name: joi.string().required(),
            bio: joi.string().required()
        })
        let { value: results, error } = schema.validate(req.body)
        console.log(error)
        if (!error) {
            const dataUser = {
                telphone: results.phone,
                user_name: results.name,
                bio: results.bio,
                photo: pictures
            }
            await user.create(dataUser)
            return responseStandart(res, 'create user success', {})
        } else {
            return responseStandart(res, 'error', {}, 401, false)
        }
    },
    getUsers: async (req, res) => {
        const count = await user.count()
        const page = paging(req, count)
        const { offset, pageInfo } = page
        const { limitData: limit } = pageInfo
        const result = await user.findAll({limit, offset})
        return responseStandart(res, 'List all category detail', { result, pageInfo })
    },
    getUser: async (req, res) => {
        const {id} = req.user
        const results = await user.findByPk(id)
        if (results) {
            return responseStandart(res, `user with id ${id}`, {results})
        } else {
            return responseStandart(res, `id ${id} not found`, {}, 401, false)
        }
    },
    updateUser: async (req, res) => {
        const {id} = req.user
        const {telephone, user_name, bio} = req.body
        const pictures = (req.file?`uploads/${req.file.filename}`:undefined)
        console.log(req.file);
        const results = await user.findByPk(id)
        if (results) {
            const data = {
                telephone,
                user_name,
                bio,
                photo: pictures
            }
            await results.update(data)
            return responseStandart(res, `update successfully`, {results})
        } else {
            return responseStandart(res, `cannot update user ${id}`, {}, 401, false)
        }
    },
    deleteUser: async (req, res) => {
        const {id} = req.user
        const results = await user.findByPk(id)
        if (results) {
            await results.destroy()
            return responseStandart(res, `delete user id ${id} successfully`, {})
        } else {
            return responseStandart(res, `user ${id} not found`, {}, 401, false)
        }
    }
}