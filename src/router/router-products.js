import express from 'express';
import Products from '../schemas/schemas-products.js';
import {
  hashedPassword,
  compareHashedPassword,
} from '../crypto/crypto-password.js';
import Joi from 'joi';

const router = express.Router();

//joi 유효성검사
const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  manager: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  salt: Joi.string(),
});

const deleteProductSchema = Joi.object({
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

const editProductSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  manager: Joi.string(),
  status: Joi.string(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

//등록
router.post('/', async (req, res) => {
  try {
    const product = await createProductSchema.validateAsync(req.body);
    const { name, description, manager, password: plainPassword } = product;
    const { password, salt } = await hashedPassword(plainPassword);
    const createdAt = new Date();
    const updatedAt = createdAt;
    const newProduct = new Products({
      name,
      description,
      manager,
      password,
      salt,
      createdAt,
      updatedAt,
    });

    await newProduct.save();

    const showProducts = {
      id: newProduct._id,
      name: newProduct.name,
      description: newProduct.description,
      manager: newProduct.manager,
      status: newProduct.status,
      createdAt: newProduct.createdAt,
      updatedAt: newProduct.updatedAt,
    };

    return res.status(200).json({
      status: 201,
      message: '상품 생성에 성공했습니다.',
      data: showProducts,
    });
  } catch (error) {
    console.error(error);
    const errorProduct = req.body;
    const productsAll = await Products.find().exec();

    if (!errorProduct.name) {
      return res.status(400).json({ errorMessage: '이름을 입력하세요' });
    } else if (productsAll.includes({ name: errorProduct.name })) {
      return res.status(400).json({ errorMessage: '이미 등록 된 상품입니다.' });
    } else if (!errorProduct.description) {
      return res.status(400).json({ errorMessage: '상세설명을 입력하세요' });
    } else if (!errorProduct.manager) {
      return res.status(400).json({ errorMessage: '관리자를 입력하세요' });
    } else if (!errorProduct.password) {
      return res.status(400).json({ errorMessage: '비밀번호를 입력하세요' });
    }
    return res.status(500).json({
      errorMessage:
        '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
    });
  }
});

//조회
router.get('/', async (req, res) => {
  try {
    const productsAll = await Products.find().exec();
    const showProducts = productsAll
      .map((cur) => {
        return {
          id: cur._id,
          name: cur.name,
          description: cur.description,
          manager: cur.manager,
          status: cur.status,
          createdAt: cur.createdAt,
          updatedAt: cur.updatedAt,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return res.status(200).send({
      status: 200,
      message: '상품 목록 조회에 성공했습니다.',
      data: showProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMessage:
        '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
    });
  }
});

//상세조회
router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
    const productItem = await Products.findById(productId).exec();
    if (!productItem) {
      return res.status(400).json({ errorMessage: '존재하지 않는 상품입니다' });
    }
    const showProductItem = {
      id: productItem._id,
      name: productItem.name,
      description: productItem.description,
      manager: productItem.manager,
      status: productItem.status,
      createdAt: productItem.createdAt,
      updatedAt: productItem.updatedAt,
    };
    return res.status(200).send({
      status: 200,
      message: '상품 상세 조회에 성공했습니다.',
      data: showProductItem,
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res
        .status(404)
        .json({ status: 404, errorMessage: '존재하지 않는 상품입니다' });
    }
    return res.status(500).json({
      status: 500,
      errorMessage:
        '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
    });
  }
});

//수정
router.patch('/:productId', async (req, res) => {
  const editId = req.params.productId;
  try {
    const product = await editProductSchema.validateAsync(req.body);
    const {
      name,
      description,
      manager,
      status,
      password: plainPassword,
    } = product;

    const productItem = await Products.findById(editId).exec();

    if (!productItem) {
      return res
        .status(404)
        .json({ status: 404, errorMessage: '존재하지 않는 상품입니다' });
    }

    const salt = productItem.salt;
    const password = await compareHashedPassword(plainPassword, salt);

    if (password != productItem.password) {
      return res
        .status(401)
        .json({ status: 401, errorMessage: '비밀번호가 일치하지 않습니다' });
    }

    if (name) {
      productItem.name = name;
    }
    if (description) {
      productItem.description = description;
    }
    if (manager) {
      productItem.manager = manager;
    }
    if (status) {
      if (status != 'FOR_SALE' && status != 'SOLD_OUT') {
        return res.status(400).json({
          status: 400,
          errorMessage: '상품 상태는 [FOR_SALE,SOLD_OUT] 중 하나여야 합니다.',
        });
      }
      productItem.status = status;
    }

    productItem.updatedAt = new Date();

    await productItem.save();
    return res.status(200).send({
      status: 200,
      message: '상품 수정에 성공했습니다.',
      data: productItem,
    });
  } catch (error) {
    console.error(error);
    const errorProduct = req.body;
    if (!errorProduct.password) {
      return res.status(400).json({ errorMessage: '비밀번호를 입력하세요' });
    } else if (error.name === 'CastError') {
      return res
        .status(404)
        .json({ status: 404, errorMessage: '존재하지 않는 상품입니다' });
    }
    return res.status(500).json({
      status: 500,
      errorMessage:
        '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
    });
  }
});

//삭제
router.delete('/:productId', async (req, res) => {
  try {
    const editId = req.params.productId;
    const deleteProduct = await deleteProductSchema.validateAsync(req.body);
    const { password: plainPassword } = deleteProduct;

    const productItem = await Products.findById(editId).exec();

    if (!productItem) {
      return res
        .status(404)
        .json({ status: 404, errorMessage: '존재하지 않는 상품입니다' });
    }

    const salt = productItem.salt;
    const password = await compareHashedPassword(plainPassword, salt);

    if (password != productItem.password) {
      return res
        .status(401)
        .json({ status: 401, errorMessage: '비밀번호가 일치하지 않습니다.' });
    }

    await productItem.deleteOne({ _id: editId }).exec();

    return res.status(200).send({
      status: 200,
      message: '상품 삭제에 성공했습니다.',
      data: productItem,
    });
  } catch (error) {
    console.error(error);
    const errorProduct = req.body;
    if (!errorProduct.password) {
      return res
        .status(400)
        .json({ status: 400, errorMessage: '비밀번호를 입력하세요' });
    } else if (error.name === 'CastError') {
      return res
        .status(404)
        .json({ status: 404, errorMessage: '존재하지 않는 상품입니다' });
    }
    return res.status(500).json({
      status: 500,
      errorMessage:
        '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
    });
  }
});

export default router;
