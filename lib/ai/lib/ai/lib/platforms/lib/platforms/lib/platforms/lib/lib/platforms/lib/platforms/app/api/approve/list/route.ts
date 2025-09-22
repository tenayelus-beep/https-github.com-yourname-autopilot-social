// app/api/approve/list/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
  const files = fs.readdirSync('.').filter(f => f.startsWith('pending-'));
  const pending = files.map(file => {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  });

  return NextResponse.json(pending);
}
