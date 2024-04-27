import Daily from "@daily-co/daily-js"

class DailyVoiceProvider {
    daily: any

    constructor() {
        // Example: createCallObject sets the videoSource property to false
    const call = Daily.createCallObject({
        audioSource: true, // Start with audio on to get mic permission from participant at start
        videoSource: false,
    });
    
    }
}