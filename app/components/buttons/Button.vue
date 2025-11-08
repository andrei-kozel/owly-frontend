<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  disabled: false,
  loading: false,
  iconPosition: "left",
  fullWidth: false,
  type: "button",
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};

const buttonClasses = computed(() => {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  ];

  // Variants
  const variants = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 disabled:bg-primary-300",
    secondary:
      "bg-background-200 text-text-900 hover:bg-background-300 focus:ring-background-400 disabled:bg-background-100",
    outline:
      "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300",
    ghost:
      "text-text-700 hover:bg-background-200 hover:text-text-900 focus:ring-background-300 disabled:text-text-400",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:bg-red-300",
  };

  // Sizes
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-1.5 text-base",
    lg: "px-6 py-2 text-lg",
  };

  classes.push(variants[props.variant]);
  classes.push(sizes[props.size]);

  if (props.fullWidth) {
    classes.push("w-full");
  }

  if (props.disabled || props.loading) {
    classes.push("cursor-not-allowed opacity-60");
  } else {
    classes.push("cursor-pointer");
  }

  return classes.join(" ");
});
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <span
      v-if="loading"
      class="animate-spin"
      :class="{
        'w-4 h-4': size === 'sm',
        'w-5 h-5': size === 'md',
        'w-6 h-6': size === 'lg',
      }"
    >
      <Icon name="uil:spinner" />
    </span>

    <!-- Left Icon -->
    <Icon
      v-if="icon && iconPosition === 'left' && !loading"
      :name="icon"
      :size="size === 'sm' ? '16' : size === 'md' ? '20' : '24'"
    />

    <!-- Slot Content -->
    <slot />

    <!-- Right Icon -->
    <Icon
      v-if="icon && iconPosition === 'right' && !loading"
      :name="icon"
      :size="size === 'sm' ? '16' : size === 'md' ? '20' : '24'"
    />
  </button>
</template>
