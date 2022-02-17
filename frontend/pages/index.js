import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const RANDOM_SONG = gql`
query {
  randomSong {
    songId
    neteaseMusicId
    lyrics
  }
}
`

function RandomSong () {
  const { loading, error, data, refetch } = useQuery(RANDOM_SONG);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const { songId, neteaseMusicId, lyrics } = data.randomSong

  return <>
    <p><span>{songId}</span> <span>{neteaseMusicId}</span></p>
    {lyrics.split("\n").map(line => <p key={String(Math.random())}>{line}</p>)}
    <button onClick={() => refetch()}>Random</button>
    </>
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
  )
}
