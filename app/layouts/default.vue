<script setup lang="ts">
import Logo from "~/components/Logo.vue";
import LocalePicker from "~/components/buttons/LocalePicker.vue";
import ColorModePicker from "~/components/buttons/ColorModePicker.vue";
import Button from "~/components/buttons/Button.vue";
import { mainNavigation } from "~/config/navigation";
import { Dialog } from "~/composables/useDialog";
import LoginDialog from "~/components/dialogs/LoginDialog.vue";

const localePath = useLocalePath();

const openLoginDialog = () => {
  Dialog.New(
    LoginDialog,
    {
      title: "Welcome Back",
      message: "Please sign in to continue",
    },
    () => {
      console.log("Dialog closed");
    }
  );
};
</script>

<template>
  <div class="flex h-screen">
    <aside
      class="w-20 p-2 fixed flex flex-col h-full items-center justify-between gap-4"
    >
      <div>
        <div class="h-16 w-16">
          <NuxtLink :to="localePath('/app')">
            <Logo />
          </NuxtLink>
        </div>
        <div class="relative">header</div>
      </div>
      <div class="flex flex-col gap-2">
        <Tooltip
          v-for="item in mainNavigation"
          :key="item.to"
          trigger="hover"
          placement="right"
          :offset="16"
        >
          <template #trigger>
            <NuxtLink
              :to="localePath(item.to)"
              class="link w-10 h-10 hover:bg-background-300 text-text-700 flex justify-center items-center rounded-lg"
            >
              <Icon :name="item.icon" size="24" />
            </NuxtLink>
          </template>
          <template #content>
            <div class="p-2 text-sm text-text-900">
              {{ $t(item.label) }}
            </div>
          </template>
        </Tooltip>
      </div>
      <div class="justify-baseline flex flex-col gap-2">
        <ColorModePicker />
        <LocalePicker />
      </div>
    </aside>
    <div class="ml-20 flex flex-col w-full h-screen">
      <header class="h-16 p-2 flex justify-end items-center shrink-0">
        <Button @click="openLoginDialog" icon="uil:signin" variant="primary">
          Login
        </Button>
      </header>
      <div class="bg-background-50 rounded-tl-xl p-4 flex-1 overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.link {
  cursor: pointer;
}

.router-link-active {
  background-color: var(--background-200);
}
</style>
