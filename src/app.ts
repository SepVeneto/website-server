import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import fs from 'fs';
import session from 'express-session';
import mongoose from 'mongoose';

import graphqlHTTP from 'express-graphql'

import commonRoutes from './commonRoutes';
import {typeDef, resolvers} from './schema';
import Schema from './schema';
// const log = (msg: string) => {process.stdout.write(msg)}
const sensitiveRoutes = require('./router/index');

const app = express();
const publicPath = path.resolve(__dirname, 'static');
import {Response, Request, NextFunction} from 'express';
mongoose.connect('mongodb://localhost:27017/website-server', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
app.use(session({
	secret: 'salt',
	resave: false,
	name: 'name',
	saveUninitialized: true,
	cookie: { maxAge: 600000},
}));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/static', express.static(publicPath));
app.use('/graphql', graphqlHTTP({
	schema: Schema,
	graphiql: true,
}))
app.all('*', function(req: Request, res: Response, next: NextFunction) {
	req.get('Origin')
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Methods', '*');
	// res.header('Content-Type', 'application/json;charset=UTF-8');

	// if (req.method === 'OPTIONS') {
		// res.status(200).send('test');
		// res.send(true);
	// }
	// else {
		next();	
	// }
});	
app.use(commonRoutes);

app.all('*', (req: Request, res: Response, next) => {
	console.log(req.session)
	if (!req.session.id) {
		res.json({
			code: 403
		})
	} else {
		next();
	}
})
app.use(sensitiveRoutes);

app.listen(3000, function() {
	console.log('listen at 3000');
	// log('listen at 3000');
});
