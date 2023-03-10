export type HookFetchResponse = {
  data?: any;
  isLoading?: boolean;
  error?: boolean;
};

export type ResponseData = {
  success: boolean;
  message: string;
  data: any | null;
};
