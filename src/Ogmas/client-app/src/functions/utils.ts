import { TypedError } from "../types/types";

export const liftPromise = <A, B>(func: (arg: A) => B) => (value: Promise<A>) => value.then(func);

export const errIdentity = <T extends Error>() => (a: unknown) => a as T;
export const mapError = (type: string) => (a: unknown) => {
    if((a as any).type) return a as TypedError;
    return new TypedError(type, (a as Error).message);
}

export const safeCall = <T extends any[]>(func?: (...args: T) => void) => (...args: T) => func && func(...args);