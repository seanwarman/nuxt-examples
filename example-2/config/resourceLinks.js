import updatesIcon from '../assets/icons/documentupdates-icon.svg?inline'
import indexIcon from '../assets/icons/documentindex-icon.svg?inline'
import archiveIcon from '../assets/icons/documentarchive-icon.svg?inline'
import helpIcon from '../assets/icons/dmrbhelp-icon.svg?inline'

const icons = {
  updatesIcon,
  indexIcon,
  archiveIcon,
  helpIcon,
}

export const resourceLinks = [
  {
    title: 'Document updates',
    link: '/updates',
    icon_name: 'updatesIcon',
    dynamic: true,
    updatedContent: {
      text: 'A new publication is available',
    },
  },
  {
    title: 'View the GG 000 Index',
    link: '/search?q=gg%20000&pageNumber=1',
    icon_name: 'indexIcon',
    dynamic: false,
    updateContent: {},
  },
  {
    title: 'Archived documents',
    link: '/archive',
    icon_name: 'archiveIcon',
    dynamic: false,
    updateContent: {},
  },
  {
    title: 'DMRB Help',
    link: '/help',
    icon_name: 'helpIcon',
    dynamic: false,
    updateContent: {},
  },
]

export function resourceIcon(name) {
  return icons[name] || null
}
