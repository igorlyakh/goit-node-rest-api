const contactsService = require('../services/contactsServices.js');
const HttpError = require('../helpers/HttpError.js');

const getAllContacts = async (req, res) => {
  try {
    const result = await contactsService.getAll();
    res.json(result);
  } catch {
    res.status(500).json({
      message: 'Server error!',
    });
  }
};

const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getById(id);
    if (!result) {
      throw HttpError(404, 'Not found!');
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, 'Not found!');
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, 'Not found!');
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
};
