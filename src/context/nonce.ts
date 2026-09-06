import { createContext } from "react";

/**
 * A React context, unlike the React Router context in `user.ts`: `Layout` also
 * renders on error paths where no loader ran, so the nonce cannot come from
 * route context.
 */
export const NonceContext = createContext("");
