import api from '../controllers/api.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/national/summary', api.getNationalSummary)
router.get('/state/summary', api.getStateSummary)

export default router