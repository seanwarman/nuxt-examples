<template>
  <div
    class="app-contents-row"
    @click="
      $router.push(
        `/self-build-wales/detailed-application/page-${data.Index + 3}`
      )
    "
  >
    <p v-if="data.Complete" class="status complete">Complete</p>
    <p v-else class="status">Incomplete</p>
    <h5 class="title font-weight-bold mb-1">{{ data.Title }}</h5>
    <p class="mb-1">{{ data.SubTitle }}</p>
    <p class="subtext">{{ data.SubText }}</p>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      Complete: Boolean,
      Title: String,
      SubTitle: String,
      SubText: String,
      Index: Number,
    },
  },
};
</script>

<style lang="scss">
.app-contents-row {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  position: relative;
  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom: none;
  }
  &:hover {
    background-color: rgb(241, 241, 241);
    cursor: pointer;
  }
  p {
    margin: 0;
  }
  .title {
    margin-right: 110px;
  }
  .status {
    position: absolute;
    right: 15px;
    &.complete {
      color: green;
    }
  }
  .subtext {
    font-size: 13px;
    color: #868e96;
  }
}
</style>
