<template>
  <div>
    <Header />

    <Breadcrumbs />

    <b-container>
      <b-row>
        <b-col>
          <nuxt />
        </b-col>
      </b-row>
    </b-container>

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
