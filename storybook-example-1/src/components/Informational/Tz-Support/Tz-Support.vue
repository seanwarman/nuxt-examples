<template>
  <li class="tz-support grid w-full grid-cols-[63px_1fr] p-1" ref="tzsupport" :class="sizeControl">
    <img class="row-span-2 h-[53px] w-full w-[61px] rounded-[3px] object-cover" :src="image.src" :alt="image.alt" />

    <h4 class="support-text mb-1.5 text-sm">
      <a :href="content.link.url" :target="content.link.target" class="tz-support-link outline-0 line-clamp-2">
        <span>{{ content.title }}</span>
      </a>
    </h4>
    <p class="support-text mb-0 text-[10px] text-gray-500">
      {{ content.content }}
    </p>
  </li>
</template>

<script setup lang="ts">
import { toRefs, computed, onMounted, ref } from 'vue';

export type Link = {
  url: string;
  target?: string;
};

export type Content = {
  title: string;
  content: string;
  link: Link;
};

export type Image = {
  src: string;
  alt?: string;
};

export type Size = 'small' | 'large';

export interface Props {
  size?: Size;
  image: Image;
  content: Content;
}

const tzsupport = ref(null);

const props = defineProps<Props>();

const sizeControl = computed(() => {
  return {
    supportDefault: props.size === 'small',
    supportLarge: props.size === 'large'
  };
});

const accessibleCards = () => {
  let parent = tzsupport.value as HTMLDivElement | null;

  let link = parent?.querySelector<HTMLAnchorElement>('a');

  if (link) {
    parent?.addEventListener('click', function (e) {
      window.location.href = content.value.link.url;
      e.preventDefault();
    });

    parent?.classList.add('linkify');

    link.addEventListener('focus', function () {
      parent?.classList.add('isfocused');
    });

    link.addEventListener('blur', function () {
      parent?.classList.remove('isfocused');
    });
  }
};

onMounted(() => {
  accessibleCards();
});

const { image, content } = toRefs(props);
</script>

<style>
.tz-support-link:focus > span {
  @apply tracking-normal;
}

.linkify:hover .tz-support-link > span {
  @apply tracking-normal underline underline-offset-4;
  text-shadow: 1px 0 0 currentColor;
}

.tz-support-link:focus > span {
  text-shadow: 1px 0 0 currentColor;
}

.support-text {
  @apply pl-[17px] font-normal;
}

.supportDefault {
  @apply max-w-[260px];
}

.supportLarge {
  @apply max-w-[442.5px];
}

.tz-support > * a {
  display: block;
}

.tz-support h2 > a {
  text-decoration: none;
  color: inherit;
}

.linkify:hover {
  cursor: pointer;
  @apply bg-slate-100;
}

.tz-support.isfocused {
  @apply outline-0;
}

.isfocused a:focus {
  outline: none;
}
</style>
