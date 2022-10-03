<template>
  <div class="tz-rating" :aria-label="rating + ' of 5'">
    <!-- Heavily inspired by https://github.com/JonathanDn/vue-stars-rating/blob/master/star-rating.vue -->
    <div v-for="(star, index) in state.stars" :key="index" class="tz-rating-container">
      <svg
        class="star-svg"
        :style="`fill: url(#gradient${star.raw}); width: ${state.styleStarWidth}; height: ${state.styleStarHeight}`"
        stroke="#D31716"
        stroke-width="0.5"
        aria-hidden="true"
      >
        <polygon :points="getStarPoints" style="fill-rule: nonzero" />
        <defs>
          <!--
                      id has to be unique to each star fullness(dynamic offset) - it indicates fullness above
                    -->
          <linearGradient :id="`gradient${star.raw}`">
            <stop id="stop1" :offset="star.percent" stop-opacity="1" :stop-color="getFullFillColor(star)"></stop>
            <stop id="stop2" :offset="star.percent" stop-opacity="0" :stop-color="getFullFillColor(star)"></stop>
            <stop id="stop3" :offset="star.percent" stop-opacity="1" :stop-color="state.styleEmptyStarColor"></stop>
            <stop id="stop4" offset="100%" stop-opacity="1" :stop-color="state.styleEmptyStarColor"></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div v-if="isIndicatorActive" class="indicator">({{ totalReviews }})</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';

export type StarStyle = {
  fullStarColor?: string;
  emptyStarColor?: string;
  starWidth?: number;
  starHeight?: number;
};

export interface Props {
  rating?: number;
  totalReviews?: number;
  starStyle?: StarStyle;
  isIndicatorActive?: boolean;
}

const state = reactive({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stars: [] as any[],
  emptyStar: 0,
  fullStar: 1,
  totalStars: 5,
  styleStarWidth: 18,
  styleStarHeight: 18,
  styleEmptyStarColor: 'transparent',
  styleFullStarColor: '#D31716'
});

const props = defineProps<Props>();

const getStarPoints = computed(() => {
  let centerX = state.styleStarWidth / 2;
  let centerY = state.styleStarWidth / 2;
  let innerCircleArms = 5; // a 5 arms star
  let innerRadius = state.styleStarWidth / innerCircleArms;
  let innerOuterRadiusRatio = 2.5; // Unique value - determines fatness/sharpness of star
  let outerRadius = innerRadius * innerOuterRadiusRatio;

  return calcStarPoints(centerX, centerY, innerCircleArms, innerRadius, outerRadius);
});

function calcStarPoints(
  centerX: number,
  centerY: number,
  innerCircleArms: number,
  innerRadius: number,
  outerRadius: number
) {
  let angle = Math.PI / innerCircleArms;
  let angleOffsetToCenterStar = 60;
  let totalArms = innerCircleArms * 2;
  let points = '';
  for (let i = 0; i < totalArms; i++) {
    let isEvenIndex = i % 2 == 0;
    let r = isEvenIndex ? outerRadius : innerRadius;
    let currX = centerX + Math.cos(i * angle + angleOffsetToCenterStar) * r;
    let currY = centerY + Math.sin(i * angle + angleOffsetToCenterStar) * r;
    points += currX + ',' + currY + ' ';
  }
  return points;
}

function initStars() {
  for (let i = 0; i < state.totalStars; i++) {
    state.stars.push({
      raw: state.emptyStar,
      percent: state.emptyStar + '%'
    });
  }
}

function setStars() {
  let ratingsValue = props.rating !== undefined ? props.rating : 0;
  let fullStarsCounter = Math.floor(ratingsValue);

  for (let i = 0; i < state.stars.length; i++) {
    if (fullStarsCounter !== 0) {
      state.stars[i].raw = state.fullStar;
      state.stars[i].percent = calcStarFullness(state.stars[i]);
      fullStarsCounter--;
    } else {
      let surplus = Math.round((ratingsValue % 1) * 10) / 10;
      let roundedOneDecimalPoint = Math.round(surplus * 10) / 10;
      state.stars[i].raw = roundedOneDecimalPoint;
      return (state.stars[i].percent = calcStarFullness(state.stars[i]));
    }
  }
}

function getFullFillColor(starData: { raw: number }) {
  return starData.raw !== state.emptyStar ? state.styleFullStarColor : state.styleEmptyStarColor;
}

function calcStarFullness(starData: { raw: number }) {
  let starDataSorted = starData.raw * 100;
  let starFullnessPercent = Math.round(starDataSorted / 50) * 50 + '%';

  return starFullnessPercent;
}

onMounted(() => {
  initStars();
  setStars();
});
</script>

<style scoped>
.tz-rating {
  display: flex;
  align-items: center;
}

.indicator {
  @apply text-[12px] font-light text-[#696666];
}
.tz-rating-container {
  display: flex;
}
.tz-rating-container:not(:last-child) {
  margin-right: 5px;
}
</style>
