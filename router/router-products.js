import express from 'express';
import Products from '../schemas/schemas-products.js';
import Joi from 'joi';

const router = express.Router();

//joi 유효성검사
const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  description: Joi.string().min(1).max(200).required(),
  manager: Joi.string().min(1).max(50).required(),
  password: Joi.string().min(4).max(15).required(),
});

const deleteProductSchema = Joi.object({
  password: Joi.string().required(),
});

const editProductSchema = Joi.object({
  name: Joi.string().min(1).max(50),
  description: Joi.string().min(1).max(200),
  manager: Joi.string().min(1).max(50),
  status: Joi.string(),
  password: Joi.string().required(),
});

//등록
router.post('/', async (req, res) => {
  try {
    const product = await createProductSchema.validateAsync(req.body);
    const { name, description, manager, password } = product;
    const status = 'FOR_SALE';
    const createdAt = new Date();
    const updatedAt = createdAt;
    const newProduct = new Products({
      name,
      description,
      manager,
      status,
      password,
      createdAt,
      updatedAt,
    });

    await newProduct.save();

    return res.status(200).json({
      status: 201,
      message: '상품 생성에 성공했습니다.',
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const errorProduct = req.body;
      if (!errorProduct.name) {
        return res
          .status(400)
          .json({ errorMessage: '이름: 올바른 정보를 입력하세요' });
      } else if (!errorProduct.description) {
        return res
          .status(400)
          .json({ errorMessage: '상세정보: 올바른 정보를 입력하세요' });
      } else if (!errorProduct.manager) {
        return res
          .status(400)
          .json({ errorMessage: '관리자: 올바른 정보를 입력하세요' });
      } else if (!errorProduct.password) {
        return res
          .status(400)
          .json({ errorMessage: '비밀번호: 올바른 정보를 입력하세요' });
      }
    }
    return res
      .status(500)
      .json({ errorMessage: '서버에서 에러가 발생하였습니다.' });
  }
});

//조회
router.get('/', async (req, res) => {
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
});

//상세조회
router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
    const productItem = await Products.findById(productId).exec();
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
      return res.status(400).json({ errorMessage: '존재하지 않는 상품입니다' });
    }
    return res
      .status(500)
      .json({ errorMessage: '서버에서 에러가 발생하였습니다' });
  }
});

//수정
router.patch('/:productId', async (req, res) => {
  const editId = req.params.productId;
  try {
    const product = await editProductSchema.validateAsync(req.body);
    const { name, description, manager, status, password } = product;

    const productItem = await Products.findById(editId).exec();
    if (password != productItem.password) {
      return res
        .status(401)
        .json({ errorMessage: '비밀번호가 일치하지 않습니다' });
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
      productItem.status = status;
    }

    await productItem.save();
    return res.status(200).send('저장완료');
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ errorMessage: '올바른 정보를 입력하세요' });
    } else if (error.name === 'CastError') {
      return res.status(400).json({ errorMessage: '존재하지 않는 상품입니다' });
    }
    return res
      .status(500)
      .json({ errorMessage: '서버에서 에러가 발생하였습니다.' });
  }
});

//삭제
router.delete('/:productId', async (req, res) => {
  try {
    const editId = req.params.productId;
    const deleteProduct = await deleteProductSchema.validateAsync(req.body);
    const { password } = deleteProduct;

    const productItem = await Products.findById(editId).exec();
    if (password != productItem.password) {
      return res
        .status(401)
        .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
    }

    await productItem.deleteOne({ _id: editId }).exec();

    return res.status(200).send('삭제완료');
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const errorProduct = req.body;
      if (!errorProduct.password) {
        return res.status(400).json('비번 입력X');
      }
    }
    return res
      .status(500)
      .json({ errorMessage: '서버에서 에러가 발생하였습니다.' });
  }
});

export default router;
