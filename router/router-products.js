import express from 'express';
import Products from '../schemas/schemas-products.js';

const router = express.Router();

//등록
router.post('/', async (req, res) => {
  const { name, description, manager, password } = req.body;
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
});

//조회
router.get('/', async (req, res) => {
  const productsAll = await Products.find().exec();
  const showProducts = productsAll.map((cur) => {
    return {
      id: cur._id,
      name: cur.name,
      description: cur.description,
      manager: cur.manager,
      status: cur.status,
      createdAt: cur.createdAt,
      updatedAt: cur.updatedAt,
    };
  });
  return res.status(200).send({
    status: 200,
    message: '상품 목록 조회에 성공했습니다.',
    data: showProducts,
  });
});

//상세조회
router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;
  const productItem = await Products.findById(productId).exec();
  if (!productItem) {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
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
});

//수정
router.patch('/:productId', async (req, res) => {
  const editId = req.params.productId;
  const { name, description, manager, status, password } = req.body;

  const productItem = await Products.findById(editId).exec();
  if (!productItem) {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
  } else if (password != productItem.password) {
    return res
      .status(401)
      .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
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
});

//삭제
router.delete('/:productId', async (req, res) => {
  const editId = req.params.productId;
  const { password } = req.body;

  const productItem = await Products.findById(editId).exec();
  if (!productItem) {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
  } else if (password != productItem.password) {
    return res
      .status(401)
      .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
  }

  await productItem.deleteOne({ _id: editId }).exec();

  return res.status(200).send('삭제완료');
});

export default router;
