import Joi from 'joi';
import { PRODUCT_STATUS } from '../constants/products.constant.js';

export const editProductSchema = Joi.object({
  name: Joi.string().max(10).messages({
    'string.base': `상품명은 문자열이어야 합니다`,
    'string.empty': `상품명을 입력해주세요`,
    'string.max': `상품명은 10글자 이내로 입력해주세요`,
  }),
  description: Joi.string().max(50).messages({
    'string.base': `상세 정보는 문자열이어야 합니다`,
    'string.empty': `상세 정보를 입력해주세요`,
    'string.max': `상세 정보는 50글자 이내로 입력해주세요`,
  }),
  manager: Joi.string().max(10).messages({
    'string.base': `관리자명은 문자열이어야 합니다`,
    'string.empty': `관리자명을 입력해주세요`,
    'string.max': `관리자명은 10글자 이내로 입력해주세요`,
  }),
  status: Joi.string()
    .valid(...Object.values(PRODUCT_STATUS))
    .messages({
      'string.base': `상태는 문자열이어야 합니다`,
      'string.empty': `상태를 입력해주세요`,
      'any.only': '상품 상태는 [FOR_SALE,SOLD_OUT] 중 하나여야 합니다.',
    }),
  password: Joi.string()
    .required()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .min(4)
    .max(10)
    .messages({
      'string.base': `비밀번호는 문자열이어야 합니다`,
      'string.empty': `비밀번호를 입력해주세요`,
      'string.max': `비밀번호는 4글자 이상 10글자 이하로 입력해주세요`,
      'string.min': `비밀번호는 4글자 이상 10글자 이하로 입력해주세요`,
      'any.required': `비밀번호를 입력해주세요`,
      'string.pattern.base': '비밀번호는 대소문자, 숫자로만 입력할 수 있습니다',
    }),
});
