<template>
  <div v-click-outside="close" class="border-neutral-200 relative z-50 flex justify-between border-b-2 bg-white py-4">
    <section v-for="(nav, key) in navigation" :key="key" :class="'block'">
      <nav :role="nav.name" :class="['block', 'w-full', 'bg-white']">
        <ul class="tz-primary-nav container flex gap-6 bg-white">
          <li
            v-for="(navItem, index) in nav.links"
            :key="index"
            :class="['p-0', 'inline-block', activeMenuItem(navItem, activePrimary) ? 'active' : null]"
          >
            <a
              tabindex="0"
              :href="navItem.link"
              :data-text="navItem.label"
              class="col-span-11 inline-flex flex-col justify-between text-slate-700 no-underline after:pointer-events-none after:invisible after:h-0 after:select-none after:overflow-hidden after:font-bold hover:text-gray-900"
              :class="{
                'cursor-pointer': !navItem.link,
                'text-center font-bold': activeMenuItem(navItem, activePrimary)
              }"
              @mouseenter="hasMenu(navItem) ? toggleSubMenu($event, navItem, index) : null"
            >
              {{ navItem.label }}
            </a>
            <div
              class="absolute left-0 col-span-full w-full bg-white text-left"
              :class="{
                hidden: !activeMenuItem(navItem, activePrimary)
              }"
              v-if="activeMenuItem(navItem, activePrimary)"
            >
              <ul class="container mx-0 mt-10 flex gap-6">
                <li
                  v-for="(secondaryItem, secondaryIndex) in activePrimary.menu"
                  :key="secondaryIndex"
                  :class="['lg:inline-block', 'py-3', 'lg:py-0']"
                >
                  <tz-menu-item
                    :active="activeMenuItem(secondaryItem, activeSecondary)"
                    :link="secondaryItem.link ? secondaryItem.link : undefined"
                    :title="secondaryItem.label"
                    :index="secondaryIndex"
                    :classes="['menu-item']"
                    :chevron="false"
                    @handleHoverActiveMenu="changeActiveMenu($event, secondaryIndex)"
                    >{{ secondaryItem.label }}</tz-menu-item
                  >
                  <div
                    class="absolute left-0 w-full bg-white text-left"
                    :class="{
                      hidden: !activeMenuItem(secondaryItem, activeSecondary)
                    }"
                    v-if="activeMenuItem(secondaryItem, activeSecondary)"
                  >
                    <div class="mb-10 flex">
                      <div class="menu w-5/6">
                        <tz-grid-menu :fluid="true" grid-items="inline" :menu="activeSecondary.menu"></tz-grid-menu>
                      </div>
                      <aside v-if="activeSecondary.content" class="flex flex-col">
                        <div class="content--image">
                          <img
                            v-if="activeSecondary.content.image"
                            :src="activeSecondary.content.image.src"
                            :alt="activeSecondary.content.image.alt"
                          />
                        </div>
                      </aside>
                    </div>
                    <tz-nav-footer :menu="footer"></tz-nav-footer>
                  </div>
                </li>
                <span
                  class="decorated-line absolute bottom-0 left-4 block w-4 rounded-full bg-slate-900 p-0.5 transition-all"
                  :style="{ left: underline.left }"
                ></span>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

import type { DirectiveBinding } from 'vue';

import TzMenuItem from '../Tz-MenuItem/Tz-MenuItem.vue';
import TzGridMenu from '../Tz-GridMenu/Tz-GridMenu.vue';
import TzNavFooter from '../Tz-NavFooter/Tz-NavFooter.vue';

import type { NavItem } from '../types';
import type { NavMenu } from '../types';
import type { NavUnderline } from '../types';

export interface Navigation {
  menu: NavMenu[];
  footer?: NavItem[];
  classes?: string[];
}

const props = withDefaults(defineProps<Navigation>(), {
  menu: () => [],
  footer: () => [],
  classes: () => []
});

let activePrimary = ref<NavItem | Record<string, never>>({});
let activeSecondary = ref<NavItem | Record<string, never>>({});
let navigation = ref<NavMenu[]>([]);
let underline = reactive<NavUnderline>({
  width: 0,
  height: 0,
  left: '1rem',
  top: 0
});

onMounted(() => {
  navigation.value = props.menu;
});

/**
 * Compare navigation item in index to active menu
 *
 * @return bool
 *   Whether or not the object matches
 */
const activeMenuItem = (menuItem: NavItem, active: NavItem | Record<string, never>) => {
  return JSON.stringify(menuItem) === JSON.stringify(active);
};

/**
 * Update reactive values to determine the current
 * state of the navigation based on user-interaction.
 *
 * @param e
 *   The mouse event
 * @param item
 *   A speicifc menu item
 * @param index
 *   The index of the menu item
 */
const toggleSubMenu = (e: any, item: NavItem, index: number | undefined) => {
  e.preventDefault();
  activePrimary.value = item;
  const secondaryMenu = item.menu[0];
  activeSecondary.value = secondaryMenu;
  // Assign default values for the underline animation
  updateHoverAnimation({
    width: 0,
    height: 0,
    left: '1rem',
    top: 0
  });
};

/**
 * Check to see if a menu item has a child menu.
 *
 * @param item
 *   Navigation menu item
 *
 * @return boolean
 *   Whether a menu item has a child menu.
 */
const hasMenu = (item: NavItem) => {
  return item.menu ? (item.menu.length ? true : null) : null;
};

/**
 * Set the active state of the navigation context from the current state of user interaction
 * Use the current item to return specified sub menus
 *
 * @param $event
 *  Emitted data from handleHoverActiveMenu to set underline values
 * @param index
 *  The specified menu item index of the context of user interaction
 */
const changeActiveMenu = ($event: NavUnderline, index: number) => {
  const activeMenu = activePrimary.value.menu;
  activeSecondary.value = activeMenu[index];
  updateHoverAnimation($event);
};

/**
 * Reactively update hover animation values.
 *
 * @param data
 *   Values to update the hover animation
 */
const updateHoverAnimation = (data: NavUnderline) => {
  Object.assign(underline, data);
};

/**
 * Trigger for directive (ClickOutside)
 *
 * Reset the menus to their original state.
 *
 * @param event
 * @param el
 */
const close = () => {
  activePrimary.value = {};
  activeSecondary.value = {};
};

type ClickableTrigger = (event: Event) => void;

interface ExtendedHTMLElement extends HTMLElement {
  clickOutsideEvent: ClickableTrigger;
}

/**
 * Custom directive: Outside click
 *
 * Detect a click outside of the specified target area
 * when detected we trigger an action
 */
const vClickOutside = {
  beforeMount(el: ExtendedHTMLElement, binding: DirectiveBinding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el: ExtendedHTMLElement) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
};
</script>
