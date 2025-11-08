<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";
import { verifyState } from "~/config/oauth";

definePageMeta({
  layout: false,
});

const route = useRoute();
const router = useRouter();
const { loginWithOAuth } = useAuth();

const error = ref<string | null>(null);
const isProcessing = ref(true);

onMounted(async () => {
  const code = route.query.code as string;
  const state = route.query.state as string;
  const errorParam = route.query.error as string;

  // Handle OAuth errors
  if (errorParam) {
    error.value = `OAuth Error: ${errorParam}`;
    isProcessing.value = false;

    setTimeout(() => {
      router.push("/");
    }, 3000);
    return;
  }

  // Verify state for CSRF protection
  if (!verifyState(state)) {
    error.value = "Invalid state parameter. Possible CSRF attack.";
    isProcessing.value = false;

    setTimeout(() => {
      router.push("/");
    }, 3000);
    return;
  }

  // Exchange code for tokens
  if (code) {
    try {
      await loginWithOAuth("twitch", code);

      // Success - redirect to app
      router.push("/app");
    } catch (err: any) {
      error.value = err.message || "Failed to authenticate with Twitch";
      isProcessing.value = false;

      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  } else {
    error.value = "No authorization code received";
    isProcessing.value = false;

    setTimeout(() => {
      router.push("/");
    }, 3000);
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background-50">
    <div class="max-w-md w-full p-8 bg-background-100 rounded-xl shadow-lg">
      <!-- Loading State -->
      <div v-if="isProcessing && !error" class="text-center">
        <div class="mb-4 flex justify-center">
          <div class="animate-spin w-12 h-12 text-primary-500">
            <Icon name="uil:spinner" size="48" />
          </div>
        </div>
        <h2 class="text-xl font-semibold text-text-900 mb-2">
          Authenticating with Twitch...
        </h2>
        <p class="text-text-600">
          Please wait while we complete the login process
        </p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="text-center">
        <div class="mb-4 flex justify-center">
          <div class="w-12 h-12 text-red-500">
            <Icon name="uil:exclamation-triangle" size="48" />
          </div>
        </div>
        <h2 class="text-xl font-semibold text-text-900 mb-2">
          Authentication Failed
        </h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <p class="text-text-600 text-sm">Redirecting to home page...</p>
      </div>
    </div>
  </div>
</template>
