import { ref, markRaw } from "vue";
import type { Component } from "vue";

interface DialogOptions {
  component: Component;
  props?: Record<string, any>;
  onClose?: () => void;
}

interface DialogState extends DialogOptions {
  id: string;
  isOpen: boolean;
}

const dialogs = ref<DialogState[]>([]);

export const useDialog = () => {
  const open = (
    component: Component,
    props: Record<string, any> = {},
    onClose?: () => void
  ) => {
    const id = `dialog-${Date.now()}-${Math.random()}`;

    dialogs.value.push({
      id,
      component: markRaw(component), // markRaw prevents Vue from making it reactive
      props,
      onClose,
      isOpen: true,
    });

    return id;
  };

  const close = (id: string) => {
    const index = dialogs.value.findIndex((d) => d.id === id);
    if (index !== -1) {
      const dialog = dialogs.value[index];
      if (dialog) {
        dialog.isOpen = false;

        // Call onClose callback if provided
        if (dialog.onClose) {
          dialog.onClose();
        }

        // Remove from array after animation
        setTimeout(() => {
          dialogs.value.splice(index, 1);
        }, 300);
      }
    }
  };
  const closeAll = () => {
    dialogs.value.forEach((dialog) => {
      if (dialog.onClose) {
        dialog.onClose();
      }
    });
    dialogs.value = [];
  };

  return {
    dialogs,
    open,
    close,
    closeAll,
  };
};

// Global Dialog API
export const Dialog = {
  New: (
    component: Component,
    props: Record<string, any> = {},
    onClose?: () => void
  ) => {
    const { open } = useDialog();
    return open(component, props, onClose);
  },
  Close: (id: string) => {
    const { close } = useDialog();
    close(id);
  },
  CloseAll: () => {
    const { closeAll } = useDialog();
    closeAll();
  },
};
