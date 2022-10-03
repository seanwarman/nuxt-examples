export const state = () => ({
  latestPublicationData: null,
})

export const mutations = {
  setData(state, data) {
    state.latestPublicationData = data
  },
}

export const actions = {
  async getLatestPublication({ commit, state }) {
    if (!state.latestPublicationData) {
      const { data } = await this.$axios.get(
        `/publication-summaries/latest?suites=DMRB`
      )
      if (data && data.DMRB) {
        commit('setData', data.DMRB)
      }
    }
  },
}

export const getters = {
  latestPublicationTitle(state) {
    return (
      state.latestPublicationData &&
      state.latestPublicationData.publicationTitle
    )
  },
}
