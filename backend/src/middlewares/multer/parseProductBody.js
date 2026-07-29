export const parseProductBody = (req, res, next) => {
  try {
    if (req.body.variants) {
      req.body.variants = JSON.parse(req.body.variants);
    }

    if (req.body.compatibleVehicles) {
      req.body.compatibleVehicles = JSON.parse(req.body.compatibleVehicles);
    }

    if (req.body.existingImages) {
      req.body.existingImages = JSON.parse(req.body.existingImages);
    }

    if (req.body.removedImages) {
      req.body.removedImages = JSON.parse(req.body.removedImages);
    }

    console.log("After parsing:");
    console.log(req.body);
    console.log("existingImages:", req.body.existingImages);
    console.log("isArray:", Array.isArray(req.body.existingImages));
    console.log("removedImages:", req.body.removedImages);
    console.log("isArray:", Array.isArray(req.body.removedImages));

    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid product data.",
    });
  }
};
