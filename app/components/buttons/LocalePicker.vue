<script setup lang="ts">
import { useI18n } from "#imports";
import { ref } from "vue";

const { locale, locales, setLocale } = useI18n();
const isOpen = ref(false);

const currentLocale = computed(() =>
  locales.value.find((l) => l.code === locale.value)
);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const setLocaleAndClose = (code: "en" | "ru") => {
  setLocale(code);
  isOpen.value = false;
};

onMounted(() => {
  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const localePicker = document.querySelector(".locale-picker");
    if (localePicker && !localePicker.contains(target)) {
      isOpen.value = false;
    }
  });
});
</script>

<template>
  <div class="locale-picker relative">
    <button
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      class="flex justify-center cursor-pointer items-center gap-2 rounded-lg w-12 h-12 hover:bg-background-700 transition-colors"
      :class="isOpen ? 'bg-background-700' : ''"
    >
      <span class="text-lg">{{ currentLocale?.flag }}</span>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute rounded-lg shadow-lg bg-background-700 flex flex-row items-center justify-around w-26 h-12 top-1/2 -translate-y-1/2 left-full ml-4"
      >
        <div
          class="w-4 h-4 bg-background-700 absolute -left-1.5 rotate-45 z-9"
        ></div>
        <button
          v-for="locale in locales"
          :key="locale.code"
          @click="setLocaleAndClose(locale.code)"
          class="cursor-pointer hover:bg-background-500 w-10 h-10 rounded-lg z-10"
          :title="locale.language"
          :aria-label="`Switch to ${locale.code}`"
        >
          <span class="text-lg">{{ locale.flag }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.locale-picker {
  display: inline-block;
}
</style>
