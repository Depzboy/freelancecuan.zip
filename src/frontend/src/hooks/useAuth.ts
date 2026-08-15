import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMemo } from "react";

/**
 * Auth hook wrapping the InternetIdentityProvider context.
 *
 * Exposes `isAuthenticated`, `login`, `logout`, the raw `identity`,
 * and a derived `principal` string. The verified email is fetched
 * separately via the backend profile (see useBackend.useCallerProfile),
 * because II attribute bundles are recorded server-side.
 */
export function useAuth() {
  const {
    identity,
    isAuthenticated,
    login,
    clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginError,
    loginError,
  } = useInternetIdentity();

  const principal = useMemo(
    () => (identity ? identity.getPrincipal().toString() : null),
    [identity],
  );

  return {
    identity,
    principal,
    isAuthenticated,
    login,
    logout: clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginError,
    loginError,
  };
}
