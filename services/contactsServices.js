const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');

const dbPath = path.join(__dirname, 'db', 'contacts.json');

const getAll = async () => {
  const allContacts = await fs.readFile(dbPath);
  return JSON.parse(allContacts);
};

const getById = async id => {
  const allContacts = await getAll();
  const oneContact = allContacts.find(contact => contact.id === id);
  return oneContact || null;
};

const removeContact = async id => {
  const allContacts = await getAll();
  const index = allContacts.findIndex(contact => contact.id === id);
  if (index === -1) return null;
  const [deletedContact] = allContacts.splice(index, 1);
  fs.writeFile(dbPath, JSON.stringify(allContacts, null, 2));
  return deletedContact;
};

const addContact = async contact => {
  const allContacts = await getAll();
  const newContact = {
    id: nanoid(),
    ...contact,
  };
  allContacts.push(newContact);
  fs.writeFile(dbPath, JSON.stringify(allContacts, null, 2));
  return newContact;
};

module.exports = {
  getAll,
  getById,
  removeContact,
  addContact,
};
