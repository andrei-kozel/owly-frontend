<template>
  <button
    @click="toggleDarkMode"
    class="w-12 h-12 flex justify-center items-center cursor-pointer text-text-700 hover:text-text-200 hover:bg-background-600 rounded-lg transition-colors"
    aria-label="Toggle color mode"
    :title="$t('toggleColorMode')"
  >
    <Icon v-show="colorMode.value === 'dark'" name="uil:sun" size="24" />
    <Icon v-show="colorMode.value === 'light'" name="uil:moon" size="24" />
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const toggleDarkMode = () => {
  if (colorMode.preference === "dark") {
    colorMode.preference = "light";
  } else {
    colorMode.preference = "dark";
  }
};
</script>
