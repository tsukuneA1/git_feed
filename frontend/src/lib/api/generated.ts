import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

import { customInstance } from "./mutator";
/**
 * OAuth provider
 */
export type UserProvider = (typeof UserProvider)[keyof typeof UserProvider];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UserProvider = {
  github: "github",
} as const;

export interface User {
  /** User unique identifier */
  id: number;
  /** GitHub username */
  username: string;
  /**
   * User display name
   * @nullable
   */
  name?: string | null;
  /** User avatar URL */
  avatar_url: string;
  /** OAuth provider */
  provider: UserProvider;
  /** OAuth provider user ID */
  uid: string;
  /** User creation timestamp */
  created_at: string;
  /** User last update timestamp */
  updated_at: string;
}

export interface RefreshTokenRequest {
  /** Valid refresh token */
  refresh_token: string;
}

export interface TokenResponse {
  /** JWT access token */
  access_token: string;
}

export interface LogoutRequest {
  /** Refresh token to invalidate */
  refresh_token: string;
}

export interface LogoutResponse {
  /** Logout success message */
  message: string;
}

/**
 * Additional error details
 */
export type ErrorDetails = { [key: string]: unknown };

export interface Error {
  /** Error message */
  error: string;
  /** Additional error details */
  details?: ErrorDetails;
}

/**
 * Additional error details
 */
export type Error2Details = { [key: string]: unknown };

export interface Error2 {
  /** Error message */
  error: string;
  /** Additional error details */
  details?: Error2Details;
}

/**
 * Bad request
 */
export type BadRequestResponse = Error2;

/**
 * Unauthorized
 */
export type UnauthorizedResponse = Error2;

/**
 * Internal server error
 */
export type InternalServerErrorResponse = Error;

export type GithubCallbackParams = {
  /**
   * GitHub OAuth authorization code
   */
  code: string;
  /**
   * OAuth state parameter
   */
  state?: string;
};

/**
 * Refresh the access token using a valid refresh token
 * @summary Refresh access token
 */
export const refreshToken = (
  refreshTokenRequest: RefreshTokenRequest,
  signal?: AbortSignal,
) => {
  return customInstance<TokenResponse>({
    url: `/api/v1/auth/refresh`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: refreshTokenRequest,
    signal,
  });
};

