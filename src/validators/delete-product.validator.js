import Joi from 'joi';

export const deleteProductSchema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
    .messages({
      'string.empty': `비밀번호를 입력해주세요`,
      'string.max': `비밀번호는 4글자 이상 10글자 이하로 입력해주세요`,
      'string.min': `비밀번호는 4글자 이상 10글자 이하로 입력해주세요`,
      'any.required': `비밀번호를 입력해주세요`,
      'string.pattern.base': '비밀번호는 대소문자, 숫자로만 입력할 수 있습니다',
    }),
});
