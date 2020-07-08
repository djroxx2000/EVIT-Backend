//Password stored locally

//Server access
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

//Blob upload dependencies
const multer = require('multer');
const upload = multer({ dest: './uploads' })
const fs = require('fs');

//Mail dependencies
const nodemailer = require('nodemailer');

//Authentication Dependency
const jwt = require('jsonwebtoken');

//DB access data
// const uri = 'mongodb://localhost:27017';
// const db_name = 'test_db';
const uri = 'mongodb+srv://efuel-admin:<password>@cluster0-wgynz.mongodb.net/efuel?retryWrites=true&w=majority';
const db_name = 'efuel';

let mail_username = "";
let mail_pw = "";

// DB Schemas
// var userSchema = new Schema({
// 	username: String,
// 	password: String,
// 	bio: String,
// 	image: {
// 		data: Buffer,
// 		contentType: String
// 	}
// })

// var productSchema = new Schema({
// 	productName: String,
// 	actual_price: Number,
// 	sale_price: Number,
// 	description: String,
// 	category: String,
// 	tags: [{tagname: String}],
// 	comments: [{body: String, date: Date}],
// 	date: {type: Date, default: Date.now},
// 	on_sale: {type: Boolean, default: false},
// 	meta: {
// 		rating: Number,
// 		comments: Number
// 	}
// })

// var testimonialSchema = new Schema({
// 	name: String,
// 	rating: Number,
// 	job_role: String,
// 	comment: String,
// 	image: {
// 		data: Buffer,
// 		contentType: String
// 	}
// })


//Authentication Request
router.post('/login', async (req, res) => {
	const users = await loadData("users");
	let user = await users.findOne({
		"username": req.body.username,
		"password": req.body.password
	});
	if(user === null) {
		return res.status(401).json({
			title: "invalid"
		})
	}
	else {
		const token = jwt.sign({ userId: user._id }, "evitsecretkey");
		return res.status(201).json({
			token: token
		})
	}
})



//GET Requests

// router.get('/', async (req, res) => {
// 	const test_collection = await loadData('test_collection');
// 	let data = await test_collection.find({}).toArray();
// 	res.status(200).send(data);
// });

router.get('/users', async (req, res) => {
	try {
		const users = await loadData('users');
		let data = await users.find({}).toArray();
		res.status(200).send(data);	
	} catch (error) {
		console.log(error);
	}
	
})

router.get('/products', async (req, res) => {
	try {
		const products = await loadData('products');
		let data = await products.find({}).toArray();
		res.status(200).send(data);
	} catch (error) {
		console.log(error);
	}
	
})

router.get('/testimonials', async (req, res) => {
	try {
		const testimonials = await loadData('testimonials');
		let data = await testimonials.find({}).toArray();
		res.status(200).send(data);
	} catch (error) {
		console.log(error);
	}
	
})

router.get('/blogs', async (req, res) => {
	try {
		const blogs = await loadData('blogs');
		let data = await blogs.find({}).toArray();
		res.status(200).send(data);
	} catch (error) {
		console.log(error);
	}
	
})


router.get('/team', async (req, res) => {
	try {
		const team_collection = await loadData('team');
		let data = await team_collection.find({}).toArray();
		res.status(200).send(data);

	} catch (error) {
		console.log(error);
	}
	
})

router.get('/gallery', async (req, res) => {
	try {
		const gallery = await loadData('gallery');
		let data = await gallery.find({}).toArray();
		res.status(200).send(data);
	} catch (error) {
		console.log(error);
	}
	
})

router.get('/index_data', async (req, res) => {
	try {
		const index_data = await loadData('index_data');
		let data = await index_data.find({}).toArray();
		res.status(200).send(data);
	} catch (error) {
		console.log(error);
	}
	
})

router.get('/multi_data', async (req, res) => {
	try {
		const multi_data = await loadData('multi_data');
		let data = await multi_data.find({}).toArray();
		res.status(200).send(data);
	} catch (error) {
		console.log(error);
	}
	
})

