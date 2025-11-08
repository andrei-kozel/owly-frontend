<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Button Component Examples</h1>

    <!-- Variants -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Variants</h2>
      <div class="flex flex-wrap gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
    </section>

    <!-- Sizes -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Sizes</h2>
      <div class="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </section>

    <!-- With Icons -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">With Icons</h2>
      <div class="flex flex-wrap gap-4">
        <Button icon="uil:plus" icon-position="left">Add Item</Button>
        <Button
          icon="uil:arrow-right"
          icon-position="right"
          variant="secondary"
        >
          Next
        </Button>
        <Button icon="uil:trash" variant="danger">Delete</Button>
      </div>
    </section>

    <!-- States -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">States</h2>
      <div class="flex flex-wrap gap-4">
        <Button :loading="true">Loading</Button>
        <Button :disabled="true">Disabled</Button>
        <Button variant="outline" :loading="true">Processing</Button>
      </div>
    </section>

    <!-- Full Width -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Full Width</h2>
      <div class="max-w-md">
        <Button :full-width="true">Full Width Button</Button>
      </div>
    </section>

    <!-- Dialog Example -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Dialog Example</h2>
      <Button @click="openLoginDialog" icon="uil:signin" variant="primary">
        Open Login Dialog
      </Button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Dialog } from "~/composables/useDialog";
import LoginDialog from "~/components/dialogs/LoginDialog.vue";
import Button from "~/components/buttons/Button.vue";

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

<style scoped></style>
