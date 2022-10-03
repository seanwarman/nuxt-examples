import Footer from '../components/Footer.vue'

export default {
  title: 'Footer',
  component: Footer,
}

export const footer = () => ({
  components: { Footer },
  template: `<Footer />`,
})
