import React, { createContext, useContext, useState, useCallback } from 'react';
import { Image } from 'react-native';

interface UserAvatarContextType {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}

const UserAvatarContext = createContext<UserAvatarContextType>({
  avatarUrl: null,
  setAvatarUrl: () => {},
});

export function UserAvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  return (
    <UserAvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </UserAvatarContext.Provider>
  );
}

export function useUserAvatar() {
  return useContext(UserAvatarContext);
}
