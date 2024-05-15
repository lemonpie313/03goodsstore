// import
import express from 'express';
import productsRouter from './router/router-products.js';

// 환경변수
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

//root
app.get('/', (req, res) => {
  res.send('루트!!');
});

//router-products
app.use('/products', [productsRouter]);

// 포트 열기
app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
