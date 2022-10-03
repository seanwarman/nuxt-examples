<template>
  <div>
    <h1 v-if="error.statusCode === 404" id="main-heading" tabindex="-1">
      Sorry, this page isn’t available
    </h1>
    <h1 v-else id="main-heading" tabindex="-1">An error occurred</h1>

    <p v-if="error.statusCode === 404">
      The page you’re looking for doesn’t exist. Error 404.
    </p>
    <p v-else>Error: {{ error.message }}</p>

    <div>
      <Button to="/">DMRB Home</Button>
    </div>
  </div>
</template>

<script>
import Button from '../components/Button'

export default {
  components: {
    Button,
  },
  layout: 'default',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  head() {
    return {
      title: `Error ${this.error.statusCode}`,
      meta: [
        {
          name: 'robots',
          content: 'noindex',
        },
      ],
    }
  },
}
</script>
