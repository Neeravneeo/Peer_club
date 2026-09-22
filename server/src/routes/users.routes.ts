import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { getMe, updateMe, changePassword, deleteAccount } from '../controllers/users.controller'

const router = Router()

router.use(requireAuth)

router.get('/me', getMe)
router.patch('/me', updateMe)
router.post('/me/change-password', changePassword)
router.delete('/me', deleteAccount)

export default router
