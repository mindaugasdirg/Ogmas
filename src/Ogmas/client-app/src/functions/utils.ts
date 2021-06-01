import { SeverityTypes, TypedError } from "../types/types";
import { task, taskEither } from "fp-ts";

export const liftPromise = <A, B>(func: (arg: A) => B) => (value: Promise<A>) => value.then(func);

export const errIdentity = <T extends Error>() => (a: unknown) => a as T;
export const mapError = (type: string) => (a: unknown) => {
  if ((a as any).type) return a as TypedError;
  return new TypedError(type, (a as Error).message);
}

export const safeCall = <T extends any[]>(func?: (...args: T) => void) => (...args: T) => func && func(...args);

export const foldError = <R>(addAlert: (message: string, severity: SeverityTypes) => void, rightFunc: (arg: R) => void) =>
  taskEither.fold<TypedError, R, void>(
    left => task.fromIO(() => addAlert(left.message, "error")),
    right => task.fromIO(() => rightFunc(right))
  );

export const modifyListItem = <T>(index: number, func: (question: T) => T) => (prev: T[]) =>
  [...prev.slice(0, index), func(prev[index]), ...prev.slice(index + 1)];

export const handleChange = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => setter(event.target.value);