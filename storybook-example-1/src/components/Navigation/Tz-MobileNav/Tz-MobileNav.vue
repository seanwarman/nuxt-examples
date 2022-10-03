<template>
  <div class="primary--navigation relative py-4">
    <div
      class="tabs grid grid-cols-12 duration-700"
      :class="{
        'translate-x-none': displayMobileMenu,
        'transform-xlarge': !displayMobileMenu
      }"
    >
      <ul v-if="displayMobileMenu" class="col-span-11 border-b-2 border-gray-100 bg-gray-100">
        <li
          v-for="(tab, key) in tabs"
          :key="key"
          @click="activePrimary.menu && key === 0 ? backMenuPosition() : toggleActiveTab(key, tab)"
          :class="[
            'capitalize',
            'p-3',
            'md:visible',
            'w-1/2',
            'inline-flex',
            'align-top',
            'cursor-pointer',
            isActiveTab === key ? 'active bg-white' : null
          ]"
        >
          <tz-chevron-icon
            v-if="activePrimary.menu && key === 0"
            :direction="Direction.Left"
            :classes="['w-5', 'inline-block', 'align-top']"
          ></tz-chevron-icon>
          {{ activePrimary.menu && key === 0 ? 'Back' : tab }}
        </li>
      </ul>
      <div
        class="min-h-screen justify-self-end bg-gray-100"
        :class="{
          'col-span-full': !displayMobileMenu,
          'col-span-1': displayMobileMenu
        }"
      >
        <div class="relative mx-auto sm:max-w-xl">
          <nav x-data="{ open: false }">
            <button class="relative h-12 w-12 bg-white text-black" @click="displaySubMenu(displayMobileMenu)">
              <span class="sr-only">Open main menu</span>
              <div class="text-block absolute left-1/2 top-1/2 block w-5 -translate-x-1/2 -translate-y-1/2 transform">
                <span
                  aria-hidden="true"
                  class="absolute block h-1 w-6 transform rounded-md bg-current transition duration-500 ease-in-out"
                  :class="{
                    'rotate-45': displayMobileMenu,
                    '-translate-y-2.5': !displayMobileMenu
                  }"
                ></span>
                <span
                  aria-hidden="true"
                  class="absolute block h-1 w-4 transform rounded-md bg-current transition duration-500 ease-in-out"
                  :class="{ 'opacity-0': displayMobileMenu }"
                ></span>
                <span
                  aria-hidden="true"
                  class="absolute block h-1 w-6 transform rounded-md bg-current transition duration-500 ease-in-out"
                  :class="{
                    '-rotate-45': displayMobileMenu,
                    'translate-y-2.5': !displayMobileMenu
                  }"
                ></span>
              </div>
            </button>
          </nav>
        </div>
      </div>
    </div>
    <Transition name="slide" appear>
      <div
        v-if="displayMobileMenu"
        class="menu duration-700"
        :class="{
          'translate-x-0': displayMobileMenu,
          '-translate-x-full': !displayMobileMenu
        }"
      >
        <section
          v-for="(nav, key) in navigation"
          :key="key"
          class="transform transition duration-700"
          :class="[menuChanged && '-translate-x-full', !menuChanged && 'translate-x-0']"
        >
          <nav :role="nav.name" :class="[isActiveTab !== key ? 'hidden' : null, 'w-3/4', 'bg-white']">
            <div v-if="nav.header" class="mobile-header">
              <img v-if="nav.header.image" :src="nav.header.image.src" :alt="nav.header.image.alt" />
            </div>
            <ul class="tz-primary-nav grid grid-cols-1 gap-0 bg-white">
              <li
                v-for="(navItem, index) in nav.links"
                :key="index"
                :class="[
                  'py-4',
                  'px-2',
                  'grid',
                  'grid-rows-1',
                  'grid-cols-12',
                  activeMenuItem(navItem, activePrimary) ? 'active' : null
                ]"
              >
                <a
                  tabindex="0"
                  :href="navItem.link"
                  :data-text="navItem.label"
                  :class="[
                    'menu-item',
                    'text-slate-700',
                    'hover:text-gray-900',
                    'col-span-11',
                    'no-underline',
                    !navItem.link ? 'cursor-pointer' : null,
                    !navItem.link && activeMenuItem(navItem, activePrimary) ? 'text-center font-bold' : null
                  ]"
                  @click="!activePrimary.menu ? currentMobileMenu($event, index, null, navItem) : null"
                >
                  {{ navItem.label }}
                </a>
                <tz-chevron-icon
                  v-if="navItem.link || !activeMenuItem(navItem, activePrimary)"
                  :classes="['col-span-1']"
                ></tz-chevron-icon>
                <div class="col-span-full">
                  <tz-grid-menu
                    v-if="activePrimary.list"
                    :menu="activePrimary.list"
                    grid-items="block"
                    :fluid="false"
                  ></tz-grid-menu>
                  <ul class="container mx-0 mt-4 border-t-2 border-gray-100">
                    <li
                      v-for="(secondaryItem, secondaryIndex) in activePrimary.menu"
                      :key="secondaryIndex"
                      :class="['py-3']"
                    >
                      <tz-menu-item
                        :active="activeMenuItem(secondaryItem, activeSecondary)"
                        :link="!secondaryItem.menu ? secondaryItem.link : undefined"
                        :image="secondaryItem.image"
                        :title="secondaryItem.label"
                        :chevron="displayMobileMenu"
                        :index="secondaryIndex"
                        @handleClickActiveMenu="changeMobileMenu($event, secondaryIndex)"
                        >{{ secondaryItem.label }}</tz-menu-item
                      >
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </nav>
        </section>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, onMounted, Transition } from 'vue';

