import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    //maxlength: [10, '상품명은 10자 이내로 입력해주세요.'],
  },
  description: {
    type: String,
    required: true,
    //maxlength: [100, '상세 정보는 100자 이내로 입력해주세요.'],
  },
  manager: {
    type: String,
    required: true,
    //maxlength: [10, '관리자 이름은 10자 이내로 입력해주세요.'],
  },
  status: {
    type: String,
    required: true,
    default: 'FOR_SALE',
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.model('Products', productsSchema);
