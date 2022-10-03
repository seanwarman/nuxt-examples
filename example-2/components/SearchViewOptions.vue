<template>
  <div>
    <h2>View</h2>
    <b-form-group>
      <b-form-radio-group
        v-model="selected"
        class="w-100"
        :options="options"
        :aria-describedby="ariaDescribedby"
        button-variant="outline-primary"
        size="md"
        buttons
        v-on="$listeners"
      ></b-form-radio-group>
    </b-form-group>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    ariaDescribedby: { type: String, required: true },
  },
  data() {
    return { selected: this.value }
  },
  computed: {
    options() {
      return [
        { text: 'Expanded', value: 'expanded' },
        { text: 'Compact', value: 'compact' },
      ]
    },
  },
}
</script>
<style scoped>
h2 {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 2rem;
  flex: 1;
}
</style>
