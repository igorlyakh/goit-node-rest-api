const express = require('express');
const { isValidId, validateBody, isValidToken } = require('../helpers');

const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} = require('../controllers/contactsControllers.js');
const {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} = require('../schemas/contactsSchemas.js');

const contactsRouter = express.Router();

contactsRouter.get('/', isValidToken, getAllContacts);

contactsRouter.get('/:id', isValidToken, isValidId, getOneContact);

contactsRouter.delete('/:id', isValidToken, isValidId, deleteContact);

contactsRouter.post(
  '/',
  isValidToken,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  '/:id',
  isValidToken,
  isValidId,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  '/:id/favorite',
  isValidToken,
  isValidId,
  validateBody(updateFavoriteSchema),
  updateFavorite
);

module.exports = contactsRouter;
