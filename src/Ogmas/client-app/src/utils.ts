export const liftPromise = <A, B>(func: (arg: A) => B) => (value: Promise<A>) => value.then(func);

export const errIdentity = (a: unknown) => a as Error;

export const safeCall = <T extends any[]>(func?: (...args: T) => void) => (...args: T) => func && func(...args);