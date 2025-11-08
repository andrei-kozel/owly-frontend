<script setup lang="ts">
import { useI18n } from "#imports";
import Tooltip from "../Tooltip.vue";

const { locale, locales, setLocale } = useI18n();

const currentLocale = computed(() =>
  locales.value.find((l) => l.code === locale.value)
);

const setLocaleAndClose = (code: "en" | "ru", close: () => void) => {
  setLocale(code);
  close();
};
</script>

<template>
  <Tooltip trigger="click" placement="right" :offset="16">
    <template #trigger="{ isOpen }">
      <button
        class="flex justify-center cursor-pointer items-center gap-2 rounded-lg w-12 h-12 hover:bg-background-300 hover:text-text-900 transition-colors"
        :class="isOpen ? 'bg-background-200 text-text-900' : ''"
      >
        <span class="text-lg">{{ currentLocale?.flag }}</span>
      </button>
    </template>

    <template #content="{ close }">
      <div
        class="flex flex-row items-center justify-around w-26 h-12 px-2 gap-1"
      >
        <button
          v-for="locale in locales"
          :key="locale.code"
          @click="setLocaleAndClose(locale.code, close)"
          class="cursor-pointer hover:bg-background-300 hover:text-text-900 w-10 h-10 rounded-lg"
          :title="locale.language"
          :aria-label="`Switch to ${locale.code}`"
        >
          <span class="text-lg">{{ locale.flag }}</span>
        </button>
      </div>
    </template>
  </Tooltip>
</template>
