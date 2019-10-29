const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const response = require('../utils').response;

router.get('/user/logout', (req, res) => {
	req.session.username = null;
	res.json({
		code: 200,
	})
});
router.get('/user/info', function(req, res) {
	console.log(req.session.username);
  res.end(JSON.stringify({
    code: 200,
    data: {
      name: 'qez',
      roles: ['admin']
    },
    update:'success'
  }))
});
router.get('/article/getArticles', (req, res) => {
  const params = req.query;
  Article.find((err, article) => {
    if (err) {
      res.send(false);
    }
    response(res, 200, 200, '查询成功', {list: article})
  })
})

router.post('/upload/article', function(req, res) {
  const newArticle = new Article({...req.body});
  newArticle.save();
  res.end(JSON.stringify({tets:'a'}));
});
router.post('/upload/image', function(req, res) {
	console.log(req.session);
	fs.writeFile(`./static/image/test.png`, req.body.base64, 'base64', (error)=> {
		error ? console.log('fail', error) : console.log('success');
	});
	res.end(JSON.stringify({code: 200, location:'/static/image/test.png'}));
});

module.exports = router;
