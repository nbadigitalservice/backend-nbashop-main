const router = require('express').Router();
const AddressBook = require('../../controllers/express.controller/address.book.controller')
const auth = require('../../lib/auth');
//ผู้รับ
router.get('/recipient/shop-id/:id', auth, AddressBook.getRecipientByShopId);
router.delete('/recipient/:id', auth, AddressBook.delRecipient);

//ผู้ส่ง
router.get('/sender/shop-id/:id', auth, AddressBook.getSenderByShopId);
router.delete('/sender/:id', auth, AddressBook.delRecipient);

module.exports = router;