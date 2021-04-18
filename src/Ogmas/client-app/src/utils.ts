export const liftPromise = <A, B>(func: (arg: A) => B) => (value: Promise<A>) => value.then(func);

export const errIdentity = (a: unknown) => a as Error;