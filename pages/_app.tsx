import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Colors,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Colors,
  Legend,
  Tooltip
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
      <title>Process Scheduler Simulator</title>
    </Head>
    <div className='min-h-screen'>
      <Component {...pageProps} />
    </div>
    </>
  )
}
