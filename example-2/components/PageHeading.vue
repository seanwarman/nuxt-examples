<template>
  <h1 id="main-heading" tabindex="-1"><slot /></h1>
</template>

<style lang="scss" scoped>
h1 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;

  @media screen and (min-width: $breakpoint-md) {
    font-size: 2.5rem;
  }
}
</style>
