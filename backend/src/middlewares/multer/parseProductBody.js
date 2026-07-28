export const parseProductBody = (req, res, next) => {
  try {
    if (req.body.variants) {
      req.body.variants = JSON.parse(req.body.variants);
    }

    if (req.body.compatibleVehicles) {
      req.body.compatibleVehicles = JSON.parse(req.body.compatibleVehicles);
    }

    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid product data.",
    });
  }
};
