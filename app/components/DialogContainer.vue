<script setup lang="ts">
import { useDialog } from "~/composables/useDialog";

const { dialogs, close } = useDialog();

const handleBackdropClick = (dialogId: string) => {
  close(dialogId);
};
</script>

<template>
  <Teleport to="body">
    <div v-for="dialog in dialogs" :key="dialog.id" class="dialog-wrapper">
      <!-- Backdrop -->
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="dialog.isOpen"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          @click="handleBackdropClick(dialog.id)"
        />
      </Transition>

      <!-- Dialog Content -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="dialog.isOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        >
          <div
            class="bg-background-100 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto pointer-events-auto"
            @click.stop
          >
            <component
              :is="dialog.component"
              v-bind="dialog.props"
              @close="close(dialog.id)"
            />
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-wrapper {
  /* Ensures each dialog has its own stacking context */
  position: relative;
}
</style>
