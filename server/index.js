const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const compression = require('compression');
const cors = require('cors');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })

const app = express();
const PORT = process.env.PORT || 5000;

//Middlewares
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
// app.use(upload.single()); 

//Routes
const dbRoute = require('./routes/api/dbAccess');
app.use('/api/data', dbRoute);

//Handle Production env
if(process.env.NODE_ENV === 'production') {
  //Static folder
  app.use(express.static(__dirname + '/public/'));
  //Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/pagenotfound.html'));
  //Handle 404 errors
  // app.get('*', function(req, res){
  // res.status(404).sendFile(__dirname + '/public/pagenotfound.html');
// });
}

//Handle 404 errors
app.get(/.*/, function(req, res){
  res.status(404).send('what???');
});

//Start server on PORT
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
