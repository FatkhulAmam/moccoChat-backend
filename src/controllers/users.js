const { user } = require('../models')
const responseStandart = require('../helpers/response')
const { Op } = require('sequelize')
const joi = require('joi')

module.exports = {
  createUser: async (req, res) => {
    const pictures = `uploads/${req.file.filename}`
    const schema = joi.object({
      phone: joi.string().required(),
      name: joi.string().required(),
      bio: joi.string().required()
    })
    const { value: results, error } = schema.validate(req.body)
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
      return responseStandart(res, 'error', {}, 500, false)
    }
  },
  getUsers: async (req, res) => {
    const { search } = req.query
    let searchKey = ''
    let searchValue = ''
    if (typeof search === 'object') {
      searchKey = Object.keys(search)[0]
      searchValue = Object.values(search)[0]
    } else {
      searchKey = 'telphone'
      searchValue = search || ''
    }
    const result = await user.findAll({
      where: {
        [searchKey]: {
          [Op.substring]: `${searchValue}`
        }
      }
    })
    return responseStandart(res, 'List all category detail', { result })
  },
  getUser: async (req, res) => {
    const { id } = req.user
    const results = await user.findByPk(id)
    if (results) {
      return responseStandart(res, `user with id ${id}`, { results })
    } else {
      return responseStandart(res, `id ${id} not found`, {}, 401, false)
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.user
    const { telephone, user_name, bio, device_token } = req.body
    const pictures = (req.file ? `uploads/${req.file.filename}` : undefined)
    const results = await user.findByPk(id)
    if (results) {
      const data = {
        telephone,
        user_name,
        bio,
        photo: pictures,
        device_token
      }
      await results.update(data)
      return responseStandart(res, 'update successfully', { results })
    } else {
      return responseStandart(res, `cannot update user ${id}`, {}, 401, false)
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.user
    const results = await user.findByPk(id)
    if (results) {
      await results.destroy()
      return responseStandart(res, `delete user id ${id} successfully`, {})
    } else {
      return responseStandart(res, `user ${id} not found`, {}, 401, false)
    }
  },
  getContackDetail: async (req, res) => {
    const { id } = req.params
    const results = await user.findByPk(id)
    if (results) {
      return responseStandart(res, `contact detail with id ${id}`, { results })
    } else {
      return responseStandart(res, 'contact not found', {}, 401, false)
    }
  }
}
