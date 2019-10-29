const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const fs = require('fs');
const session = require('express-session');
const mongoose = require('mongoose');

const commonRoutes = require('./commonRoutes');
const sensitiveRoutes = require('./router/index');

const app = express();
const publicPath = path.resolve(__dirname, 'static');
mongoose.connect('mongodb://localhost:27017/test', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
app.use(session({
	secret: 'salt',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000},
}));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/static', express.static(publicPath));

app.use(commonRoutes);
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Methods', '*');
	// res.header('Content-Type', 'application/json;charset=UTF-8');

	if (req.method === 'OPTIONS') {
		// res.status(200).send('test');
		res.send(true);
	}
	else {
		next();	
	}
});	

app.all('*', (req, res, next) => {
	console.log(req.session.username)
	if (!req.session.username) {
		res.json({
			code: 403
		})
	} else {
		next();
	}
})
app.use(sensitiveRoutes);
// app.get('/user/logout', (req, res) => {
// 	req.session.username = null;
// 	res.json({
// 		code: 200,
// 	})
// });
// app.get('/user/info', function(req, res) {
// 	console.log(req.session.username);
//   res.end(JSON.stringify({
//     code: 200,
//     data: {
//       name: 'qez',
//       roles: ['admin']
//     },
//     update:'success'
//   }))
// });
// app.get('/article/getArticles', (req, res) => {
// 	const params = req.query;
// 	res.send(true);
// })

// app.post('/upload/article', function(req, res) {
// 	res.end(JSON.stringify({tets:'a'}));
// });
// app.post('/upload/image', function(req, res) {
// 	console.log(req.session);
// 	fs.writeFile(`./static/image/test.png`, req.body.base64, 'base64', (error)=> {
// 		error ? console.log('fail', error) : console.log('success');
// 	});
// 	res.end(JSON.stringify({code: 200, location:'/static/image/test.png'}));
// });

app.listen(3000, function() {
	console.log('listen at 3000');
});
