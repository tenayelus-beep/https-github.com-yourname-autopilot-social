// lib/scheduler/cron.ts
import cron from 'node-cron';
import { generateContentPlan } from '../ai/contentPlanner';
import { generateVideo } from '../ai/videoGenerator';
import fs from 'fs';

async function runAutopilot() {
  try {
    console.log('🚀 Starting AutoPilot Social Cycle...');

    const content = await generateContentPlan();
    console.log('📝 Content Plan:', content);

    const videoPath = await generateVideo(content);
    console.log('🎬 Video Generated:', videoPath);

    if (process.env.REQUIRE_HUMAN_APPROVAL === 'true') {
      const pending = { id: Date.now(), content, videoPath, status: 'pending' };
      fs.writeFileSync(`./pending-${pending.id}.json`, JSON.stringify(pending, null, 2));
      console.log('⏳ Waiting for human approval...');
      return;
    }

    console.log('🎉 AutoPilot Cycle Completed — in real version, would post to platforms now.');

  } catch (error) {
    console.error('🔥 AutoPilot Failed:', error);
  }
}

cron.schedule('0 9 * * *', runAutopilot);
runAutopilot();
console.log('⏰ AutoPilot Social Scheduler Started');