router.get('/about_data', async (req, res) => {
	try {
		const about_data = await loadData('about_data');
		let data = await about_data.find({}).toArray();
		res.status(200).send(data);
	} catch (error) {
		console.log(error);
	}
	
})
router.get('/partner_id', async (req, res) => {
	try {
		const partner = await loadData('partner_data');
		let data = await partner.find({}).toArray();
		res.status(200).send(data[0]._id);
	} catch (error) {
		console.log(error);
	}
	
})

router.get('/partner_data', async (req, res) => {
	try {
		const partner = await loadData('partner_data');
		let data = await partner.find({}).toArray();
		res.status(200).send(data);
	} catch (error) {
		console.log(error);
	}
	
});

router.get('/faq_data', async (req, res) => {
	try {
		const faq = await loadData('faq_data');
		let data = await faq.find({}).toArray();
		res.status(200).send(data);
	} catch (error) {
		console.log(error);
	}
});

router.get('/company_mail', async (req, res) => {
   try {
		const mail = await loadData('company_mail');
		let data = await mail.find({}).toArray();
		res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
});

//POST Requests
router.post('/company_mail', upload.none(), async (req, res) => {
   if(req.body.email && req.body.password) {
      mail_username = req.body.email;
      mail_pw = req.body.password;
   }
   const comp_mail = await loadData("company_mail");
   const exists = await comp_mail.countDocuments();
   let new_data = {};
   for(let key of Object.keys(req.body)) {
      if(req.body[`${key}`] != ""){
         new_data[`${key}`] = req.body[`${key}`];
      }
   }
   try {
      if(exists == 0) {
         await comp_mail.insertOne(new_data, { writeConcern: { w: "majority" , wtimeout: 5000 }},(err) => {
			if(err) res.status(401).send(err)
		});
      } else {
         const data = await comp_mail.find({}).toArray();
		 const mail_id = data[0]._id;
		 let set_data = {$set: new_data};
         await comp_mail.updateOne({ _id: mongoose.Types.ObjectId(mail_id) }, set_data, { writeConcern: { w: "majority" , wtimeout: 5000 }},(err) => {
			if(err) res.status(401).send(err)
		});
      }
      res.status(201).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
})

router.post('/multi_data', upload.fields([
	{ name: 'footer_img', maxCount: 1},
	{ name: 'header_img', maxCount: 1 },
	{ name: 'favicon', maxCount: 1 }]), async (req, res) => {
	const multi_data = await loadData('multi_data');
	const exists = await multi_data.countDocuments();
	let header_img = "", footer_img = "", favicon = "";
	if(req.files){
		if(req.files.header_img) {
			var img = fs.readFileSync(req.files.header_img[0].path);
			var encode_image = img.toString('base64');
			let new_img = {contentType: req.files.header_img[0].mimetype, image: Buffer.from(encode_image, 'base64')};
			header_img = new_img;
			fs.unlinkSync(req.files.header_img[0].path);
		}
		if(req.files.footer_img) {
			var img = fs.readFileSync(req.files.footer_img[0].path);
			var encode_image = img.toString('base64');
			let new_img = {contentType: req.files.footer_img[0].mimetype, image: Buffer.from(encode_image, 'base64')};
			footer_img = new_img;
			fs.unlinkSync(req.files.footer_img[0].path);
		}
		if(req.files.favicon) {
			var img = fs.readFileSync(req.files.favicon[0].path);
			var encode_image = img.toString('base64');
			let new_img = {contentType: req.files.favicon[0].mimetype, image: Buffer.from(encode_image, 'base64')};
			favicon = new_img
			fs.unlinkSync(req.files.favicon[0].path);
		}
	} 
	if(exists == 0) {
		let newData = {};
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != "") {
				newData[`${key}`] = req.body[`${key}`];
			}
		}
		newData["header_img"] = header_img;
		newData["footer_img"] = footer_img;
		newData["favicon"] = favicon;
		await multi_data.insertOne(newData, { writeConcern: { w: "majority" , wtimeout: 5000 }},(err) => {
			if(err) res.status(401).send(err)
		})
	} else {
		const multi = await multi_data.find({}).toArray();
		const multi_id = multi[0]._id;
		let newData = {$set: {}};
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != "") {
				newData.$set[`${key}`] = req.body[`${key}`];
			}
		}
		if(header_img != "") newData.$set["header_img"] = header_img;
		if(footer_img != "") newData.$set["footer_img"] = footer_img;
		if(favicon != "") newData.$set["favicon"] = favicon;
		await multi_data.updateOne({ _id: mongoose.Types.ObjectId(multi_id)}, newData, { writeConcern: { w: "majority" , wtimeout: 5000 }},(err) => {
			if(err) res.status(401).send(err)
		})
	}
	res.status(201).json({  title: "success" });
	
	
})

