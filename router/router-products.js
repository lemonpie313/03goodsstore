import express from 'express';

const router = express.Router();

router.get('/', (req,res) => {
    return res.status(200).send('products페이지');
});

export default router;