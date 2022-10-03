<template>
  <div>
    <Header />

    <Breadcrumbs />

    <b-container>
      <b-row>
        <b-col>
          <Page>
            <nuxt />
          </Page>
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
import Page from '../components/Page'

export default {
  components: {
    Header,
    Footer,
    Breadcrumbs,
    Page,
  },
}
</script>
