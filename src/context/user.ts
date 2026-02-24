import { createContext } from "react-router";

type UserData = {
  fingerprint: string;
};

export const userContext = createContext<UserData>({
  fingerprint: "",
});
