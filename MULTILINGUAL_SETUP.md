# Multilingual Chat Setup Guide

This guide explains how to set up and use the multilingual chat feature powered by Sarvam AI.

## Features

- **10+ Languages Supported**: Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, and English
- **Multilingual Voice Input**: Speech recognition works in all supported languages
- **Multilingual Voice Output**: Text-to-speech responds in the selected language
- **Automatic Language Detection**: Chat responds in the selected language (both text and voice)
- **Fallback Support**: Automatically falls back to Gemini (English) if Sarvam AI is unavailable
- **Language Selector**: Easy-to-use dropdown in the chat interface
- **Voice + Text Chat**: Complete multilingual support for both voice and text interactions

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
All required dependencies are already installed (`axios` is in package.json).

#### Environment Variables
Add the following to your `.env` file in the `backend/src` directory:

```env
# Sarvam AI Configuration
SARVAM_API_KEY=your_sarvam_api_key_here
SARVAM_API_URL=https://api.sarvam.ai/v1/chat/completions
```

**Note**: 
- Get your Sarvam API key from [Sarvam AI Platform](https://sarvam.ai)
- The API URL might vary based on Sarvam's documentation - adjust if needed
- The model name in `sarvam.js` might need adjustment based on Sarvam's available models

### 2. Sarvam API Configuration

The current implementation uses:
- **Model**: `sarvam-ai/OpenHathi-Hi-v0.5` (default, may need adjustment)
- **Endpoint**: `/v1/chat/completions` (standard OpenAI-compatible format)

**Important**: Please verify:
1. The correct API endpoint URL from Sarvam documentation
2. The available model names for your API key
3. The request/response format (should be OpenAI-compatible)

### 3. Testing

1. Start your backend server:
   ```bash
   cd backend/src
   npm run dev
   ```

2. Start your frontend:
   ```bash
   cd frontend/vite-project
   npm run dev
   ```

3. Navigate to the Chat Assistant page
4. Click the language selector (globe icon) in the header
5. Select a language (e.g., Hindi)
6. Type a message in that language
7. The AI should respond in the selected language

## Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| en | English | English |
| hi | Hindi | हिंदी |
| ta | Tamil | தமிழ் |
| te | Telugu | తెలుగు |
| kn | Kannada | ಕನ್ನಡ |
| ml | Malayalam | മലയാളം |
| mr | Marathi | मराठी |
| bn | Bengali | বাংলা |
| gu | Gujarati | ગુજરાતી |
| pa | Punjabi | ਪੰਜਾਬੀ |

## API Endpoints

### Get Supported Languages
```
GET /api/languages
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "languages": [
    { "code": "en", "name": "English" },
    { "code": "hi", "name": "हिंदी (Hindi)" },
    ...
  ]
}
```

### Chat with Language
```
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Hello" }
  ],
  "language": "hi"
}
```

## Troubleshooting

### Sarvam API Not Working

1. **Check API Key**: Verify your `SARVAM_API_KEY` is correct in `.env`
2. **Check API URL**: Ensure the `SARVAM_API_URL` matches Sarvam's documentation
3. **Check Model Name**: Update the model name in `backend/src/config/sarvam.js` if needed
4. **Check Network**: Ensure your server can reach Sarvam's API endpoints
5. **Fallback**: The system will automatically fall back to Gemini (English) if Sarvam fails

### Language Not Responding Correctly

1. Ensure the language code matches one of the supported languages
2. Check browser console for any API errors
3. Verify Sarvam API supports the selected language

### Frontend Language Selector Not Showing

1. Check if languages are loaded: Open browser console and look for language loading errors
2. Verify the `/api/languages` endpoint is accessible
3. Check authentication token is valid

## Customization

### Adding More Languages

Edit `backend/src/config/sarvam.js`:

```javascript
export const SUPPORTED_LANGUAGES = {
  // ... existing languages
  'or': { name: 'ଓଡ଼ିଆ (Odia)', code: 'or', sarvamCode: 'or' },
  // Add more languages here
};
```

### Adjusting Sarvam Model

In `backend/src/config/sarvam.js`, update the model name:

```javascript
const requestBody = {
  model: 'your-sarvam-model-name', // Update this
  // ... rest of config
};
```

## Notes

- **Text Chat**: 
  - English always uses Gemini AI for consistency
  - Non-English languages use Sarvam AI
  - If Sarvam fails, the system automatically falls back to Gemini (English)
  
- **Voice Features**:
  - Speech recognition language automatically matches the selected chat language
  - Text-to-speech uses the selected language for all responses
  - Voice input in chat respects the selected language
  - Browser's native speech recognition and TTS are used (Chrome/Edge recommended)
  
- **Language Synchronization**:
  - When you change the language in chat, voice recognition and TTS automatically update
  - The language preference is sent with each chat request
  - All voice feedback (announcements, errors, confirmations) adapt to the selected language

## Support

For Sarvam AI specific issues, refer to:
- [Sarvam AI Documentation](https://docs.sarvam.ai)
- [Sarvam AI Support](https://sarvam.ai/support)

