import { useCallback } from "react";

export const useTracking = (pageViewId: string | null) => {
  const trackClick = useCallback(
    async (event: MouseEvent, element: HTMLElement) => {
      if (!pageViewId) return;

      try {
        await fetch("/api/track/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageViewId,
            elementId: element.id,
            elementClass: element.className,
            elementText: element.textContent,
            xPosition: event.clientX,
            yPosition: event.clientY,
          }),
        });
      } catch (error) {
        console.error("Failed to track click:", error);
      }
    },
    [pageViewId]
  );

  const trackEvent = useCallback(
    async (eventData: {
      eventType: string;
      eventCategory?: string;
      eventAction?: string;
      eventLabel?: string;
      eventValue?: number;
    }) => {
      if (!pageViewId) return;

      try {
        await fetch("/api/track/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageViewId,
            ...eventData,
          }),
        });
      } catch (error) {
        console.error("Failed to track event:", error);
      }
    },
    [pageViewId]
  );

  return { trackClick, trackEvent };
};
