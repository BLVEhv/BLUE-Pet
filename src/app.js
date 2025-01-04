import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { connect } from './configs/connectDB.js';
import 'dotenv/config';
import userRouter from './routes/user.router.js';
import authRouter from './routes/auth.router.js';
import adminRouter from './routes/admin.router.js';
import passport from 'passport';
import checkRoleMiddleware from './middleware/role.js';
import compression from 'compression';
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connect();

app.use('/auth', authRouter);

app.use(
	'/admin',
	passport.authenticate('jwt', { session: false }),
	checkRoleMiddleware(['admin']),
	adminRouter,
);

app.use(
	'/user',
	passport.authenticate('jwt', { session: false }),
	checkRoleMiddleware(['user']),
	userRouter,
);

app.get('', (req, res) => {
	res.json({ msg: 'Hello world with BLUE Pet' });
});

app.use((req, res, next) => {
	const error = new Error('Not found!');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	const statusCode = error.status || 500;
	return res.status(statusCode).json({
		status: 'error',
		code: statusCode,
		message: error.message || 'Internal server error!',
	});
});

export default app;
