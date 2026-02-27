import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { routes } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
function createApp() {
    const app = express();
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('combined'));
    app.use('/api', routes);
    app.use(notFoundHandler);
    app.use(errorHandler);
    return app;
}
export { createApp };
//# sourceMappingURL=app.js.map