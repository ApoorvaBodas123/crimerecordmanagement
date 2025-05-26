export const handleError = (res, error) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }

  if (error.name === 'MongoError' && error.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate key error',
      field: Object.keys(error.keyPattern)[0]
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }

  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}; 