import Head from "next/head";
import Image from "next/image";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import styles from "../styles/Home.module.css";

const RANDOM_SONG = gql`
query {
  randomSong {
    songId
    neteaseMusicId
    lyrics
  }
}
`;

function RefetchButton(props) {
  return <button onClick={() => {
    props.refetch();
    document.documentElement.scrollTop = 0;
  }}>Random</button>;
}

function RandomSong() {
  const {
    loading, error, data, refetch
  } = useQuery(RANDOM_SONG);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error :(</p>;
  }

  const {
    songId, neteaseMusicId, lyrics
  } = data.randomSong;

  return <>
    <p><span>{songId}</span> <span>{neteaseMusicId}</span></p>
    <RefetchButton refetch={refetch}></RefetchButton>
    {lyrics.split("\n").map(line => <p key={String(Math.random())}>{line}</p>)}
    <RefetchButton refetch={refetch}></RefetchButton>
  </>;
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Linguistics</title>
        <meta name="description" content="语言学工具" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Linguistics</h1>
        <RandomSong></RandomSong>
      </main>
    </div>
  );
}
