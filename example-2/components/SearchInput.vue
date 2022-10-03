<template>
  <b-input-group>
    <b-input-group-prepend v-if="withIcon" is-text>
      <button type="submit" class="search-button" aria-label="Search">
        <b-icon icon="search"></b-icon>
      </button>
    </b-input-group-prepend>

    <b-form-input
      :id="id"
      ref="input"
      :value="searchTerm"
      type="search"
      :class="{ 'with-icon': withIcon }"
      :placeholder="placeholder"
      inputmode="search"
      :autocomplete="autocomplete"
      :aria-describedby="ariaDescribedby"
      @focus="focus"
      @blur="blur"
      @input="input"
    ></b-form-input>
  </b-input-group>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Search...',
    },
    withIcon: {
      type: Boolean,
      default: false,
    },
    id: { type: String, default: undefined },
    searchTerm: { type: String, default: '' },
    autocomplete: { type: String, default: undefined },
    ariaDescribedby: { type: String, default: undefined },
  },
  methods: {
    focus(e) {
      this.$emit('focus', e)
    },
    blur(e) {
      this.$emit('blur', e)
    },
    input(e) {
      this.$emit('input', e)
    },
  },
}
</script>

<style lang="scss" scoped>
.input-group-text {
  border-right: 0;
  background-color: #fff;
  padding: 0;
  display: flex;
  align-items: stretch;
  z-index: 1;
}

.form-control.with-icon {
  border-left: 0;
}

.form-control.with-icon:focus {
  box-shadow: none;
}

.with-icon.is-focused .input-group-text {
  border-color: $input-focus-border-color;
}

.search-button {
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0 12px;
  margin: 0;
  color: #222;
  opacity: 0.69; // nice

  &:hover,
  &:active {
    opacity: 1;
  }
}
</style>
