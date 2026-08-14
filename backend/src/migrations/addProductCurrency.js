import "dotenv/config";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

const migrate = async () => {
  try {
    await connectDB();

    const before = await Product.collection.findOne({});
    console.log("Before:", before.currency);

   const result = await Product.collection.updateMany(
  {},
  {
    $set: {
      currency: "INR",
    },
  },
);

    console.log("Update Result:", result);

    const after = await Product.collection.findOne({});
    console.log("After:", after.currency);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

migrate();