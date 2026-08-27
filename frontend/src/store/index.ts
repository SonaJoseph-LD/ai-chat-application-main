'use client';

import { useSyncExternalStore } from 'react';

interface ChatState {
  activeConversationId: string | null;
}

let state: ChatState = {
  activeConversationId: null,
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const chatStore = {
  getState: () => state,
  setActiveConversationId: (id: string | null) => {
    state = { ...state, activeConversationId: id };
    emitChange();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useChatStore() {
  const current = useSyncExternalStore(
    chatStore.subscribe,
    chatStore.getState,
    () => ({ activeConversationId: null })
  );

  return {
    activeConversationId: current.activeConversationId,
    setActiveConversationId: chatStore.setActiveConversationId,
  };
}

