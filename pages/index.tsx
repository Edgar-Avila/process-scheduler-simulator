import { Inter } from "next/font/google";
import Link from "next/link";

export default function Home() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Process Scheduler Simulator</h1>
          <p className="py-6">
            This Process Scheduler Simulator will help you better understand the
            inner work of your OS.
          </p>
          <Link href="/app">
            <button className="btn btn-primary">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
