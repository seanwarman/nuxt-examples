<template>
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9.67076" cy="9.67077" r="9" transform="rotate(129.568 9.67076 9.67077)" :fill="props.outline || '#2F2F2F'" />
    <mask id="mask0_0_1" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="1" y="1" width="17" height="17">
      <circle cx="9.67075" cy="9.67078" r="8" transform="rotate(129.568 9.67075 9.67078)" :fill="props.color1" />
    </mask>
    <g mask="url(#mask0_0_1)">
      <rect
        width="18.0061"
        height="18.0006"
        transform="matrix(-0.77087 -0.636993 0.643399 -0.765531 10.8804 22.2498)"
        :fill="props.color2"
      />
      <rect
        width="10"
        height="18.0006"
        transform="matrix(-0.77087 -0.636993 0.643399 -0.765531 4.71512 17.2509)"
        :fill="props.color1"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
export interface SelectIconProps {
  color1: string;
  color2: string;
  outline?: string;
}

const props = defineProps<SelectIconProps>();
</script>

<style scoped></style>
