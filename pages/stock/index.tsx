import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Stockker</title>
        <meta name="description" content="Stockker App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="w-full m-auto md:w-2/3 text-center">
          <h1 className="text-4xl pb-8"> Status </h1>
          <div>
          </div>
        </div>
      </main>
    </div>
  );
}