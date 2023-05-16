import express from 'express';
import { getBooks, getBooksById,postBooks } from '../controller/bookController.js';

const router = express.Router()

router.route('/').get(getBooks)

router.route('/').post(postBooks)

router.route('/:id').get(getBooksById)



export default router