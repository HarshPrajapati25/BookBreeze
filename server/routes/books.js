const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');

router.post('/', auth, bookController.createBook);
router.get('/own', auth, bookController.listOwnBooks);
router.get('/available', auth, bookController.listAvailableBooks);
router.post('/request', auth, bookController.requestBook);
router.get('/lendings', auth, bookController.getLendingDetails);
router.post('/return', auth, bookController.returnBook);
router.get('/borrowed', auth, bookController.getBorrowedBooks);

module.exports = router;