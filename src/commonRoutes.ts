import express from 'express';
import { User, UserDocument } from './models/user';

const router = express.Router();

router.post('/user/login', (req, res) => {
  const {username, password} = req.body;
  req.session.username = username;
  res.json({
    code: 200,
    roles: ['admin'],
  })
})
router.post('/user/signup', (req, res, next) => {
	const {username, password} = req.body;
	User.findOne({ username }, (err, user) => {
		if (err) {
			return next(err);
		}
		if (user) {
			return res.json({
				code: 200,
				message: '用户已存在',
			})
		}
		const newUser = new User({
			username, password
		});
		newUser.save(next);
	})
})

export default router;