import TzMenuItem from '../Tz-MenuItem/Tz-MenuItem.vue';
import TzChevronIcon from '../../Informational/Icons/Tz-Chevron-Icon.vue';
import TzGridMenu from '../Tz-GridMenu/Tz-GridMenu.vue';

import type { NavTab } from '../types';
import type { NavItemHeader } from '../types';
import type { NavItem } from '../types';
import type { NavMenu } from '../types';

export interface MainMenu {
  menu: NavMenu[];
  classes?: string[];
}

enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left'
}

const emits = defineEmits<{
  (eventName: 'toggleSubMenu', isShown: boolean): void;
  (eventName: 'refreshSubMenu', activeSecondary: NavItem): void;
  (eventName: 'changeTab', activeTab: NavTab): void;
  (eventName: 'changeActiveTab', activeTab: NavTab): void;
}>();

const props = withDefaults(defineProps<MainMenu>(), {
  menu: () => [],
  classes: () => []
});

const displayMobileMenu = ref(false);
const mainMenu = ref(props.menu);
const tabs = ref<string[]>([]);

let activeTab = ref<NavTab>({ index: 0, name: '' });
let activePrimary = ref<NavItem | Record<string, never>>({});
let prevPrimary = ref<Record<string, never> | NavItem>({});
let activeSecondary = ref<NavItem | Record<string, never>>({});
let navigation = ref<NavMenu[]>([]);
const menuChanged = ref(false);

onMounted(() => {
  navigation.value = props.menu;
  tabs.value = props.menu.map((tab) => tab.name);
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

const toggleActiveTab = (key: number, name: string) => {
  menuChanged.value = true;
  setTimeout(() => {
    menuChanged.value = false;
    resetMenus();
    activeTab.value = { index: key, name: name };
  }, 700);
};

const isActiveTab = computed(() => {
  return activeTab.value ? activeTab.value.index : 0;
});

const toggleSecondaryMenu = (e: any, item: NavItem, index: number | undefined) => {
  e.preventDefault();
  activeSecondary.value = item;
  emits('refreshSubMenu', item);
};

const displaySubMenu = (display: boolean) => {
  setTimeout(() => {
    const toggleDisplay = !display;
    displayMobileMenu.value = toggleDisplay;
  }, 200);

  // @Info: To reset the menu on close then uncomment this line.
  // resetMenus()
};

/**
 * Reset all menus back to original values
 */
const resetMenus = () => {
  activePrimary.value = {};
  activeSecondary.value = {};
  navigation.value = props.menu;
};

const updatePrimaryMenu = (menu: any, navItem: NavItem | null) => {
  menu.value = navItem;
};

const updateMainNavigation = (item: NavItem, menu: NavItem[], header: NavItemHeader | undefined) => {
  let mainNav: NavMenu;
  if (item) {
    mainNav = {
      name: item.label,
      links: [
        {
          label: item.label,
          link: item.link,
          menu: menu
        }
      ]
    };
    if (header) {
      mainNav.header = header;
    }
    navigation.value = [mainNav];
  }
};

const changeMobileMenu = ($event: any, index: number) => {
  const activeMenu = activePrimary.value.menu;
  const activeItem: NavItem = activeMenu[index];
  prevPrimary.value = activePrimary.value;
  updatePrimaryMenu(activePrimary, activeItem);
  updateMainNavigation(activeItem, activeItem.menu, activeItem.header);
};

const backMenuPosition = () => {
  const shopMenu = mainMenu.value[0];

  menuChanged.value = true;
  setTimeout(() => {
    menuChanged.value = false;
    if (!isEmptyObj(prevPrimary.value)) {
      const prevItem = prevPrimary.value as NavItem;
      updateMainNavigation(prevItem, prevItem.menu, prevItem.header);
      updatePrimaryMenu(activePrimary, prevItem);
      updatePrimaryMenu(prevPrimary, null);
      menuChanged.value = false;
    } else {
      navigation.value = [
        {
          name: shopMenu.name,
          links: shopMenu.links
        }
      ];
      activePrimary.value = {};
    }
  }, 700);
};

const currentMobileMenu = (e: any, mainIndex: number | null, secondaryIndex: number | null, navItem: NavItem) => {
  if (Number.isInteger(mainIndex)) {
    e.preventDefault();
  }

  menuChanged.value = true;
  setTimeout(() => {
    updateMainNavigation(navItem, navItem.menu, navItem.header);
    updatePrimaryMenu(activePrimary, navItem);
    menuChanged.value = false;
  }, 700);
};

/**
 * Function to check if object has values.
 *
 * @param object
 *   Object to check for existing properties.
 *
 * @return boolean
 *   Is/Isn't empty.
 */
const isEmptyObj = (object: Record<string, number> | NavItem) => {
  for (const property in object) {
    return false;
  }
  return true;
};
</script>

<style scoped>
.v-enter-active {
  transform: translate(0, 0);
  -webkit-transform: translate(0, 0);
  transform: translate(50%, 0);
  -webkit-transform: translate(50%, 0);
  transition: 1s;
}

.v-leave-active {
  transform: translate(-100%, 0);
  -webkit-transform: translate(-100%, 0);
  transition: 1s;
}

/* 1. declare transition */
.slide-move,
.slide-enter-active,
.slide-leave-active,
.slide-2-enter-active,
.slide-2-leave-active {
  transition: all 0.7s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.slide-enter-from {
  @apply delay-500;
  @apply -translate-x-full;
}
.slide-leave-to {
  @apply -translate-x-full;
}

.slide-leave-from {
  @apply translate-x-0;
}

.transform-xlarge {
  transform: translateX(-90%);
}
</style>
