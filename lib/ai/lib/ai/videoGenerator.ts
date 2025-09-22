// lib/ai/videoGenerator.ts
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';
import sharp from 'sharp';

const VIDEO_STORAGE = process.env.VIDEO_STORAGE_PATH || './public/videos';

if (!fs.existsSync(VIDEO_STORAGE)) {
  fs.mkdirSync(VIDEO_STORAGE, { recursive: true });
}

// Step 1: Generate AI Voice
async function generateVoice(script: string, outputPath: string) {
  const response = await axios.post(
    'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
    { text: script, voice_settings: { stability: 0.5, similarity_boost: 0.75 } },
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
    }
  );

  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Step 2: Download Stock Footage
async function downloadStockFootage(query: string, count = 3) {
  const response = await axios.get('https://api.pexels.com/videos/search', {
    params: { query, per_page: count },
    headers: { Authorization: process.env.PEXELS_API_KEY },
  });

  const videos = [];
  for (const video of response.data.videos.slice(0, count)) {
    const url = video.video_files.find((f: any) => f.width <= 1080)?.link;
    if (url) {
      const outputPath = path.join(VIDEO_STORAGE, `clip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.mp4`);
      const writer = fs.createWriteStream(outputPath);
      const res = await axios.get(url, { responseType: 'stream' });
      res.data.pipe(writer);
      await new Promise((resolve) => writer.on('finish', resolve));
      videos.push(outputPath);
    }
  }
  return videos;
}

// Step 3: Combine Clips + Voice + Text Overlay
export async function generateVideo(content: any) {
  const { title, script } = content;

  // Generate voice
  const voicePath = path.join(VIDEO_STORAGE, `voice-${Date.now()}.mp3`);
  await generateVoice(script, voicePath);

  // Get stock clips
  const clips = await downloadStockFootage(title);

  if (clips.length === 0) {
    throw new Error("No stock footage found");
  }

  // Create final video
  const outputPath = path.join(VIDEO_STORAGE, `final-${Date.now()}.mp4`);

  return new Promise<string>((resolve, reject) => {
    const command = ffmpeg();

    // Add first clip
    command.input(clips[0]);

    // Add voice
    command.input(voicePath);

    // Add title overlay
    command.videoFilters([
      {
        filter: 'drawtext',
        options: {
          text: title,
          fontsize: 48,
          fontcolor: 'white',
          box: 1,
          boxcolor: 'black@0.5',
          boxborderw: 5,
          x: '(w-text_w)/2',
          y: '(h-text_h)/10',
          fontfile: '/System/Library/Fonts/Helvetica.ttc',
        },
      },
    ]);

    command
      .audioCodec('aac')
      .videoCodec('libx264')
      .format('mp4')
      .on('end', () => {
        resolve(outputPath);
        // Cleanup
        fs.unlinkSync(voicePath);
        clips.forEach(clip => fs.existsSync(clip) && fs.unlinkSync(clip));
      })
      .on('error', reject)
      .save(outputPath);
  });
    }
