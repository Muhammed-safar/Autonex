import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js';
import brandRoutes from './routes/brand.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import cartRoutes from './routes/cart.routes.js';

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes)
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
