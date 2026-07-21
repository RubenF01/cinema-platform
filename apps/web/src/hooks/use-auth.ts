import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
  type AuthCredentials,
  type AuthUser,
  updateEmail,
  type UpdateEmailRequest,
  updatePassword,
  type UpdatePasswordRequest,
} from "@cimena/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const authQueryKeys = {
  currentUser: ["auth", "me"] as const,
};

export function useCurrentUser() {
  return useQuery<AuthUser | null>({
    queryKey: authQueryKeys.currentUser,
    queryFn: async () => {
      try {
        return await getCurrentUser();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 60_000,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: AuthCredentials) => signIn(credentials),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: authQueryKeys.currentUser,
      });
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: AuthCredentials) => signUp(credentials),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: authQueryKeys.currentUser,
      });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.currentUser, null);
    },
  });
}

export function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEmailRequest) => updateEmail(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.currentUser, user);
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (payload: UpdatePasswordRequest) => updatePassword(payload),
  });
}
