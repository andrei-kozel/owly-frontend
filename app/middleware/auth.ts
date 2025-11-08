export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth();

  // If not authenticated and trying to access protected route
  if (!isAuthenticated.value) {
    // Redirect to home/landing page
    return navigateTo("/");
  }
});
