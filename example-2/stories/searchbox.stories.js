import StoryRouter from 'storybook-vue-router'

import SearchBox from '../components/SearchBox.vue'

export const defaultSearchBox = () => ({
  components: { SearchBox },
  template: `<SearchBox accessible-label="Search the DMRB" id="search-box" />`,
})

export const searchBoxWithIcon = () => ({
  components: { SearchBox },
  template: `<SearchBox with-icon accessible-label="Search the DMRB" id="search-box2" />`,
})

export const overrideSubmit = () => ({
  components: { SearchBox },
  template: `<SearchBox with-icon :onSubmit="handleSubmit" accessible-label="Search the DMRB" id="search-box3" />`,
  methods: {
    handleSubmit() {
      alert('This came from the override')
    },
  },
})

export default {
  title: 'Search Box',
  component: SearchBox,
  decorators: [StoryRouter()],
}
