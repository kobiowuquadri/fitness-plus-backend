import express from 'express'
import { createMembership } from '../controllers/membership-controllers.js'
export const membershipRoutes = express.Router()

membershipRoutes.post('/membership', createMembership)

