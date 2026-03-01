import { adminHandlers } from './admin.handlers'
import { alertHandlers } from './alert.handlers'
import { authHandlers } from './auth.handlers'
import { caseHandlers } from './case.handlers'
import { dashboardHandlers } from './dashboard.handlers'
import { huntHandlers } from './hunt.handlers'
import { intelHandlers } from './intel.handlers'

export const handlers = [
  ...dashboardHandlers,
  ...alertHandlers,
  ...caseHandlers,
  ...huntHandlers,
  ...intelHandlers,
  ...adminHandlers,
  ...authHandlers,
]
