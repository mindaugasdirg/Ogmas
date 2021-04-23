import { taskEither } from "fp-ts";
import { ErrorDto, TypedError } from "../types/types";
import { errIdentity } from "../utils";

const getErrorDetails = (response: Response): Promise<ErrorDto> => {
  if(response.status === 401) {
    return Promise.resolve({ errorType: "AuthorizationError", message: "User is unauthorized or session is expired" });
  }
  return response.json();
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

export const patchRequest = <T>(url: string, body?: BodyInit, headers?: HeadersInit) => taskEither.tryCatch(
  () => fetchJson(url, { method: "PATCH", headers, body }) as Promise<T>,
  errIdentity<TypedError>()
);

export const deleteRequest = (url: string, headers?: HeadersInit) => taskEither.tryCatch(
  () => fetchJson(url, { method: "DELETE", headers }),
  errIdentity<TypedError>()
);