const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const profileRoutes = require('./src/routes/meRoutes');
const config = require('./src/config/config');
const cors = require("cors");
const roleRoutes = require('./src/routes/roleRoutes');
const demandRoutes = require('./src/routes/demandRoutes');
const positionRoutes = require('./src/routes/positionRoutes');
const emailRoutes = require('./src/routes/emailRoutes');
const cvRoutes=require('./src/routes/cvRoutes');
const parameterRoutes= require('./src/routes/parameterRoutes');
const path = require('path');
const userRoutes =require('./src/routes/userRoutes');
const nomineeRoutes =require('./src/routes/nomineeRoutes');
const aiRoutes=require("./src/routes/aiRoutes");


const app = express();

app.use(bodyParser.json());
app.use(cors());


mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

  
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/customers',customerRoutes);
app.use('/api',roleRoutes);
app.use('/api',demandRoutes);
app.use('/api',positionRoutes);
app.use('/api',emailRoutes);
app.use('/api',cvRoutes);
app.use('/api',parameterRoutes);
app.use('/api',nomineeRoutes);
app.use('/api',userRoutes);
app.use('/api',aiRoutes);
app.use(express.static(path.join(__dirname, 'public')));



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});