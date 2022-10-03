import StoryRouter from 'storybook-vue-router'

import Header from '../components/Header.vue'

export default {
  title: 'Main Navigation',
  component: Header,
  decorators: [StoryRouter()],
}

export const header = () => ({
  components: { Header },
  template: `<Header />`,
})
