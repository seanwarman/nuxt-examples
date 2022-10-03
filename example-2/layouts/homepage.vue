<template>
  <div>
    <Header />

    <Breadcrumbs />

    <nuxt />

    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header'
import Footer from '../components/Footer'
import Breadcrumbs from '../components/Breadcrumbs'

export default {
  components: {
    Header,
    Footer,
    Breadcrumbs,
  },
}
</script>
