"use client"
import BaseButton from "@/components/common/BaseButton"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#2d3748", marginBottom: "1rem" }}>bezo social app</h1>
      <Link href="/auth/login" style={{ marginBottom: "2rem" }}>
        <BaseButton label="Sign in !!" onClick={() => {}} />
      </Link>
      <Link href="/auth/register" style={{ marginBottom: "2rem" }}>
        <BaseButton label="Register !!" onClick={() => {}} />
      </Link>
      <Image
        src="/misko_javornik.jpg"
        alt="Misko Javornik"
        width={700}
        height={320}
        style={{ borderRadius: "1.5rem", boxShadow: "0 4px 24px rgba(0,0,0,0.12)", marginTop: "2rem" }}
      />
    </div>
  )
}
