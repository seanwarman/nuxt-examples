<template>
  <div class="wrapper d-flex align-items-center justify-content-center">
    <img class="loading-wheel" src="/loadingwheel3.gif" />
  </div>
</template>

<script></script>

<style lang="scss">
.wrapper {
  width: 100%;
  height: 100vh;
}
.loading-wheel {
  width: 40px;
  height: 40px;
  filter: hue-rotate(240deg) brightness(1.1);
}
</style>
