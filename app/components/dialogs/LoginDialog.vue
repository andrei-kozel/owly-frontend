<script setup lang="ts">
interface Props {
  title?: string;
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Login",
  message: "Please enter your credentials",
});

const emit = defineEmits<{
  close: [];
}>();

const handleClose = () => {
  emit("close");
};

const handleSubmit = () => {
  // Your login logic here
  console.log("Login submitted");
  handleClose();
};
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-text-900">{{ title }}</h2>
      <button
        @click="handleClose"
        class="text-text-600 hover:text-text-900 transition-colors cursor-pointer"
        aria-label="Close"
      >
        <Icon name="uil:times" size="24" />
      </button>
    </div>

    <!-- Content -->
    <div class="mb-6">
      <p class="text-text-700 mb-4">{{ message }}</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-900 mb-1">
            Email
          </label>
          <input
            type="email"
            class="w-full px-3 py-2 border border-background-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-900 mb-1">
            Password
          </label>
          <input
            type="password"
            class="w-full px-3 py-2 border border-background-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your password"
          />
        </div>

        <!-- Actions -->
        <div class="flex gap-2 justify-end pt-4">
          <button
            type="button"
            @click="handleClose"
            class="px-4 py-2 rounded-lg bg-background-200 hover:bg-background-300 text-text-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
