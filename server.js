const app = require('./app');

const PORT = process.env.PORT || 5000;

//const cors = require('cors');
//app.use(cors({
//  origin: 'http://localhost:5000', // Your React app URL
//  credentials: true
//}));

app.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`)
})