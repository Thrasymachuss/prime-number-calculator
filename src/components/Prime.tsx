import styles from "./Prime.module.css";

interface props {
  prime: number;
}

function Prime({ prime }: props) {
  return <div className={styles.prime}>{prime}</div>;
}

export default Prime;
