<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import Button from "~/components/buttons/Button.vue";

interface Props {
  title?: string;
  message?: string;
  onSwitchToSignup?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Login",
  message: "Please enter your credentials",
});

const emit = defineEmits<{
  close: [];
  switchToSignup: [];
}>();

const { login, isLoading, error, clearError } = useAuth();

const formData = ref({
  email: "",
  password: "",
});

const handleClose = () => {
  clearError();
  emit("close");
};

const handleSubmit = async () => {
  clearError();

  try {
    await login({
      email: formData.value.email,
      password: formData.value.password,
    });

    // Success - close dialog
    handleClose();
  } catch (err) {
    // Error is handled by useAuth composable
    console.error("Login failed:", err);
  }
};

const handleTwitchLogin = () => {
  clearError();

  // Close dialog and redirect to Twitch OAuth
  handleClose();

  if (import.meta.client) {
    window.location.href = "/auth/twitch";
  }
};

const switchToSignup = () => {
  handleClose();
  if (props.onSwitchToSignup) {
    props.onSwitchToSignup();
  }
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

      <!-- Error Message -->
      <div
        v-if="error"
        class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
      >
        {{ error }}
      </div>

      <!-- Demo Credentials -->
      <div
        class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm"
      >
        <p class="font-medium text-blue-900 mb-1">Demo Credentials:</p>
        <p class="text-blue-700">Email: demo@example.com</p>
        <p class="text-blue-700">Password: password123</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-900 mb-1">
            Email
          </label>
          <input
            v-model="formData.email"
            type="email"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-background-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-900 mb-1">
            Password
          </label>
          <input
            v-model="formData.password"
            type="password"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-background-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your password"
          />
        </div>

        <!-- Actions -->
        <div class="flex gap-2 justify-end pt-4">
          <Button
            type="button"
            @click="handleClose"
            variant="secondary"
            :disabled="isLoading"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" :loading="isLoading">
            Login
          </Button>
        </div>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-background-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-background-100 text-text-600"
            >Or continue with</span
          >
        </div>
      </div>

      <!-- OAuth Buttons -->
      <div class="space-y-3">
        <Button
          @click="handleTwitchLogin"
          variant="outline"
          :full-width="true"
          :disabled="isLoading"
          class="!border-purple-500 !text-purple-500 hover:!bg-purple-50"
        >
          <Icon name="mdi:twitch" size="20" class="mr-2" />
          Login with Twitch
        </Button>
      </div>

      <!-- Switch to Signup -->
      <div class="mt-4 text-center">
        <p class="text-sm text-text-600">
          Don't have an account?
          <button
            @click="switchToSignup"
            class="text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
            type="button"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
