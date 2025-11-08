<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { getOAuthUrl } from "~/config/oauth";
import Button from "~/components/buttons/Button.vue";

interface Props {
  title?: string;
  message?: string;
  onSwitchToLogin?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Sign Up",
  message: "Create your account",
});

const emit = defineEmits<{
  close: [];
  switchToLogin: [];
}>();

const { register, isLoading, error, clearError } = useAuth();

const formData = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const validationError = ref<string | null>(null);

const handleClose = () => {
  clearError();
  validationError.value = null;
  emit("close");
};

const validateForm = (): boolean => {
  validationError.value = null;

  if (formData.value.name.length < 2) {
    validationError.value = "Name must be at least 2 characters";
    return false;
  }

  if (formData.value.password.length < 6) {
    validationError.value = "Password must be at least 6 characters";
    return false;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    validationError.value = "Passwords do not match";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  clearError();

  if (!validateForm()) {
    return;
  }

  try {
    await register({
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
    });

    // Success - close dialog
    handleClose();
  } catch (err) {
    // Error is handled by useAuth composable
    console.error("Registration failed:", err);
  }
};

const handleTwitchSignup = () => {
  clearError();
  const twitchAuthUrl = getOAuthUrl("twitch");

  // Close dialog and redirect to Twitch OAuth
  handleClose();

  if (import.meta.client) {
    window.location.href = twitchAuthUrl;
  }
};

const switchToLogin = () => {
  handleClose();
  if (props.onSwitchToLogin) {
    props.onSwitchToLogin();
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
        v-if="error || validationError"
        class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
      >
        {{ error || validationError }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-900 mb-1">
            Name
          </label>
          <input
            v-model="formData.name"
            type="text"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-background-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your name"
          />
        </div>

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
            minlength="6"
          />
          <p class="text-xs text-text-600 mt-1">
            Must be at least 6 characters
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-900 mb-1">
            Confirm Password
          </label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-background-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Confirm your password"
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
            Sign Up
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
            >Or sign up with</span
          >
        </div>
      </div>

      <!-- OAuth Buttons -->
      <div class="space-y-3">
        <Button
          @click="handleTwitchSignup"
          variant="outline"
          :full-width="true"
          :disabled="isLoading"
          class="!border-purple-500 !text-purple-500 hover:!bg-purple-50"
        >
          <Icon name="mdi:twitch" size="20" class="mr-2" />
          Sign up with Twitch
        </Button>
      </div>

      <!-- Switch to Login -->
      <div class="mt-4 text-center">
        <p class="text-sm text-text-600">
          Already have an account?
          <button
            @click="switchToLogin"
            class="text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
            type="button"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
