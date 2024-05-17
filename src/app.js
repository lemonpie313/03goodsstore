// import
import express from 'express';
import productsRouter from './router/router-products.js';
import connect from './schemas/index.js';
import ErrorHandlerMiddleware from './middlewares/error-handler.middleware.js';

// 환경변수
import { SERVER_PORT } from './constants/env.constant.js';

const app = express();

//MongoDB 연결
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//root
app.get('/', (req, res) => {
  res.send('루트!!');
});

//router-products
app.use('/products', [productsRouter]);

//에러핸들러
app.use(ErrorHandlerMiddleware);

// 포트 열기
app.listen(SERVER_PORT, () => {
  console.log(SERVER_PORT, '포트로 서버가 열렸어요!');
});
