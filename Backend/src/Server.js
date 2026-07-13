import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js'

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
