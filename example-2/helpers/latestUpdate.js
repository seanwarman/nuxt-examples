const LAST_LATEST_UPDATE_TITLE = 'DMRB_lastLatestTitle'

export const logLatestUpdateViewed = (title) => {
  localStorage.setItem(LAST_LATEST_UPDATE_TITLE, title)
}

export const getLastUpdateViewed = (title) => {
  return process.browser ? localStorage.getItem(LAST_LATEST_UPDATE_TITLE) : null
}
