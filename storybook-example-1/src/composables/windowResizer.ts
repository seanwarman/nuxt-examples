import { onMounted, onUnmounted, ref } from 'vue';

export default function windowResize() {
  const height = ref<number>(window.innerHeight);
  const width = ref<number>(window.innerWidth);

  const resize = () => {
    height.value = window.innerHeight;
    width.value = window.innerWidth;
  };

  onMounted(() => {
    resize();
    window.addEventListener('resize', resize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resize);
  });

  return { height, width };
}
