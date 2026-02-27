import { getHealthStatus } from '../services/health.service.js';
function getHealth(_req, res) {
    const payload = getHealthStatus();
    res.status(200).json(payload);
}
export { getHealth };
//# sourceMappingURL=health.controller.js.map