router.post('/index_data', upload.fields([
	{ name: 'index_img', maxCount: 2},
	{ name: 'level_img', maxCount: 4 },
	{ name: 'header_img', maxCount: 2 },
	{ name: 'charger_img', maxCount: 2 }]), async (req, res) => {
	const index_data = await loadData('index_data');
	const exists = await index_data.countDocuments();
	let final_img = [], level_img = [], header_img = [], charger_img = [];
	if(req.files){
		if(req.files.index_img) {
			for(file of req.files.index_img){
				var img = fs.readFileSync(file.path);
				var encode_image = img.toString('base64');
				let new_img = {contentType: file.mimetype, image: Buffer.from(encode_image, 'base64')}
				final_img.push(new_img);
				fs.unlinkSync(file.path);

			}
		}
		if(req.files.level_img) {
			for (file of req.files.level_img) {
				var img = fs.readFileSync(file.path);
				var encode_image = img.toString('base64');
				let new_img = {contentType: file.mimetype, image: Buffer.from(encode_image, 'base64')}
				level_img.push(new_img);
				fs.unlinkSync(file.path);
			}
		}
		if(req.files.header_img) {
			for (file of req.files.header_img) {
				var img = fs.readFileSync(file.path);
				var encode_image = img.toString('base64');
				let new_img = {contentType: file.mimetype, image: Buffer.from(encode_image, 'base64')}
				header_img.push(new_img);
				fs.unlinkSync(file.path);
			}
		}
		if(req.files.charger_img) {
			for (file of req.files.charger_img) {
				var img = fs.readFileSync(file.path);
				var encode_image = img.toString('base64');
				let new_img = {contentType: file.mimetype, image: Buffer.from(encode_image, 'base64')}
				charger_img.push(new_img);
				fs.unlinkSync(file.path);
			}
		}
	} else {
		final_img = "";
		level_img = "";
		header_img = "";
		charger_img = ""
	}
	if(exists == 0){
		let newData = {};
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != "") {
				newData[`${key}`] = req.body[`${key}`];
			}
		}
		newData["index_img"] = final_img;
		newData["level_img"] = level_img;
		newData["header_img"] = header_img;
		newData["charger_img"] = charger_img;
		await index_data.insertOne(newData, { writeConcern: { w: "majority" , wtimeout: 5000 }},(err) => {
			if(err) res.status(401).send(err)
		})
	} else {
		const index = await index_data.find({}).toArray();
		const index_id = index[0]._id;
		let newData = {$set: {}};
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != "") {
				newData.$set[`${key}`] = req.body[`${key}`];
			}
		}
		if(final_img != "") newData.$set["index_img"] = final_img;
		if(level_img != "") newData.$set["level_img"] = level_img;
		if(header_img != "") newData.$set["header_img"] = header_img;
		if(charger_img != "") newData.$set["charger_img"] = charger_img;
		await index_data.updateOne({ _id: mongoose.Types.ObjectId(index_id)}, newData, { writeConcern: { w: "majority" , wtimeout: 5000 }},(err) => {
			if(err) res.status(401).send(err)
		})
	}
	res.status(201).json({  title: "success" });
});

