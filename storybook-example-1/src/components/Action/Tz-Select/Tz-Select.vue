<template>
  <div ref="tzSelectParent" @focusout="onSelectFocusOut">
    <div class="tz-select-container relative inline w-full">
      <!-- controls -->
      <button
        data-test="tz-select-button"
        id="tzSelectButton"
        tabindex="0"
        ref="selectButton"
        @click="state.visible = !state.visible"
        @keydown.down="onFocusOptionsOpen"
        class="inline-flex w-full items-center justify-between gap-0 rounded-[5px] border p-1 focus:border-dark focus:ring-0 overflow-hidden"
        :class="[
          state.visible ? 'ring-0' : 'focus-within:ring',
          sizeVariation?.border,
          sizeVariation?.fontSize,
          sizeVariation?.selectHeight
        ]"
      >
        <!-- value content -->
        <div>
          <span
            data-test="tz-select-icon"
            class="block flex items-center whitespace-nowrap py-1 leading-3"
            :class="sizeVariation.padding"
          >
            <span v-if="props.colorIcons" class="mr-1">
              <tz-select-icon
                v-if="state.selected?.colorIcon"
                :color1="state.selected?.colorIcon.color1"
                :color2="state.selected?.colorIcon.color2"
                class="scale-1"
              />
            </span>
            {{ state.selected?.name }}
          </span>
        </div>
        <!-- button section -->
        <div
          data-test="tz-select-chevron-wrapper"
          :class="[sizeVariation?.divider, sizeVariation.chevronPadding, sizeVariation.chevronPosition]"
        >
          <div class="transition-transform duration-300" :class="[state.visible ? '-rotate-90' : 'rotate-90']">
            <tz-chevron-icon class="block w-5" :class="sizeVariation?.chevron" />
            <span v-if="!state.selected?.value" class="sr-only"> Select an option, please tab through the list </span>
            <span v-else class="sr-only">
              Select an option, you have selected
              {{ state.selected.name }}
            </span>
          </div>
        </div>
      </button>
      <!-- options -->
      <Transition>
        <div
          v-if="state.visible"
          class="select__options absolute top-full left-0 right-0 mt-[7px] mb-1 max-h-[150px] overflow-auto border-l border-t border-b border-r border-[#D7D7D7] bg-white"
        >
          <ul>
            <li
              ref="tzFocusOptions"
              @keydown.down="onFocusOptionsDown"
              @keydown.up="onFocusOptionsUp"
              @keydown.escape="onFocusOptionsClose"
              @keydown.enter.prevent="handleSelectOption(option)"
              @keydown.space.prevent="handleSelectOption(option)"
              tabindex="0"
              class="focus-within:bg-[#D1D1D1]; px-1 first:pt-2 last:pb-2 hover:bg-[#D7D7D7]"
              v-for="(option, k) in state.options"
              :key="k"
            >
              <a
                data-test="tz-select-option"
                class="block flex whitespace-nowrap px-3 py-1 text-sm font-extrabold focus:outline-0"
                href="#"
                @click.prevent="handleSelectOption(option)"
              >
                <span v-if="props.colorIcons" class="mr-1">
                  <tz-select-icon v-if="option.colorIcon" :color1="option.colorIcon.color1" :color2="option.colorIcon.color2" class="scale-1" />
                </span>
                {{ option.name }}
                <span class="sr-only"> Select option {{ option.name }} </span>
              </a>
            </li>
          </ul>
        </div>
      </Transition>
      <!-- Phantom select - useful for forms -->
      <div class="hidden">
        <label for="dropdown">{{ description }}</label>
        <select name="dropdown" id="dropdown">
          <option v-for="(option, k) in state.options" :value="option.value" :key="k" ref="selectOptions">
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, reactive, onMounted, toRefs, ref, nextTick } from 'vue';
import TzChevronIcon from '@/components/Informational/Icons/Tz-Chevron-Icon.vue';
import TzSelectIcon from './Tz-Select-Icon.vue';
import { getSizeVariation } from './Tz-Select.methods.ts';

