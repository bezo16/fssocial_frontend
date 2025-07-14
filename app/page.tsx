"use client"
import BaseButton from "@/components/common/BaseButton";
import Link from "next/link";


export default function Home() {
  return (
    <div>
      <h1>bezo social app</h1>
      <p>not already signed in?</p>
      <Link href="/auth/login">Sign in !!</Link>
      <BaseButton label="click me" onClick={() => console.log("jebotron")}  />
    </div>
  );
}