router.post('/about_data', upload.single('about_img'), async (req, res) => {
	const about_data = await loadData('about_data');
	const exists = await about_data.countDocuments();
	if(req.file){
		var img = fs.readFileSync(req.file.path);
		var encode_image = img.toString('base64');
		var final_img = {
			contentType: req.file.mimetype,
			image: Buffer.from(encode_image, 'base64')
		};
		fs.unlinkSync(req.file.path);
	} else {
		final_img = "";
	}
	if(exists == 0){
		let newData = {};
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != "") {
				newData[`${key}`] = req.body[`${key}`];
			}
		}
		newData["about_img"] = final_img;
		await about_data.insertOne(newData, { writeConcern: { w: "majority" , wtimeout: 5000 }},(err) => {
			if(err) res.status(401).send(err)
		})
	} else {
		const about = await about_data.find({}).toArray();
		const about_id = about[0]._id;
		let newData = {$set: {}};
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != "") {
				newData.$set[`${key}`] = req.body[`${key}`];
			}
		}
		if(final_img != "") newData.$set["about_img"] = final_img;
		await about_data.updateOne({ _id: mongoose.Types.ObjectId(about_id)}, newData, { writeConcern: { w: "majority" , wtimeout: 5000 }},(err) => {
			if(err) res.status(401).send(err)
		})
	}
	res.status(201).json({  title: "success" });
})

router.post('/partner_data', upload.array('partner_img'), async (req, res) => {
	const partner_data = await loadData('partner_data');
	const exists = await partner_data.countDocuments();
	var final_img = [];
	if(req.files.length == 0){
		for(file of req.files){
			var img = fs.readFileSync(file.path);
			var encode_image = img.toString('base64');
			new_img = {contentType: file.mimetype, image: Buffer.from(encode_image, 'base64')}
			final_img.push(new_img);
			fs.unlinkSync(file.path);
		}
	} else {
		final_img = "";
	}
	
	if(exists == 0){
		let newData = {partner_img: []};
		newData["partner_img"] = final_img;
		newData["partner_p"] = req.body.partner_p;
		await partner_data.insertOne(newData, 
	{ writeConcern: { w: "majority" , wtimeout: 5000 }}, (err) => {
		if(err) res.status(401).send(err)
	})
	} else {
		let newData = {$set: {partner_img: []}};
		if(final_img != "") newData.$set["partner_img"] = final_img;
		newData.$set["partner_p"] = req.body.partner_p;
		await partner_data.updateOne({ _id: mongoose.Types.ObjectId(req.body.id)}, newData, 
	{ writeConcern: { w: "majority" , wtimeout: 5000 }}, (err) => {
			if(err) res.status(401).send(err)
		})
	}
	res.status(201).json({  title: "success" });
});

router.post('/faq_data', upload.none(), async (req, res) => {
	const faq_data = await loadData('faq_data');
	const exists = await faq_data.countDocuments();
	if(exists == 0) {
		let newData = {};
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != ""){
				newData[`${key}`] = req.body[`${key}`];
			}
		}
		await faq_data.insertOne(newData, { writeConcern: { w: "majority" , wtimeout: 5000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		});
	} else {
		const faq = await faq_data.find({}).toArray();
		const faq_id = faq[0]._id;
		let newData = {$set: {}};
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != "") {
				newData.$set[`${key}`] = req.body[`${key}`];
			}
		}
		await faq_data.updateOne({ _id: mongoose.Types.ObjectId(faq_id)}, newData, 
	{ writeConcern: { w: "majority" , wtimeout: 5000 }}, (err) => {
			if(err) res.status(401).send(err)
		})
	}
	res.status(201).json({  title: "success" });
});

