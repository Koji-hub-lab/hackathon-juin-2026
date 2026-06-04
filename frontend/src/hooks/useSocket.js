"use client";

import { useEffect, useState } from "react";

const WS_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/ws";

/**
 * WebSocket STOMP (SockJS). Imports dynamiques pour éviter un crash au
 * premier paint (sockjs référence `global` avant hydratation).
 */
export function useSocket(onAlert) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let client;
    let cancelled = false;

    (async () => {
      if (typeof window === "undefined") return;

      if (typeof window.global === "undefined") {
        window.global = window;
      }

      try {
        const [{ Client }, { default: SockJS }] = await Promise.all([
          import("@stomp/stompjs"),
          import("sockjs-client"),
        ]);

        if (cancelled) return;

        client = new Client({
          webSocketFactory: () => new SockJS(WS_URL),
          reconnectDelay: 5000,
          onConnect: () => {
            setConnected(true);
            client.subscribe("/topic/alerts", (message) => {
              try {
                const alert = JSON.parse(message.body);
                if (onAlert) onAlert(alert);
              } catch {
                // message non JSON ignoré
              }
            });
          },
          onWebSocketClose: () => setConnected(false),
          onDisconnect: () => setConnected(false),
          onStompError: () => setConnected(false),
        });

        client.activate();
      } catch {
        setConnected(false);
      }
    })();

    return () => {
      cancelled = true;
      if (client) {
        client.deactivate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { connected };
}
