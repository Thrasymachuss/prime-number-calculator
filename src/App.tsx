import {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useState,
  useMemo,
} from "react";
import { IPrimeRange } from "./interfaces";
import { v4 } from "uuid";
import PrimeRange from "./components/PrimeRange";
import styles from "./App.module.css";

function App() {
  const [inputs, setInputs] = useState<(number | null)[]>([null, null]);
  const [primeRanges, setPrimeRanges] = useState<IPrimeRange[]>([]);
  const [ready, setReady] = useState(true);
  const [nextVals, setNextVals] = useState({
    nums: [0, 0],
    id: "",
    current: 0,
  });
  const worker = useMemo(
    () => new Worker(new URL("./worker/worker.ts", import.meta.url)),
    []
  );

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      inputs[0] &&
      inputs[0] > 0 &&
      inputs[1] &&
      inputs[1] > 0 &&
      inputs[0] <= inputs[1] &&
      ready
    ) {
      setReady(false);
      worker.postMessage([inputs, v4(), inputs[0]]);
    }
  };

  worker.onmessage = (e) => {
    const [nums, current, id, isPrime] = e.data;
    const componentExists = primeRanges.find((range) => range.id === id);

    if (isPrime) {
      if (componentExists) {
        setPrimeRanges(
          primeRanges.map((range) =>
            range.id === id
              ? {
                  ...range,
                  primes: [...range.primes, current],
                }
              : range
          )
        );
      } else {
        setPrimeRanges([
          {
            id: id,
            low: Number(inputs[0]),
            high: Number(inputs[1]),
            primes: [current],
          },
          ...primeRanges,
        ]);
      }
    }

    if (current < nums[1]) {
      setNextVals({
        nums: nums,
        current: current + 1,
        id: id,
      });
    } else {
      setNextVals({
        nums: [0, 0],
        current: 0,
        id: "",
      });
    }
  };

  useEffect(() => {
    if (nextVals.id) {
      const { nums, id, current } = nextVals;
      setTimeout(() => worker.postMessage([nums, id, current]), 100);
    } else {
      setReady(true);
    }
  }, [nextVals, worker]);

  const changeInput = (index: number): ChangeEventHandler => {
    return (e: ChangeEvent<HTMLInputElement>): void => {
      const target = e.target as HTMLInputElement;
      setInputs(
        index
          ? [inputs[0], Number(target?.value) || null]
          : [Number(target?.value) || null, inputs[1]]
      );
    };
  };

  return (
    <div className="App">
      <header className={styles.header}>
        <h1>Prime Number Calculator</h1>
      </header>
      <div className={styles["form-wrap"]}>
        <form onSubmit={sendMessage}>
          <div className={styles["form-inner"]}>
            <label htmlFor="low-num">Low End</label>
            <input
              type="number"
              value={Number(inputs[0]) || ""}
              onChange={changeInput(0)}
              min={0}
              id="low-num"
            />
          </div>
          <div className={styles["form-inner"]}>
            <label htmlFor="high-num">High End</label>
            <input
              type="number"
              value={Number(inputs[1]) || ""}
              onChange={changeInput(1)}
              min={0}
              id="high-num"
            />
          </div>
          <button>Calculate Primes</button>
        </form>
      </div>
      <div>
        {primeRanges.map((range) => (
          <PrimeRange {...range} key={range.id} />
        ))}
      </div>
    </div>
  );
}

export default App;