router.post('/users', upload.none(), async (req, res) => {
	const user_collection = await loadData('users');
	if(req.body.id) {
		let newData = {$set: {}}
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != ""){
				newData.$set[`${key}`] = req.body[`${key}`];
			}
		}
		await user_collection.updateOne({ _id: mongoose.Types.ObjectId(req.body.id)}, newData, { writeConcern: { w: "majority" , wtimeout: 5000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		});
		res.status(201).json({  title: "success" });
	} else {
		await user_collection.insertOne({
			username: req.body.username,
			password: req.body.password,
		}, { writeConcern: { w: "majority" , wtimeout: 5000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		})
		res.status(201).json({  title: "success" });
	}
});

router.post('/testimonials', upload.single('testimonial_img'), async(req, res) => {
	const test_collection = await loadData('testimonials');
	if(req.file){
		var img = fs.readFileSync(req.file.path);
		var encode_image = img.toString('base64');
		var final_img = {
			contentType: req.file.mimetype,
			image: Buffer.from(encode_image, 'base64')
		};
		fs.unlinkSync(req.file.path);
	} else {
		final_img = "";
	}

	if(req.body.id) {
		let newData = {$set: {}}
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != ""){
				newData.$set[`${key}`] = req.body[`${key}`];
			}
		}
		if(final_img != ""){
			newData.$set['image'] = final_img;
		}
		await blogs.updateOne({ _id: mongoose.Types.ObjectId(req.body.id)}, newData, { writeConcern: { w: "majority" , wtimeout: 5000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		});
	} else {
		await test_collection.insertOne({
			image: final_img,
			name: req.body.name,
			role: req.body.role,
			rating: req.body.rating,
			comment: req.body.comment	
		}, { writeConcern: { w: "majority" , wtimeout: 5000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		})
	}
	res.status(201).json({  title: "success" });
})

router.post('/blogs', upload.single('blog_img'), async(req, res) => {
	const blogs = await loadData('blogs');
	if(req.file){
		var img = fs.readFileSync(req.file.path);
		var encode_image = img.toString('base64');
		var final_img = {
			contentType: req.file.mimetype,
			image: Buffer.from(encode_image, 'base64')
		};
		fs.unlinkSync(req.file.path);
	} else {
		final_img = "";
	}

	if(req.body.id) {
		let newData = {$set: {}}
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != ""){
				newData.$set[`${key}`] = req.body[`${key}`];
			}
		}
		if(final_img != ""){
			newData.$set['image'] = final_img;
		}
		await blogs.updateOne({ _id: mongoose.Types.ObjectId(req.body.id)}, newData, { writeConcern: { w: "majority" , wtimeout: 5000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		});
	} else {
		await blogs.insertOne({
			image: final_img,
			title: req.body.title,
			description: req.body.description	
		}, { writeConcern: { w: "majority" , wtimeout: 5000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		})
	}
	res.status(201).json({  title: "success" });
})


router.post('/products', upload.single('product_img'), async (req, res) => {
	const products = await loadData('products');
	if(req.file) {
		var img = fs.readFileSync(req.file.path);
		var encode_image = img.toString('base64');
		var final_img = {
		contentType: req.file.mimetype,
		image: Buffer.from(encode_image, 'base64')
		}; 		
		fs.unlinkSync(req.file.path);
	} else {
		var final_img = "";
	}

	if(req.body.id) {
		let newData = {$set: {}}
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != ""){
				newData.$set[`${key}`] = req.body[`${key}`];
			}
		}
		if(final_img != ""){
			newData.$set['image'] = final_img;
		}
		await products.updateOne({ _id: mongoose.Types.ObjectId(req.body.id)}, newData, { writeConcern: { w: "majority" , wtimeout: 5000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		});
	} else {
		await products.insertOne({
			name: req.body.name,
			description: req.body.description,
			image: final_img,
			actual_price: req.body.actual_price,
			sale_price: req.body.sale_price,
			tags: req.body.tags,
			rating: req.body.rating,
		}, { writeConcern: { w: "majority" , wtimeout: 1000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		})
	}
	res.status(201).json({  title: "success" });
})

