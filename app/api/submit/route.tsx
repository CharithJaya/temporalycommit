// app/api/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface SubmissionData {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse JSON body
    const data: SubmissionData = await request.json();

    // 2. Extract fields
    const { name, email, message } = data;

    // 3. Validate
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Example: log data
    console.log('Received submission:', data);

    // 4. Success response
    return NextResponse.json(
      { message: 'Submission successful!', data },
      { status: 200 }
    );
  } catch (error) {
    // 5. Handle errors
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
