<template>
  <div class="flex h-screen bg-sky-300">
    <aside class="w-16 p-2 fixed">Sidebar content</aside>
    <div class="ml-16 flex flex-col w-full overflow-y-auto overflow-x-hidden">
      <header class="fixed h-16 p-2">Header content</header>
      <div class="mt-16 bg-red-300 rounded-tl-xl p-4 flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>
