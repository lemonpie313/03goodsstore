import mongoose from 'mongoose';

//환경변수
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const connect = () => {
  mongoose
    .connect(process.env.MongoDBSite, {
      dbName: '03goodsstore',
    })
    .catch((err) => console.log(err))
    .then(() => console.log('몽고디비 연결 성공'));
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

export default connect;
