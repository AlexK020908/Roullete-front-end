import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import RoulleteEnterance from "../components/RoulleteEnterance"
export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Smart Contract Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <RoulleteEnterance />
        </div>
    )
}
