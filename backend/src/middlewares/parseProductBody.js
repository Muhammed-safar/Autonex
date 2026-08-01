export const parseProductBody = (req, res, next) => {
 
  console.log(req.headers["content-type"]);
  console.log(req.body);
  console.log(req.files);
 
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

    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid product data.",
    });
  }
};