router.post('/team', upload.single('team_img'), async(req, res) => {
	const team_collection = await loadData('team');
	if(req.file){
		var img = fs.readFileSync(req.file.path);
		var encode_image = img.toString('base64');
		var final_img = {
			contentType: req.file.mimetype,
			image: Buffer.from(encode_image, 'base64')
		};
		fs.unlinkSync(req.file.path);
	} else {
		final_img = "";
	}

	if(req.body.id) {
		let newData = {$set: {}}
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != ""){
				newData.$set[`${key}`] = req.body[`${key}`];
			}
		}
		if(final_img != ""){
			newData.$set['image'] = final_img;
		}
		await team_collection.updateOne({ _id: mongoose.Types.ObjectId(req.body.id)}, newData, { writeConcern: { w: "majority" , wtimeout: 5000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		});
	} else {
		await team_collection.insertOne({
			image: final_img,
			name: req.body.name,
			role: req.body.role	
		}, { writeConcern: { w: "majority" , wtimeout: 5000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		})
	}
	res.status(201).json({  title: "success" });
})

router.post('/gallery', upload.single('gallery_img'), async(req, res) => {
	const gallery = await loadData('gallery');
	if(req.file){
		var img = fs.readFileSync(req.file.path);
		var encode_image = img.toString('base64');
		var final_img = {
			contentType: req.file.mimetype,
			image: Buffer.from(encode_image, 'base64')
		};
		fs.unlinkSync(req.file.path);
	} else {
		final_img = "";
	}

	if(req.body.id) {
		let newData = {$set: {}}
		for(let key of Object.keys(req.body)){
			if(req.body[`${key}`] != ""){
				newData.$set[`${key}`] = req.body[`${key}`];
			}
		}
		if(final_img != ""){
			newData.$set['image'] = final_img;
		}
		await gallery.updateOne({ _id: mongoose.Types.ObjectId(req.body.id)}, newData, { writeConcern: { w: "majority" , wtimeout: 5000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		});
	} else {
		await gallery.insertOne({
			image: final_img,
			title: req.body.title
		}, { writeConcern: { w: "majority" , wtimeout: 5000 }}, (err, result) => {
			if(err) res.status(401).send(err)
		})
	}
	res.status(201).json({  title: "success" });
})

//DELETE Requests
router.delete('/users/:id', async (req, res) => {
	const users = await loadData('users');
	users.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, 
	{ writeConcern: { w: "majority" , wtimeout: 5000 }}, 
	(err, result) => {
		if(err){
			console.log(err);
		}
	});
	res.status(201).send();
})

router.delete('/blogs/:id', async (req, res) => {
	const blogs = await loadData('blogs');
	blogs.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, 
	{ writeConcern: { w: "majority" , wtimeout: 5000 }}, 
	(err, result) => {
		if(err){
			console.log(err);
		}
	});
	res.status(201).send();
})

router.delete('/team/:id', async (req, res) => {
	const team = await loadData('team');
	team.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, 
	{ writeConcern: { w: "majority" , wtimeout: 5000 }}, 
	(err, result) => {
		if(err){
			console.log(err);
		}
	});
	res.status(201).send();
})

router.delete('/testimonials/:id', async (req, res) => {
	const testimonials = await loadData('testimonials');
	testimonials.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, 
	{ writeConcern: { w: "majority" , wtimeout: 5000 }}, 
	(err, result) => {
		if(err){
			console.log(err);
		}
	});
	res.status(201).send();
})

router.delete('/products/:id', async (req, res) => {
	const products = await loadData('products');
	products.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, 
	{ writeConcern: { w: "majority" , wtimeout: 5000 }}, 
	(err, result) => {
		if(err){
			console.log(err);
		}
	});
	res.status(201).send();
})

router.delete('/gallery/:id', async (req, res) => {
	const gallery = await loadData('gallery');
	gallery.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, 
	{ writeConcern: { w: "majority" , wtimeout: 5000 }}, 
	(err, result) => {
		if(err){
			console.log(err);
		}
	});
	res.status(201).send();
})

//Mail requests
async function currentMail() {
	const mail_data = await loadData('company_mail');
	let data = await mail_data.find({}).toArray();
	mail_username = data[0].email;
	mail_pw = data[0].password;
}

