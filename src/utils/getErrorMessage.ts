const getErrorMessage = (err: unknown): string => {
  return err instanceof Error ? err.message : "Something went wrong";
};

export default getErrorMessage;
