"use client";

import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// sockjs-client référence `global` (héritage Node) : on le mappe sur window
// côté navigateur pour éviter "global is not defined".
if (typeof window !== "undefined" && typeof window.global === "undefined") {
  window.global = window;
}

const WS_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/ws";

export function useSocket(onAlert) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
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
      // Silencieux : le backend WebSocket peut ne pas être lancé en Phase 1.
      onStompError: () => setConnected(false),
    });

    client.activate();
    return () => {
      client.deactivate();
    };
    // onAlert volontairement hors dépendances : on garde une seule connexion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { connected };
}
