const errorMiddleware = (err, req, res, next) => {
  let status = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(status).json({
    message: err.message,
    stack: err.stack
  });
}

export default errorMiddleware;