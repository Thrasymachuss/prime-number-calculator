import checkFactor from "./check-factor";

export const calcPrime = (num: number): boolean => {
  let isPrime: boolean = true;

  for (let i = 2; i < num; i++) {
    if (checkFactor(num, i)) {
      isPrime = false;
    }
  }

  return isPrime;
};
