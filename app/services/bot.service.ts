import type { TwitchData } from "~/types/bot";

export const botService = {
  async getTwitchData(): Promise<TwitchData | null> {
    try {
      const data = await $fetch<TwitchData>("/api/provider/getchannelinfo");
      console.log("Fetched Twitch Data:", data);
      return data;
    } catch (error) {
      // If 401 or 500 (not connected), return null
      return null;
    }
  },
};
