<template>
  <section class="video-box__container relative" aria-labelledby="video-content">
    <div class="p-10">
      <tz-row :cols="1">
        <tz-col>
          <span class="tag-title">{{ title }}</span>
          <tz-row :cols="3" :sm="1" class="gap-x-10 md:pl-20 lg:pl-36">
            <tz-col class="video-information">
              <tz-row :cols="1" class="h-full content-center" :gap="5">
                <tz-col>
                  <h2 class="video-title text-xl lg:text-4xl lg:text-[32px]">
                    {{ heading }}
                  </h2>
                </tz-col>
                <tz-col>
                  <time :datetime="`PT${video.length}S`">{{ durationTime }}</time>
                </tz-col>
                <tz-col>
                  <p class="video-description text-[#696666]">
                    {{ video.description }}
                  </p>
                </tz-col>
              </tz-row>
            </tz-col>
            <tz-col :span="2" class="relative">
              <tz-responsive-image :media="video.placeholder"></tz-responsive-image>
              <div class="absolute inset-0 h-full w-full">
                <div class="flex h-full">
                  <div class="m-auto">
                    <tz-button @click="watchVideo" size="md" theme="light" class="btn-watch">Watch</tz-button>
                  </div>
                </div>
              </div>
            </tz-col>
          </tz-row>
        </tz-col>
      </tz-row>
    </div>
    <!-- youtube iframe with progressive enhancement (extra queries after the url to optimize the embed) -->
    <div v-if="state.videoActive" class="video_overlay absolute inset-0 h-full w-full">
      <tz-button @click="closeVideo" class="float-right m-0" size="sm" theme="dark"><tz-close-icon /></tz-button>
      <div class="flex h-full">
        <div class="container m-auto">
          <vue-plyr v-if="video.src.youtube_id">
            <div class="plyr__video-embed">
              <iframe
                :src="`https://www.youtube.com/embed/${video.src.youtube_id}?amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`"
                allowfullscreen
                allowtransparency
                allow="autoplay"
              ></iframe>
            </div>
          </vue-plyr>
          <vue-plyr v-else>
            <video controls crossorigin="true" playsinline>
              <source size="720" :src="video.src.url" type="video/mp4" />
              <track
                v-if="video.src.captions"
                default
                kind="captions"
                label="English captions"
                :src="video.src.captions"
                srclang="en"
              />
            </video>
          </vue-plyr>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import TzRow from '@/components/Structural/Tz-Row/Tz-Row.vue';
import TzCol from '@/components/Structural/Tz-Col/Tz-Col.vue';
import TzResponsiveImage from '../Tz-ResponsiveImage/Tz-ResponsiveImage.vue';
import TzButton from '@/components/Action/Tz-Button/Tz-Button.vue';
import TzCloseIcon from '../Icons/Tz-Close-Icon.vue';

import type { Image, Media } from '../types';

import VuePlyr from './VuePlyr.vue';

import { computed, reactive } from 'vue';

export type Video = {
  src: VideoSrc;
  length: number;
  description: string;
  placeholder: Media[];
};

export type VideoSrc = {
  url: string;
  youtube_id: string;
  captions: string | null;
};

export interface VideoContent {
  title: string;
  heading: string;
  video: Video;
}

const props = defineProps<VideoContent>();

const state = reactive({
  videoActive: false
});

const durationTime = computed(() => {
  const seconds = 160;
  return new Date(seconds * 1000).toISOString().slice(14, 19);
});

const watchVideo = () => {
  state.videoActive = true;
};

const closeVideo = () => {
  state.videoActive = false;
};
</script>

<style scoped>
.video-box__container {
  background: #f5f6f4;
}

.video_overlay {
  background: rgba(43, 41, 41, 0.8);
}

.btn-watch {
  @apply rounded-3xl font-bold uppercase;
}
</style>
