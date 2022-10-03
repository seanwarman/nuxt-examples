import configItemToPairs from '../helpers/configItemToPairs'

const lifecycles = [
  { text: 'General Information', key: 'GENERAL_INFORMATION' },
  { text: 'Appraisal', key: 'APPRAISAL' },
  { text: 'Design', key: 'DESIGN' },
  { text: 'Construction', key: 'CONSTRUCTION' },
  { text: 'Maintenance & Operation', key: 'MAINTENANCE_AND_OPERATION' },
  { text: 'Inspection & Assessment', key: 'INSPECTION_AND_ASSESSMENT' },
  { text: 'Disposal', key: 'DISPOSAL' },
]

export default lifecycles

export const lifecyclesLut = lifecycles.reduce(configItemToPairs, [])
