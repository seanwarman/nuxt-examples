const USER_SETTINGS_KEY = 'DMRB_userSettings'

const getStore = () => {
  const emptyStore = '{}'
  let store = emptyStore
  try {
    store = localStorage.getItem(USER_SETTINGS_KEY)
  } catch (e) {
    return {}
  }
  return JSON.parse(store || emptyStore)
}

export const setListViewStyle = (value) => {
  const store = getStore()
  const newStore = { ...store, listViewStyle: value }
  localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(newStore))
}
export const getListViewStyle = () => {
  const store = getStore()
  return store.listViewStyle || ''
}
