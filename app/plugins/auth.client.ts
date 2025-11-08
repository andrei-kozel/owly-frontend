export default defineNuxtPlugin(() => {
  const { initAuth } = useAuth();

  // Initialize auth state from storage on app start
  if (import.meta.client) {
    initAuth();
  }
});
