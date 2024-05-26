import { useEffect } from 'react';
import { useRouteError, Link } from 'react-router-dom';

import styles from './error.module.css';

function ErrorBoundary() {
  const error = useRouteError();

  useEffect(() => console.error("Route error: ", error), [error]);

  const refreshHandler = () => window.location.reload();

  if(error?.status === 404) return (
    <section className={styles.container}>
      <header>
        <h2>{error.status} - {error.statusText}</h2>
        <p>Przepraszamy, ale strona, której szukasz, nie istnieje. Sprawdź, czy adres URL jest poprawny lub wróć na stronę główną.</p>
        <Link to="/" className={`${styles.link} button`}>Wróć na stronę główną</Link>
      </header>
    </section>
  )

  return (
    <div className={styles.container}>
      <header>
        <h2>Coś poszło nie tak</h2>
        <p>Przepraszamy za niedogodności. Spróbuj odświeżyć stronę. Postaramy się rozwiązać problem jak najszybciej.</p>
        <button onClick={refreshHandler} className="button">Odśwież stronę</button>
      </header>
    </div>
  )
}

export default ErrorBoundary