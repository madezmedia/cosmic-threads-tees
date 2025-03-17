import { NextResponse } from "next/server"

export class AppError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = "AppError"
  }
}

export function handleError(error: unknown) {
  console.error("Error:", error)

  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode })
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}

