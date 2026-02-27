import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../docs/swagger.js';
import healthRouter from './health.route.js';
const router = Router();
router.use('/health', healthRouter);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.get('/docs.json', (_req, res) => res.json(swaggerDocument));
export { router as routes };
//# sourceMappingURL=index.js.map