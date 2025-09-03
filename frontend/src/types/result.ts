export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export const success = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
});

export const error = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
});

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}
