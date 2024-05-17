import express from 'express';
import Products from '../schemas/schemas-products.js';
import {
  hashedPassword,
  compareHashedPassword,
} from '../crypto/crypto-password.js';
import {
  createProductSchema,
  deleteProductSchema,
  editProductSchema,
} from './joi-products.js';

const router = express.Router();

//등록
router.post('/', async (req, res, next) => {
  try {
    const product = await createProductSchema.validateAsync(req.body);
    const { name, description, manager, password: plainPassword } = product;

    const productAlready = await Products.findOne({ name });

    if (productAlready) {
      throw new SyntaxError('이미 존재하는 상품입니다.');
    }

    const { password, salt } = await hashedPassword(plainPassword);
    const newProduct = new Products({
      name,
      description,
      manager,
      password,
      salt,
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
    next(error);
  }
});

//조회
router.get('/', async (req, res, next) => {
  try {
    const productsAll = await Products.find().exec();
    const showProducts = productsAll
      .map((cur) => {
        return {
          id: cur.id,
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
    next(error);
  }
});

//상세조회
router.get('/:productId', async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const productItem = await Products.findById(productId).exec();
    if (!productItem) {
      throw new SyntaxError('존재하지 않는 상품입니다.');
    }
    const showProductItem = {
      id: productItem.id,
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
    next(error);
  }
});

//수정
router.patch('/:productId', async (req, res, next) => {
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
      throw new SyntaxError('존재하지 않는 상품입니다.');
    }

    const salt = productItem.salt;
    const password = await compareHashedPassword(plainPassword, salt);

    if (password != productItem.password) {
      throw new SyntaxError('비밀번호가 일치하지 않습니다.');
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
        throw new SyntaxError(
          '상품 상태는 [FOR_SALE,SOLD_OUT] 중 하나여야 합니다.'
        );
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
    next(error);
  }
});

//삭제
router.delete('/:productId', async (req, res, next) => {
  try {
    const editId = req.params.productId;
    const deleteProduct = await deleteProductSchema.validateAsync(req.body);
    const { password: plainPassword } = deleteProduct;

    const productItem = await Products.findById(editId).exec();

    if (!productItem) {
      throw new SyntaxError('존재하지 않는 상품입니다.');
    }

    const salt = productItem.salt;
    const password = await compareHashedPassword(plainPassword, salt);

    if (password != productItem.password) {
      throw new SyntaxError('비밀번호가 일치하지 않습니다.');
    }

    await productItem.deleteOne().exec();

    return res.status(200).send({
      status: 200,
      message: '상품 삭제에 성공했습니다.',
      data: productItem,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
