const notFound = (req, res, next) => { 
  res.status(404);
  const err = new Error(`Not found`);
  next(err);
}

export default notFound;