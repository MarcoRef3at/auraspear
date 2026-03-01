import { dashboardHandlers } from './dashboard.handlers'
import { alertHandlers } from './alert.handlers'
import { caseHandlers } from './case.handlers'
import { huntHandlers } from './hunt.handlers'
import { intelHandlers } from './intel.handlers'
import { adminHandlers } from './admin.handlers'
import { authHandlers } from './auth.handlers'

export const handlers = [
  ...dashboardHandlers,
  ...alertHandlers,
  ...caseHandlers,
  ...huntHandlers,
  ...intelHandlers,
  ...adminHandlers,
  ...authHandlers,
]