export const getRefreshTokenMutationOptions = <
  TError = BadRequestResponse | UnauthorizedResponse,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof refreshToken>>,
    TError,
    { data: RefreshTokenRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof refreshToken>>,
  TError,
  { data: RefreshTokenRequest },
  TContext
> => {
  const mutationKey = ["refreshToken"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof refreshToken>>,
    { data: RefreshTokenRequest }
  > = (props) => {
    const { data } = props ?? {};

    return refreshToken(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type RefreshTokenMutationResult = NonNullable<
  Awaited<ReturnType<typeof refreshToken>>
>;
export type RefreshTokenMutationBody = RefreshTokenRequest;
export type RefreshTokenMutationError =
  | BadRequestResponse
  | UnauthorizedResponse;

/**
 * @summary Refresh access token
 */
export const useRefreshToken = <
  TError = BadRequestResponse | UnauthorizedResponse,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof refreshToken>>,
      TError,
      { data: RefreshTokenRequest },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof refreshToken>>,
  TError,
  { data: RefreshTokenRequest },
  TContext
> => {
  const mutationOptions = getRefreshTokenMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};

/**
 * Invalidate refresh token and logout user
 * @summary Logout user
 */
export const logout = (logoutRequest: LogoutRequest, signal?: AbortSignal) => {
  return customInstance<LogoutResponse>({
    url: `/api/v1/auth/logout`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: logoutRequest,
    signal,
  });
};

export const getLogoutMutationOptions = <
  TError = BadRequestResponse,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof logout>>,
    TError,
    { data: LogoutRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof logout>>,
  TError,
  { data: LogoutRequest },
  TContext
> => {
  const mutationKey = ["logout"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof logout>>,
    { data: LogoutRequest }
  > = (props) => {
    const { data } = props ?? {};

    return logout(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type LogoutMutationResult = NonNullable<
  Awaited<ReturnType<typeof logout>>
>;
export type LogoutMutationBody = LogoutRequest;
export type LogoutMutationError = BadRequestResponse;

/**
 * @summary Logout user
 */
export const useLogout = <TError = BadRequestResponse, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof logout>>,
      TError,
      { data: LogoutRequest },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof logout>>,
  TError,
  { data: LogoutRequest },
  TContext
> => {
  const mutationOptions = getLogoutMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};

/**
 * Get current authenticated user information
 * @summary Get current user
 */
export const getCurrentUser = (signal?: AbortSignal) => {
  return customInstance<User>({ url: `/api/v1/me`, method: "GET", signal });
};

export const getGetCurrentUserQueryKey = () => {
  return [`/api/v1/me`] as const;
};

export const getGetCurrentUserQueryOptions = <
  TData = Awaited<ReturnType<typeof getCurrentUser>>,
  TError = UnauthorizedResponse,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetCurrentUserQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getCurrentUser>>> = ({
    signal,
  }) => getCurrentUser(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getCurrentUser>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetCurrentUserQueryResult = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>
>;
export type GetCurrentUserQueryError = UnauthorizedResponse;

export function useGetCurrentUser<
  TData = Awaited<ReturnType<typeof getCurrentUser>>,
  TError = UnauthorizedResponse,
>(
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCurrentUser>>,
          TError,
          Awaited<ReturnType<typeof getCurrentUser>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetCurrentUser<
  TData = Awaited<ReturnType<typeof getCurrentUser>>,
  TError = UnauthorizedResponse,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCurrentUser>>,
          TError,
          Awaited<ReturnType<typeof getCurrentUser>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetCurrentUser<
  TData = Awaited<ReturnType<typeof getCurrentUser>>,
  TError = UnauthorizedResponse,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary Get current user
 */

export function useGetCurrentUser<
  TData = Awaited<ReturnType<typeof getCurrentUser>>,
  TError = UnauthorizedResponse,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetCurrentUserQueryOptions(options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Redirect to GitHub OAuth authorization
 * @summary GitHub OAuth redirect
 */
export const githubOAuth = (signal?: AbortSignal) => {
  return customInstance<unknown>({
    url: `/auth/github`,
    method: "GET",
    signal,
  });
};

export const getGithubOAuthQueryKey = () => {
  return [`/auth/github`] as const;
};

export const getGithubOAuthQueryOptions = <
  TData = Awaited<ReturnType<typeof githubOAuth>>,
  TError = null,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof githubOAuth>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGithubOAuthQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof githubOAuth>>> = ({
    signal,
  }) => githubOAuth(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof githubOAuth>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GithubOAuthQueryResult = NonNullable<
  Awaited<ReturnType<typeof githubOAuth>>
>;
export type GithubOAuthQueryError = null;

export function useGithubOAuth<
  TData = Awaited<ReturnType<typeof githubOAuth>>,
  TError = null,
>(
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof githubOAuth>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof githubOAuth>>,
          TError,
          Awaited<ReturnType<typeof githubOAuth>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGithubOAuth<
  TData = Awaited<ReturnType<typeof githubOAuth>>,
  TError = null,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof githubOAuth>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof githubOAuth>>,
          TError,
          Awaited<ReturnType<typeof githubOAuth>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGithubOAuth<
  TData = Awaited<ReturnType<typeof githubOAuth>>,
  TError = null,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof githubOAuth>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary GitHub OAuth redirect
 */

export function useGithubOAuth<
  TData = Awaited<ReturnType<typeof githubOAuth>>,
  TError = null,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof githubOAuth>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGithubOAuthQueryOptions(options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Handle GitHub OAuth callback and generate tokens
 * @summary GitHub OAuth callback
 */
export const githubCallback = (
  params: GithubCallbackParams,
  signal?: AbortSignal,
) => {
  return customInstance<unknown>({
    url: `/auth/github/callback`,
    method: "GET",
    params,
    signal,
  });
};

export const getGithubCallbackQueryKey = (params?: GithubCallbackParams) => {
  return [`/auth/github/callback`, ...(params ? [params] : [])] as const;
};

export const getGithubCallbackQueryOptions = <
  TData = Awaited<ReturnType<typeof githubCallback>>,
  TError = null,
>(
  params: GithubCallbackParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof githubCallback>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGithubCallbackQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof githubCallback>>> = ({
    signal,
  }) => githubCallback(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof githubCallback>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GithubCallbackQueryResult = NonNullable<
  Awaited<ReturnType<typeof githubCallback>>
>;
export type GithubCallbackQueryError = null;

export function useGithubCallback<
  TData = Awaited<ReturnType<typeof githubCallback>>,
  TError = null,
>(
  params: GithubCallbackParams,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof githubCallback>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof githubCallback>>,
          TError,
          Awaited<ReturnType<typeof githubCallback>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGithubCallback<
  TData = Awaited<ReturnType<typeof githubCallback>>,
  TError = null,
>(
  params: GithubCallbackParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof githubCallback>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof githubCallback>>,
          TError,
          Awaited<ReturnType<typeof githubCallback>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGithubCallback<
  TData = Awaited<ReturnType<typeof githubCallback>>,
  TError = null,
>(
  params: GithubCallbackParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof githubCallback>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary GitHub OAuth callback
 */

export function useGithubCallback<
  TData = Awaited<ReturnType<typeof githubCallback>>,
  TError = null,
>(
  params: GithubCallbackParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof githubCallback>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGithubCallbackQueryOptions(params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}
