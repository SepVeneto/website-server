module.exports = {
  response(res, httpCode=500, code=381, message="服务端异常", data={}) {
    const responseData = {
      code,
      message,
      data,
    };
    res.status(httpCode).json(responseData);
  }
}