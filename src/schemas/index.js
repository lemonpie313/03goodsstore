import mongoose from 'mongoose';

import { MONGODB_URL, MONGODB_NAME } from '../constants/env.constant.js';

const connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      dbName: MONGODB_NAME,
    })
    .catch((err) => console.log(err))
    .then(() => console.log('몽고디비 연결 성공'));
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

export default connect;
