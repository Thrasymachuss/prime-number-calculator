import { IPrimeRange } from "../interfaces";
import Prime from "./Prime";
import styles from "./PrimeRange.module.css";

function PrimeRange(props: IPrimeRange) {
  return (
    <div className={styles.wrap}>
      <div className={styles.range}>
        {props.low} - {props.high}
      </div>
      <div className={styles.primes}>
        {props.primes.map((prime, i) => (
          <Prime prime={prime} key={i} />
        ))}
      </div>
    </div>
  );
}

export default PrimeRange;
