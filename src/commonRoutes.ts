import express from 'express';
import crypto from 'crypto';
import { User, UserDocument } from './models/User';
import {response} from './utils';

const router = express.Router();
function encryption(password: string) :string {
	const salt = 'veneto';
	const md5 = crypto.createHmac('sha256', salt);
	// const unencryptedString = salt + md5;
	md5.update(password);
	return md5.digest('hex');
}
router.post('/user/login', (req, res) => {
  const {username, password} = req.body;
	req.session.username = username;
	// console.log(req.cookies);
	const encryptePaw = encryption(password);
	try {
		User.findOne({username, password: encryptePaw}, (err, user) => {
			if (err) {
				response(res);
			}
			console.log(user);
			if (!user) {
				console.log('enter')
				response(res, 200, 403, '用户名或密码错误', {});
			} else {
				// const result = {
				// 	roles: user.roles
				// };
				response(res, 200, 200, '登录成功', {token: req.sessionID});
			}
		})
	} catch(err) {
		response(res);
		console.error(err);
	}
})
router.post('/user/signup', (req, res, next) => {
	const {username, password} = req.body;
	User.findOne({ username }, (err, user) => {
		if (err) {
			return next(err);
		}
		if (user) {
			response(res, 200, 200, '用户已存在');
		}
		const newUser = new User({
			username, 
			password: encryption(password),
		});
		newUser.save(next);
		response(res, 200, 200, '注册成功');
	})
})

export default router;