export type ColorIcon = {
  color1: string;
  color2: string;
}

export type Option = {
  name: string;
  value: string | number | boolean;
  prefix?: string;
  colorIcon?: ColorIcon;
};

export interface TzSelectProps {
  description?: string;
  options: Option[];
  defaultState?: Option;
  size?: string;
  colorIcons?: boolean;
}

interface TzSelectState {
  visible: boolean;
  selected: Option | null;
  options: Option[];
  focusIndex: number | null;
}

const selectButton = ref<null | { focus: () => null }>(null);
const tzSelectParent = ref<HTMLDivElement>();
const tzFocusOptions = ref<HTMLDivElement[]>();
const selectOptions = ref([]);

const state = reactive<TzSelectState>({
  visible: false,
  selected: null,
  options: [],
  focusIndex: null
});

const props = defineProps<TzSelectProps>();

const emit = defineEmits<{
  (e: 'selectedOption', value: Option): void;
}>();

const sizeVariation = computed(() => getSizeVariation(props.size));

const handleSelectOption = (option: Option) => {
  state.focusIndex = null;
  state.selected = option;
  state.visible = false;

  // handle the native select element for forms
  selectOptions.value.map((selected: HTMLOptionElement) => {
    parseInt(selected.value) === option.value
      ? selected.setAttribute('selected', 'selected')
      : selected.removeAttribute('selected');
  });

  selectButton.value?.focus();
  emit('selectedOption', option);
};

const onFocusOptionsOpen = async () => {
  state.visible = true;
  await nextTick();
  state.focusIndex = 0;
  tzFocusOptions.value?.[state.focusIndex]?.focus();
};

const onFocusOptionsDown = async () => {
  state.visible = true;
  await nextTick();
  if (state.focusIndex === null) {
    state.focusIndex = 0;
  } else if (state.focusIndex < state.options.length - 1) {
    state.focusIndex++;
  }

  tzFocusOptions.value?.[state.focusIndex]?.focus();
};

const onFocusOptionsUp = async () => {
  state.visible = true;
  await nextTick();
  if (state.focusIndex === null) {
    state.focusIndex = state.options.length;
  } else if (state.focusIndex > 0) {
    state.focusIndex--;
  }

  tzFocusOptions.value?.[state.focusIndex]?.focus();
};

const onFocusOptionsClose = () => {
  state.visible = false;
  state.focusIndex = null;
  selectButton.value?.focus();
};

const onSelectFocusOut = () => {
  let el = tzSelectParent.value;

  setTimeout(() => {
    const children = el?.querySelectorAll(
      'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
    );

    let found = false;

    if (children) {
      for (let child of children) {
        if (child === document.activeElement) found = true;
      }
    }

    if (!found) {
      state.visible = false;
      state.focusIndex = null;
      document.body.style.overflow = 'auto';
    }
  }, 100);
};

const handleOptionsData = () => {
  const propsOptions: Option[] = options.value;
  const defaultStateOption: Option | undefined = defaultState?.value;

  state.options.push(...propsOptions);

  state.selected = propsOptions[0];

  propsOptions.map((option) => {
    return defaultStateOption?.value === option.value && (state.selected = option);
  });
};

/**
 *
 * The phantom select options need to initialise with the rest of the component
 * Any default value needs to be reflected in the options
 *
 * Inside of a nextTick because we need the state data
 */
const handleInitOption = () => {
  selectOptions.value.map((selected: HTMLOptionElement) => {
    if (typeof selected.value === 'number' || parseInt(selected.value)) {
      parseInt(selected.value) === state.selected?.value
        ? selected.setAttribute('selected', 'selected')
        : selected.removeAttribute('selected');
    } else {
      selected.value === state.selected?.value
        ? selected.setAttribute('selected', 'selected')
        : selected.removeAttribute('selected');
    }
  });
};

onMounted(() => {
  handleOptionsData();
  nextTick(() => {
    handleInitOption();
  });
});

const { options, defaultState } = toRefs(props);
</script>
