import express from 'express';

const app = express();

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;