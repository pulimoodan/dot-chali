"use client";
import { loadUserFromToken } from "@/app/user";
import { DataEntity, UserContext } from "../hooks/userContext";
import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  children: ReactNode;
}

const authFreeRoutes = ["/login", "/signup", "/verify"];

function UserContextProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<DataEntity>({
    loaded: false,
    user: {
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      id: "",
      profilePic: "",
    },
  });

  const getUser = async () => {
    const user = await loadUserFromToken();

    const onFreeRoute = authFreeRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!user) return;

    if ("error" in user) {
      if (!onFreeRoute) router.replace("/login");
    } else {
      if (onFreeRoute) router.replace("/");
      setData({ loaded: true, user });
    }
  };

  useEffect(() => {
    getUser();
  }, [pathname]);

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
}

export default UserContextProvider;
