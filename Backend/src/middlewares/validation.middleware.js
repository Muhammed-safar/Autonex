export const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  };
};

