import express from 'express';
import fs from 'fs';
import { Article, ArticleDocument } from '../models/article';
import {Columns, ColumnsDocument } from '../models/columns';
import { response } from '../utils';
import { finished } from 'stream';
import { User } from '../models/User';
import { GraphQLID, GraphQLObjectType, GraphQLString, graphql } from 'graphql'
import graphqlHTTP from 'express-graphql'
import { typeDef, resolvers } from '../schema';
import Schema from '../schema';

const ArticleList = new GraphQLObjectType({
  name: 'List',
  fields: {
    _id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    }
  }
})
function fnName(path: string) {
  const exp = /\/api\/(.*)/.exec(path);
  const [, name] = exp || [];
  return name;
}
const router = express.Router();
router.post(/\/api\/*/, function(req, res) {
  const { query, fields } = req.body.query || {};
  const queryString = Object.entries(query || {}).reduce((str, [key, value]) => {
    return str + `${key}: "${value}",`;
  }, '')
  const schema = {
    name: fnName(req.path),
    query: queryString,
    fields: fields.join(','),
  };
  const schemaStr = `{${schema.name}${schema.query ? `(${schema.query})`: ''}{${schema.fields}}}`;
  console.log('schema', schemaStr)
  graphql(Schema, schemaStr).then(({ data })=> {
    return response(res, 200, 200, '查询成功', data.getColumns)
  })
})

router.get('/user/logout', (req, res) => {
	req.session.username = null;
	res.json({
		code: 200,
	})
});
router.get('/user/info', function(req, res) {
  const {username} = req.session;
  if (!username) {
    response(res, 200, 403, '登录过期', {});
    return;
  }
  User.findOne({username}, (err, user) => {
    if (err || !user) {
      response(res);
    }
    const result = {
      roles: user.roles,
      config: user.config,
      username: user.username
    };
    response(res, 200, 200, '查询成功', result);
  })
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
  const skip = (Number(page) -1) * Number(pageSize);
  const limit = skip + parseInt(pageSize as string);
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
    response(res, 200, 200, '查询成功', article);
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
  const id = req.body._id;
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

router.post('/columns/list', function(req, res) {
  console.log('request: ', req.body)
  graphql(Schema, req.body.query).then(({ data })=> {
    console.log('router/index.ts:148', data)
    return response(res, 200, 200, '查询成功', data.getColumns)
  })
  // console.log('req:', req)
  // graphqlHTTP({ schema })(req, res).then(data => console.log('data:', data));
  // response(res, 200, 200, '查询成功', column);
  // Columns.find((err, column) => {
  //   if (err) {
  //     response(res);
  //   }
  //   response(res, 200, 200, '查询成功', column);
  // })
})

router.get('/columns/list', async (req, res) => {
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
  const skip = (Number(page) -1) * Number(pageSize);
  const limit = skip + parseInt(pageSize as string);
  let total = 0;
  await Columns.countDocuments(query, (err, count) => {
    if (err) {
      response(res);
      return false;
    }
    total = count;
    return true;
  });
  await Columns.find(query, null, {skip, limit, lean: true}, (err, article) => {

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

router.post('/columns', function(req, res) {
  const {_id} = req.body;
  if (_id) {
    Columns.update({_id}, {
      ...req.body,
      updateAt: Date.now(),
    }, err => {
      if (err) {
        response(res);
      }
      response(res, 200, 200, '修改成功');
    })
  } else {
    const newColumn = new Columns({...req.body });
    newColumn.save();
    response(res, 200, 200, '创建成功');
  }
})

router.get('/users', async function(req, res) {
  interface Query {
    username ?: RegExp,
    [key: string]: RegExp,
  };
  const {page, pageSize, ...conditions} = req.query;
  const query: Query = {};
  for (let key in conditions) {
    conditions[key] && (query[key] = new RegExp(`${conditions[key]}`));
  }
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = skip + parseInt(pageSize as string)
  let total = 0;
  await User.countDocuments(query, (err, count) => {
    if (err) {
      response(res);
      return false;
    }
    total = count;
    return true;
  })
  await User.find(query, null, {skip, limit, lean: true}, (err, user) => {
    if (err) {
      response(res);
    }
    response(res, 200, 200, '查询成功', user);
  })
})

module.exports = router;
