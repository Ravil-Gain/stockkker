import Head from "next/head";
import { useEffect, useState } from "react";

export default function Stock() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Head>
        <title>Stockker</title>
        <meta name="description" content="Stockker App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="w-full m-auto md:w-2/3 text-center">
          <h1 className="text-4xl pb-8"> Reserves </h1>
          <div></div>
        </div>
      </main>
    </div>
  );
}
