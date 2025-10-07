import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Important: disable caching for live data
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
