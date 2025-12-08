import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null
  );

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Error parsing user from local storage", e);
      }
    }
  }, []);

  return user;
};
