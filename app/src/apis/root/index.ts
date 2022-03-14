import * as express from 'express';
import * as ctrl from './root.ctrl';

const router: express.Router = express.Router();

router.post('./sign-up', ctrl.process.signUp);
// router.get('./login', ctrl.process.login);
// router.post('./change/password', ctrl.process.changePassword);
// router.post('./forgot/password', ctrl.process.forgotPassword);

export default router;
