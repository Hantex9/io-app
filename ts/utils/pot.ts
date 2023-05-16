import * as pot from "@pagopa/ts-commons/lib/pot";
import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";
import { pipe } from "fp-ts/lib/function";

// type alias of pot.Some to make possible type guard, since pot.Some is not exported
interface Some<T> {
  readonly kind: "PotSome";
  readonly value: T;
}

// return true if pot is just None, not NoneLoading, nor NoneUpdating, nor NoneError
export const isStrictNone = <T, E>(p: pot.Pot<T, E>): boolean =>
  pot.isNone(p) && !pot.isLoading(p) && !pot.isUpdating(p) && !pot.isError(p);

// return true if pot is some and not someError and not someLoading
export const isStrictSome = <T, E>(p: pot.Pot<T, E>): p is Some<T> =>
  p.kind === "PotSome";

/**
 * A function that returns a printable value from a pot;
 *
 * *A __printable value__ is a value that can be printed in a UI, so it is a string, a number or a boolean*
 * @param targetPot The pot from which the value is extracted
 * @param value The key of the value to be printed
 * @param fallbackValue The string value to be returned if the pot is not a `pot.Some`
 * @returns
 */
export const getPrintableValueFromPot = <T, E, K extends keyof T>(
  targetPot: pot.Pot<T, E>,
  value: K,
  fallbackValue: string
) =>
  pot.getOrElse(
    pot.map(targetPot, p =>
      pipe(
        p[value],
        t.union([t.string, t.number, t.boolean]).decode, // A value is printable only if it is a string, a number or a boolean
        E.fold(
          () => fallbackValue,
          v => v.toString()
        )
      )
    ),
    fallbackValue
  );
