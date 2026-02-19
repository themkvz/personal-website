import { createContext } from "react-router";

export type UserData = {
  fingerprint: string;
};

export const userContext = createContext<UserData>({
  fingerprint: "",
});
