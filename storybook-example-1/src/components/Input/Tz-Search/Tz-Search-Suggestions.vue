<template>
  <div class="tz-search-suggestions">
    <ul class="tz-search-suggestions px-1" :class="classes">
      <li class="tz-search-suggestion" :key="index" v-for="(suggestion, index) of suggestions.slice(0, limit)">
        <tz-search-suggestion
          :term="suggestion.term"
          :logo="suggestion.logo"
          :category="suggestion.category"
          :link="suggestion.link"
        ></tz-search-suggestion>
      </li>
      <slot v-if="!suggestions.length" name="fetched-suggestions"></slot>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, toRefs } from 'vue';
import type { Suggestion } from './Tz-Search.types';
import TzSearchSuggestion from './Tz-Search-Suggestion/Tz-Search-Suggestion.vue';

export interface TzSearchSuggestionsProps {
  suggestions: Suggestion[];
  value: string;
  classes?: string;
  limit?: number;
}

const props = withDefaults(defineProps<TzSearchSuggestionsProps>(), {
  limit: 10
});

const { suggestions } = toRefs(props);
</script>
