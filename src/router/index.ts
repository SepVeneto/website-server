import express from 'express';
import fs from 'fs';
import { Article, ArticleDocument } from '../models/article';
import {Columns, ColumnsDocument } from '../models/columns';
import { response } from '../utils';

const router = express.Router();

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
router.get('/article/getArticles', async (req, res) => {
  interface Query {
    title?: RegExp,
    author?: RegExp,
    columns?: RegExp,
    [key: string]: RegExp,
  };
  const {page, pageSize, ...conditions}= req.query;
  // const {title, author, columns} = JSON.parse(conditions);
  const query: Query = {};
  for (let key in conditions) {
    if (conditions[key]) {
      query[key] = new RegExp(`${conditions[key]}`);
    }
  }
  const skip = (page-1) * pageSize;
  const limit = skip + parseInt(pageSize);
  let total = 0;
  await Article.countDocuments(query, (err, count) => {
    if (err) {
      response(res);
      return false;
    }
    total = count;
    return true;
  });
  await Article.find(query, null, {skip, limit, lean: true}, (err, article) => {

  // Article.find((err, article) => {
    if (err) {
      response(res);
    }
    const result = {
      total,
      list: article,
    }
    response(res, 200, 200, '查询成功', result);
  })
})

router.get('/article', function(req, res) {
  const {id} = req.query;
  Article.findOne({_id: id}, (err, article) => {
    if (err) {
      response(res);
    }
    response(res, 200, 200, '查询成功', {data: article});
  })
})
router.delete('/article', function(req, res) {
  const {id} = req.query;
  Article.deleteOne({_id: id}, err => {
    if (err) {
      response(res);
    }
    response(res, 200, 200, '删除成功', '');
  })
})

router.post('/upload/article', function(req, res) {
  const id = req.body.id;
  if (id) {
    Article.update({_id: id}, {
      ...req.body,
      updateAt: Date.now(),
    }, err => {
      if (err) {
        response(res);
      }
      response(res, 200, 200, '修改成功');
    })
  } else {
    const newArticle = new Article({...req.body, author: req.session.username});
    newArticle.save();
    response(res, 200, 200, '创建成功');
  }
});
router.post('/upload/image', function(req, res) {
	console.log(req.session);
	fs.writeFile(`static/image/test.png`, req.body.base64, 'base64', (error)=> {
		error ? console.log('fail', error) : console.log('success');
	});
	res.end(JSON.stringify({code: 200, location:'static/image/test.png'}));
});

router.get('/article/getColumns', function(req, res) {
  Columns.find((err, column) => {
    if (err) {
      response(res);
    }
    response(res, 200, 200, '查询成功', column);
  })
})

module.exports = router;
