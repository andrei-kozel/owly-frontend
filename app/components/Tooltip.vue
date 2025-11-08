<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  trigger?: "hover" | "click";
  placement?: "top" | "bottom" | "left" | "right";
  offset?: number;
}

const props = withDefaults(defineProps<Props>(), {
  trigger: "click",
  placement: "right",
  offset: 16,
});

const isOpen = ref(false);

const toggleDropdown = (event: Event) => {
  if (props.trigger === "click") {
    event.stopPropagation();
    isOpen.value = !isOpen.value;
  }
};

const openDropdown = () => {
  if (props.trigger === "hover") {
    isOpen.value = true;
  }
};

const closeDropdown = () => {
  if (props.trigger === "hover") {
    isOpen.value = false;
  }
};

// Calculate dropdown positioning classes based on placement
const dropdownClasses = computed(() => {
  const baseClasses = "absolute rounded-lg shadow-lg bg-background-200";

  const placementClasses = {
    right: "top-1/2 -translate-y-1/2 left-full ml-1",
    left: "top-1/2 -translate-y-1/2 right-full mr-1",
    bottom: "left-1/2 -translate-x-1/2 top-full mt-1",
    top: "left-1/2 -translate-x-1/2 bottom-full mb-1",
  };

  return `${baseClasses} ${placementClasses[props.placement]}`;
});

// Calculate arrow positioning classes
const arrowClasses = computed(() => {
  const baseClasses = "w-4 h-4 bg-background-200 absolute rotate-45 z-9";

  const arrowPositions = {
    right: "-left-1.5 top-1/2 -translate-y-1/2",
    left: "-right-1.5 top-1/2 -translate-y-1/2",
    bottom: "-top-1.5 left-1/2 -translate-x-1/2",
    top: "-bottom-1.5 left-1/2 -translate-x-1/2",
  };

  return `${baseClasses} ${arrowPositions[props.placement]}`;
});

// Calculate margin based on placement and offset
const dropdownStyle = computed(() => {
  const margins = {
    right: { marginLeft: `${props.offset}px` },
    left: { marginRight: `${props.offset}px` },
    bottom: { marginTop: `${props.offset}px` },
    top: { marginBottom: `${props.offset}px` },
  };

  return margins[props.placement];
});

onMounted(() => {
  if (props.trigger === "click") {
    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector(".dropdown-container");
      if (dropdown && !dropdown.contains(target)) {
        isOpen.value = false;
      }
    });
  }
});
</script>

<template>
  <div
    class="dropdown-container relative"
    @mouseenter="openDropdown"
    @mouseleave="closeDropdown"
  >
    <!-- Trigger Button Slot -->
    <div
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      class="flex justify-center items-center"
    >
      <slot name="trigger" :isOpen="isOpen" />
    </div>

    <!-- Dropdown Content -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="isOpen" :class="dropdownClasses" :style="dropdownStyle">
        <!-- Arrow pointer -->
        <div :class="arrowClasses"></div>

        <!-- Content Slot -->
        <div class="relative z-10">
          <slot name="content" :close="() => (isOpen = false)" />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.dropdown-container {
  display: inline-block;
}
</style>
