import infoIcon from '../assets/icons/info-circle-solid.svg?inline'
import enviraIcon from '../assets/icons/envira-brands.svg?inline'
import lightingIcon from '../assets/icons/lighting-icon.svg?inline'
import roadIcon from '../assets/icons/road-solid.svg?inline'
import roadLayoutIcon from '../assets/icons/road-layout-icon.svg?inline'
import trafficlightIcon from '../assets/icons/traffic-light-solid.svg?inline'
import bridgeIcon from '../assets/icons/bridges-structures-icon.svg?inline'
import drainageIcon from '../assets/icons/tint-solid.svg?inline'
import geotechnicsIcon from '../assets/icons/geotechnics-icon.svg?inline'

import configItemToPairs from '../helpers/configItemToPairs'
import { SEARCH_PATH } from './paths'

export const GENERAL_PRINCIPLES_AND_SCHEME_GOVERNANCE =
  'GENERAL_PRINCIPLES_AND_SCHEME_GOVERNANCE'
export const SUSTAINABILITY_AND_ENVIRONMENT = 'SUSTAINABILITY_AND_ENVIRONMENT'
export const ROAD_LAYOUT = 'ROAD_LAYOUT'
export const PAVEMENT = 'PAVEMENT'
export const HIGHWAY_STRUCTURES_AND_BRIDGES = 'HIGHWAY_STRUCTURES_AND_BRIDGES'
export const DRAINAGE = 'DRAINAGE'
export const GEOTECHNICS = 'GEOTECHNICS'
export const CONTROL_AND_COMMUNICATIONS_TECHNOLOGY =
  'CONTROL_AND_COMMUNICATIONS_TECHNOLOGY'
export const ROAD_LIGHTING = 'ROAD_LIGHTING'

const icons = {
  infoIcon,
  enviraIcon,
  lightingIcon,
  roadIcon,
  roadLayoutIcon,
  trafficlightIcon,
  bridgeIcon,
  drainageIcon,
  geotechnicsIcon,
}

const disciplines = [
  {
    text: 'General Principles & Scheme Governance',
    description:
      'General provisions for highway projects, applicable to all disciplines contained in this document set.',
    to: `${SEARCH_PATH}?discipline=${GENERAL_PRINCIPLES_AND_SCHEME_GOVERNANCE}`,
    icon: infoIcon,
    key: GENERAL_PRINCIPLES_AND_SCHEME_GOVERNANCE,
  },
  {
    text: 'Sustainability & Environment',
    description:
      'Environmental assessment and design requirements for the delivery of motorways and all-purpose trunk road projects. Sustainable development requirements are captured within General Principles & Scheme Governance ',
    to: `${SEARCH_PATH}?discipline=${SUSTAINABILITY_AND_ENVIRONMENT}`,
    icon: enviraIcon,
    key: SUSTAINABILITY_AND_ENVIRONMENT,
  },
  {
    text: 'Road Layout',
    description: 'Life-cycle provisions related to highway geometry.',
    to: `${SEARCH_PATH}?discipline=${ROAD_LAYOUT}`,
    icon: roadLayoutIcon,
    key: ROAD_LAYOUT,
  },
  {
    text: 'Pavement',
    description: 'Life-cycle provisions related to highway pavements.',
    to: `${SEARCH_PATH}?discipline=${PAVEMENT}`,
    icon: roadIcon,
    key: PAVEMENT,
  },
  {
    text: 'Highway Structures & Bridges',
    description:
      'Life-cycle provisions related to highway structures, including bridges and footbridges, bridge components, signals gantries, road restraint systems, and tunnels.',
    to: `${SEARCH_PATH}?discipline=${HIGHWAY_STRUCTURES_AND_BRIDGES}`,
    icon: bridgeIcon,
    key: HIGHWAY_STRUCTURES_AND_BRIDGES,
  },
  {
    text: 'Drainage',
    description: 'Life-cycle provisions related to highway drainage systems.',
    to: `${SEARCH_PATH}?discipline=${DRAINAGE}`,
    icon: drainageIcon,
    key: DRAINAGE,
  },
  {
    text: 'Geotechnics',
    description:
      'Life-cycle provisions related to highway geotechnical assets.',
    to: `${SEARCH_PATH}?discipline=${GEOTECHNICS}`,
    icon: geotechnicsIcon,
    key: GEOTECHNICS,
  },
  {
    text: 'Control & Communications Technology',
    description:
      'Life-cycle provisions related to roadside technology and communications, including CCTV, electricity connections, telecommunication services and traffic signalling systems.',
    to: `${SEARCH_PATH}?discipline=${CONTROL_AND_COMMUNICATIONS_TECHNOLOGY}`,
    icon: trafficlightIcon,
    key: CONTROL_AND_COMMUNICATIONS_TECHNOLOGY,
  },
  {
    text: 'Road Lighting',
    description: 'Life-cycle provisions related to highway lighting.',
    to: `${SEARCH_PATH}?discipline=${ROAD_LIGHTING}`,
    icon: lightingIcon,
    key: ROAD_LIGHTING,
  },
]

export default disciplines

export const disciplinesLut = disciplines.reduce(configItemToPairs, [])
export function disciplineIcon(name) {
  return icons[name] || null
}
