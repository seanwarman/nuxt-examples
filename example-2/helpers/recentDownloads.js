import uniqWith from 'lodash.uniqwith'
import isEqual from 'lodash.isequal'

const RECENT_DOWNLOADS_KEY = 'DMRB_recentDownloads'
const MAX_RECENT_DOWNLOADS = 5

const getStore = () => {
  if (!process.browser) return []

  const store = localStorage.getItem(RECENT_DOWNLOADS_KEY)
  const parsedStore = store ? JSON.parse(store) : []
  return parsedStore
}

export const logRecentDownload = (url, title, nodeId) => {
  const store = getStore()
  const newStore = [{ url, title, nodeId }, ...store]
  const uniqueStore = uniqWith(newStore, isEqual).slice(0, MAX_RECENT_DOWNLOADS)
  localStorage.setItem(RECENT_DOWNLOADS_KEY, JSON.stringify(uniqueStore))
}

export const getRecentDownloads = () => {
  const store = getStore()
  return store.map((storeItem) => ({
    title: storeItem.title,
    link: `/dmrb/search/${storeItem.nodeId}` || '/',
  }))
}

export const clearRecentItems = () => {
  localStorage.removeItem(RECENT_DOWNLOADS_KEY)
}
