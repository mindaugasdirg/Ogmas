import { taskEither } from "fp-ts";
import { errIdentity } from "../utils";

export const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(url, init);
    if(!response.ok) {
        throw new Error(`Request returned error code: ${response.status} and message ${await response.text()}`);
    }

    return response.json();
};

export const getRequest = <T>(url: string, headers?: HeadersInit) => taskEither.tryCatch(
    () => fetchJson(url, { headers }) as Promise<T>,
    errIdentity
);

export const postRequest = <T>(url: string, body?: BodyInit, headers?: HeadersInit) => taskEither.tryCatch(
    () => fetchJson(url, { method: "POST", headers, body }) as Promise<T>,
    errIdentity
);

export const patchRequest = <T>(url: string, body?: BodyInit, headers?: HeadersInit) => taskEither.tryCatch(
    () => fetchJson(url, { method: "PATCH", headers, body }) as Promise<T>,
    errIdentity
);

export const deleteRequest = (url: string, headers?: HeadersInit) => taskEither.tryCatch(
    () => fetchJson(url, { method: "DELETE", headers }),
    errIdentity
);