// app/api/autopilot/trigger/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST() {
  exec('npm run autopilot:test', (error, stdout, stderr) => {
    if (error) console.error(`exec error: ${error}`);
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

  return NextResponse.json({ message: 'AutoPilot triggered manually' });
}
