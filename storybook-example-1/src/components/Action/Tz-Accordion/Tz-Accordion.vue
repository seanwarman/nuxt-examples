<template>
    <tz-button-drop-down class="tz-accordion" :button-align="buttonAlign" icon-rotate-degrees="rotate-180">
        <!-- heading content -->
        <template #heading>
            <span v-if="title" class="block font-semibold">
                {{ title }}
            </span>
        </template>
        <!-- icon -->
        <template #icon>
            <tz-chevron class="tz-accordion-icon" />
        </template>
        <!-- accordion content -->
        <template #body>
            <div v-html="content" class="font-light py-6"></div>
        </template>
    </tz-button-drop-down>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import TzButtonDropDown from '@/components/Action/Tz-ButtonDropDown/Tz-ButtonDropDown.vue'
import TzChevron from '@/components/Informational/Icons/Tz-Chevron/Tz-Chevron.vue'

export interface Props {
    title: string
    content: string
    buttonAlign?: 'start' | 'center' | 'end'
}

defineProps<Props>()
</script>

<style scoped>
.dropdown-container {
    border-width: 0 !important;
}

:deep .heading-container {
    @apply border-2 border-[#E3E5E3];
}

.tz-accordion-icon:deep(svg) {
    @apply rotate-90;
}
</style>
