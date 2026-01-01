export type ApiSuccess<T = undefined> = {
  success: true;
  message: string;
  data?: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

export type ApiResponse<T = undefined> = ApiSuccess<T> | ApiError;
