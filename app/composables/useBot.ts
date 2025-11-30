import { ref, onMounted, watch } from "vue";
import { botService } from "~/services/bot.service";
import type { TwitchData } from "~/types/bot";
import { useAuth } from "./useAuth";

const twitchData = ref<TwitchData | null>(null);
const isLoading = ref(false);

export const useBot = () => {
  const { isAuthenticated } = useAuth();

  const fetchTwitchData = async () => {
    if (!isAuthenticated.value) {
      twitchData.value = null;
      return;
    }

    isLoading.value = true;
    try {
      const data = await botService.getTwitchData();
      twitchData.value = data;
    } catch (e) {
      console.error("Failed to fetch twitch data", e);
      twitchData.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    if (isAuthenticated.value) {
      fetchTwitchData();
    }
  });

  watch(isAuthenticated, (newVal) => {
    if (newVal) {
      fetchTwitchData();
    } else {
      twitchData.value = null;
    }
  });

  return {
    twitchData,
    isLoading,
    fetchTwitchData,
  };
};
