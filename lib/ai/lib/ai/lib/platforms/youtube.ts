// lib/platforms/youtube.ts
import { youtube_v3 } from '@googleapis/youtube';
import { google } from 'googleapis';
import fs from 'fs';

const youtube = new youtube_v3.Youtube({
  auth: process.env.YOUTUBE_ACCESS_TOKEN,
});

export async function uploadToYouTube(videoPath: string, title: string, description: string, tags: string[]) {
  try {
    const video = await youtube.videos.insert({
      part: ['snippet,status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: '22',
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    });

    return `https://youtube.com/watch?v=${video.data.id}`;
  } catch (error) {
    console.error('YouTube Upload Error:', error);
    throw error;
  }
}
