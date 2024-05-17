import mongoose from 'mongoose';
import { PRODUCT_STATUS } from '../constants/products.constant.js';

const productsSchema = new mongoose.Schema(
  {
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
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.FOR_SALE,
    },
    password: {
      type: String,
      required: true,
      selected: false,
    },
    salt: {
      type: String,
      required: true,
      selected: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.model('Products', productsSchema);
