  import "dotenv/config";
  import cookieParser from "cookie-parser";

  import cors from "cors";
  import corsOptions from "./config/cors.js";

  import connectDB from "./config/db.js";
  import helmet from "helmet";
  import mongoSanitize from "express-mongo-sanitize";

  import authRoutes from "./routes/auth.routes.js";
  import productRoutes from "./routes/product.routes.js";
  import categoryRoutes from "./routes/category.routes.js";
  import brandRoutes from "./routes/brand.routes.js";
  import cartRoutes from "./routes/cart.routes.js";
  import wishRoutes from "./routes/whishlist.routes.js";
  import addressRoutes from "./routes/address.routes.js";
  import dashboardRoutes from "./routes/dashboard.routes.js"
  import app from "./app.js";
  import { errorHandler } from "./middlewares/error.middleware.js";
import contactRoutes from "../src/routes/contact.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import orderRoutes from "./routes/order.routes.js"
  connectDB();

  app.use(cors(corsOptions));
  app.use(helmet());
  // app.use(mongoSanitize());
  app.use(cookieParser());

  const PORT = process.env.PORT || 5000;

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/brands", brandRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/whishlist", wishRoutes);
  app.use("/api/address", addressRoutes);
  app.use("/api/dashboard", dashboardRoutes );
  app.use("/api/contact", contactRoutes);
  app.use("/api/checkout", checkoutRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/orders", orderRoutes);


  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
