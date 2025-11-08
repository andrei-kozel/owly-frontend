<script setup lang="ts">
import Logo from "~/components/Logo.vue";
import LocalePicker from "~/components/buttons/LocalePicker.vue";
import ColorModePicker from "~/components/buttons/ColorModePicker.vue";
const localePath = useLocalePath();
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
        <Tooltip trigger="hover" placement="right" :offset="16">
          <template #trigger>
            <NuxtLink
              :to="localePath('/app')"
              class="link w-10 h-10 hover:bg-background-300 text-text-700 flex justify-center items-center rounded-lg"
            >
              <Icon name="uil:home" size="24" />
            </NuxtLink>
          </template>
          <template #content>
            <div class="p-2 text-sm text-text-900">
              {{ $t("menu.home") }}
            </div>
          </template>
        </Tooltip>

        <Tooltip trigger="hover" placement="right" :offset="16">
          <template #trigger>
            <NuxtLink
              :to="localePath('/app/settings')"
              class="link w-10 h-10 hover:bg-background-300 text-text-700 flex justify-center items-center rounded-lg"
            >
              <Icon name="uil:setting" size="24" />
            </NuxtLink>
          </template>
          <template #content>
            <div class="p-2 text-sm text-text-900">
              {{ $t("menu.settings") }}
            </div>
          </template>
        </Tooltip>
      </div>
      <div class="justify-baseline flex flex-col gap-2">
        <ColorModePicker />
        <LocalePicker />
      </div>
    </aside>
    <div class="ml-20 flex flex-col w-full overflow-y-auto overflow-x-hidden">
      <header class="fixed h-16 p-2">Header content</header>
      <div class="mt-17 bg-background-50 rounded-tl-xl p-4 flex-1">
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
