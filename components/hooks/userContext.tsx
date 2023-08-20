"use client";
import UserEntity from "@/lib/entities/User";
import { createContext } from "react";

export interface DataEntity {
  loaded: boolean;
  user: UserEntity;
}

export const UserContext = createContext<DataEntity>({
  loaded: false,
  user: {
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    profilePic: "",
    id: "",
  },
});
