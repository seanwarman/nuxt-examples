<template>
    <div class="tz-review border-[#DDD] border p-3 py-6">
        <div class="star-rating rounded-md background bg-zinc-100 px-3 py-4">
            <tz-row :cols="2">
                <tz-col class="self-center">
                    <tz-rating :rating="reviews.score" :total-reviews="reviews.count"></tz-rating>
                </tz-col>
                <tz-col class="justify-self-end">
                    <span class="score inline-block uppercase ml-4">{{ reviews.score }} out of 5</span>
                </tz-col>
            </tz-row>
        </div>
        <div class="review-content">
            <span class="text-center block p-4">
                Average from <strong>{{ reviews.count }}</strong> customer reviews
            </span>
            <blockquote v-html="content"></blockquote>
            <div class="tagline py-2 text-[#696969]">
                <span class="author">{{ tagline }}</span>
            </div>
        </div>
        <tz-link :link="link" class="block text-right underline">Read all reviews</tz-link>
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

import TzRating from '@/components/Informational/Tz-Rating/Tz-Rating.vue'
import TzLink from '@/components/Action/Tz-Link/Tz-Link.vue'
import TzRow from '@/components/Structural/Tz-Row/Tz-Row.vue'
import TzCol from '@/components/Structural/Tz-Col/Tz-Col.vue'

import type { Link } from '@/components/Informational/types'
import type { Reviews } from '@/components/Informational/Tz-Product-Tile/Tz-Product-Tile.types';

export interface Review {
    reviews: Reviews
    content: string
    author: string
    timestamp: {
        amount: number,
        unit: string
    }
    link: Link
}

const tagline = computed(() => {
    const name = props.author || 'anonymous'
    return `${name}, purchased ${props.timestamp.amount} ${props.timestamp.unit} ago`
})

const props = defineProps<Review>()

</script>

<style scoped>
blockquote:before {
    content: open-quote;
}
blockquote:after {
    content: close-quote;
}
</style>