router.post('/mail/contact', async(req, res) => {
	currentMail();
	const user_out = `
		<h1>Your mail has been received</h1>
		<h2>We will try to get back to you as soon as possible</h2>
	`

	const company_out = `
		<p>You have a new contact request</p>
		<h3>Contact Details</h3>
		<ul>
			<li>Name: ${req.body.name}</li>
			<li>Email: ${req.body.email}</li>
			<li>Contact: ${req.body.contact}</li>
		</ul>
		<h3>Message: </h3>
		<p>${req.body.message}</p>
	`;

	let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: mail_username, // generated ethereal user
      pass: mail_pw // generated ethereal password
	},
	tls: {
		rejectUnauthorized: false
	}
  });

  let mailOptions = {
    from: '"EVIT" <dhananjay.shettigar2252000@gmail.com>', // sender address
    to: mail_username, // list of receivers
    subject: "Nodemailer demo", // Subject line
    text: "Is this working?", // plain text body
    html: company_out, // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
	  if(error) {
		  return console.log(error);
	  }
	  console.log("Message sent: %s", info.messageId);
  });

  let mailOptionsUser = {
    from: '"EVIT" <dhananjay.shettigar2252000@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: "Nodemailer demo", // Subject line
    text: "Is this working?", // plain text body
    html: user_out // html body
  }
  	transporter.sendMail(mailOptionsUser, (error, info) => {
	 	 if(error) {
			console.log("Error recv");
			return res.status(200).json({ title: "Error" });
	  }
	  console.log("Message sent: %s", info.messageId);
	  res.status(200).json({ title: "Mail Sent!" });
  });
  
})

router.post('/mail/enquiry', async(req, res) => {
	currentMail();
	const user_out = `
		<h1>Your mail regarding ${req.body.product_name} has been received</h1>
		<h2>We will try to get back to you as soon as possible</h2>

	`

	const company_out = `
		<p>You have a new product request</p>
		<h3>Client Details</h3>
		<ul>
			<li>Name: ${req.body.client_name}</li>
			<li>Email: ${req.body.client_email}</li>
			<li>Contact: ${req.body.contact}</li>
		</ul>
		<h3>Product Details</h3>
		<h4>Product: ${req.body.product_name} </h3>
		<h4>Quantity: ${req.body.quantity} </h3>
		<h4>Product ID: ${req.body.product_id} </h3>
	`;

	let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: mail_username, // generated ethereal user
      pass: mail_pw // generated ethereal password
	},
	tls: {
		rejectUnauthorized: false
	}
  });

  let mailOptions = {
    from: '"EVIT" <dhananjay.shettigar2252000@gmail.com>', // sender address
    to: "dhanu.shettigar2252000@gmail.com", // list of receivers
    subject: "Nodemailer demo", // Subject line
    text: "Is this working?", // plain text body
    html: company_out, // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error) => {
	  if(error) {
			console.log("Error 1");
			console.log(error);
	  }
	  console.log("Message sent");
  });

  let mailOptionsUser = {
    from: '"EVIT" <dhananjay.shettigar2252000@gmail.com>', // sender address
    to: req.body.client_email, // list of receivers
    subject: "Product Enquiry", // Subject line
    text: `EVIT Product: ${req.body.product_name}`, // plain text body
    html: user_out // html body
  }
  	transporter.sendMail(mailOptionsUser, (error) => {
		if(error) {
			console.log("Error 2");
			console.log(error);
			res.status(200).json({ title: "error" });
			return;
		}
		console.log("Message sent: %s");
		res.status(200).json({ title: "Enquiry Sent!" });

  });
})	





//Access required Db collection
async function loadData(coll_name) {
	const mongo_link = await mongoose.connect(`${uri}/${db_name}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	mongo_link.connection.on(
		'error',
		console.log.bind(console, 'Connection error: ')
	);
	return mongo_link.connection.db.collection(coll_name);
}

module.exports = router;
