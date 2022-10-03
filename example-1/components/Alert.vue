<template>
  <div :class="`dbw-alert ${variant ? variant : ''} d-flex flex-row mb-3`">
    <img
      v-if="variant"
      class="dbw-alert-icon mr-3"
      :src="
        displayIcon
          ? require(`~/assets/icons/${
              variant === 'danger' || variant === 'warning'
                ? 'exclamation-triangle-solid.svg'
                : variant === 'success'
                ? 'check-circle-solid.svg'
                : (displayIcon = false)
            }`)
          : ''
      "
    />
    <div class="d-block">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      displayIcon: true,
    };
  },
};
</script>

<style lang="scss">
.dbw-alert {
  padding: 16px;
  border-radius: 2px;
  font-weight: 800;
  &.warning {
    background-color: $dbw-yellow;
    color: $dbw-black;
    .dbw-alert-icon {
      filter: invert(0.2);
    }
  }
  &.success {
    background-color: $dbw-green;
    color: $dbw-white;
    .dbw-alert-icon {
      filter: invert(1);
    }
  }
  &.danger {
    background: $dbw-red;
    color: $dbw-white;
    .dbw-alert-icon {
      filter: invert(1);
    }
  }
}
.dbw-alert-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}
</style>
