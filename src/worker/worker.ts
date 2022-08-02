import { calcPrime } from "../prime-calculator/prime-calculator";

onmessage = (msg): void => {
  const [nums, id, current] = msg.data;
  const isPrime = calcPrime(current);
  postMessage([nums, current, id, isPrime]);
};
