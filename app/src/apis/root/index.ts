import * as express from 'express';
import ctrl from './root.ctrl';

const router: express.Router = express.Router();

router.post('./sign-up', ctrl.process.signUp);

export default router;
