import { taskEither } from "fp-ts";
import { ErrorDto, TypedError } from "../types/types";
import { errIdentity } from "../utils";

const getErrorDetails = async (response: Response): Promise<ErrorDto> => {
  if(response.status === 401) {
    return Promise.resolve({ errorType: "AuthorizationError", message: "User is unauthorized or session is expired" });
  }
  try {
    return await response.json();
  } catch(err) {
    console.log(err);
    return Promise.resolve({ errorType: "NetworkError", message: "Issue has occured while communicating to the server" });
  }
};

export const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);
  if (!response.ok) {
    const error = await getErrorDetails(response);
    throw new TypedError(error.errorType, error.message);
  }

  return response.json();
};

export const fetchText = async (url: string, init?: RequestInit): Promise<string> => {
  const response = await fetch(url, init);
  if (!response.ok) {
    const error = await getErrorDetails(response);
    throw new TypedError(error.errorType, error.message);
  }

  return response.text();
};

export const fetchEmpty = async (url: string, init?: RequestInit): Promise<void> => {
  const response = await fetch(url, init);
  if (!response.ok) {
    const error = await getErrorDetails(response);
    throw new TypedError(error.errorType, error.message);
  }
};

export const getTextRequest = (url: string, headers?: HeadersInit) => taskEither.tryCatch(
  () => fetchText(url, { headers }) as Promise<string>,
  errIdentity<TypedError>()
);

export const getRequest = <T>(url: string, headers?: HeadersInit) => taskEither.tryCatch(
  () => fetchJson(url, { headers }) as Promise<T>,
  errIdentity<TypedError>()
);

export const postRequest = <T>(url: string, body?: BodyInit, headers?: HeadersInit) => taskEither.tryCatch(
  () => fetchJson(url, { method: "POST", headers, body }) as Promise<T>,
  errIdentity<TypedError>()
);

export const postRequestWithoutResult = (url: string, body?: BodyInit, headers?: HeadersInit) => taskEither.tryCatch(
  () => fetchEmpty(url, { method: "POST", headers, body }),
  errIdentity<TypedError>()
);

export const patchRequest = <T>(url: string, body?: BodyInit, headers?: HeadersInit) => taskEither.tryCatch(
  () => fetchJson(url, { method: "PATCH", headers, body }) as Promise<T>,
  errIdentity<TypedError>()
);

export const patchRequestWithoutResult = (url: string, body?: BodyInit, headers?: HeadersInit) => taskEither.tryCatch(
  () => fetchEmpty(url, { method: "PATCH", headers, body }),
  errIdentity<TypedError>()
);

export const deleteRequest = (url: string, headers?: HeadersInit) => taskEither.tryCatch(
  () => fetchJson(url, { method: "DELETE", headers }),
  errIdentity<TypedError>()
);