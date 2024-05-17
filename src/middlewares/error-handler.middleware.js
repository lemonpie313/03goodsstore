export default function (err, req, res, next) {
  console.error(err);

  // Joi 검증에서 에러가 발생하면, 클라이언트에게 에러 메시지를 전달합니다.
  if (err.name === 'ValidationError') {
    return res.status(400).json({ status: 400, errorMessage: err.message });
  } else if (err.name === 'SyntaxError') {
    return res.status(404).json({ status: 404, errorMessage: err.message });
  } else if (err.name === 'CastError') {
    return res
      .status(404)
      .json({ status: 404, errorMessage: '존재하지 않는 상품입니다.' });
  }

  // 그 외의 에러가 발생하면, 서버 에러로 처리합니다.
  return res
    .status(500)
    .json({ errorMessage: '서버에서 에러가 발생하였습니다.' });
}
