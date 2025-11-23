# Multilingual Chat Troubleshooting Guide

## Current Implementation

The multilingual chat uses:
1. **Sarvam AI** for non-English languages (if configured)
2. **Gemini AI** for English or as fallback
3. **Browser APIs** for voice recognition and TTS

## Debugging Steps

### 1. Check Environment Variables

Make sure your `.env` file in `backend/src/` has:

```env
GEMINI_API_KEY=your_gemini_key
SARVAM_API_KEY=your_sarvam_key
SARVAM_API_URL=https://api.sarvam.ai/v1/chat/completions
```

### 2. Check Backend Logs

When you send a message, check your backend console for:

- `🔍 Language check:` - Shows which language was detected
- `🌐 Using Sarvam AI for language:` - Confirms Sarvam is being used
- `✅ Sarvam AI response received` - Success message
- `❌ Sarvam AI error` - Error details

### 3. Common Issues

#### Issue: Sarvam API Not Working

**Symptoms:**
- Falls back to Gemini (English)
- Error in backend logs

**Solutions:**
1. **Check API Key**: Verify `SARVAM_API_KEY` is correct
2. **Check API URL**: Sarvam might use a different endpoint format
3. **Check Model Name**: The model `sarvam-ai/OpenHathi-Hi-v0.5` might not be correct
4. **Check API Format**: Sarvam might not use OpenAI-compatible format

#### Issue: Language Not Changing

**Symptoms:**
- Always responds in English
- Language selector doesn't affect responses

**Solutions:**
1. Check browser console for errors
2. Verify `selectedLanguage` state is updating
3. Check network tab to see if language parameter is sent
4. Verify backend receives the language parameter

#### Issue: Voice Not Working in Selected Language

**Symptoms:**
- Voice recognition always in English
- TTS always in English

**Solutions:**
1. Check browser supports the language (Chrome/Edge recommended)
2. Verify `VoiceContext` language is updating
3. Check browser console for speech recognition errors

### 4. Testing Individual Components

#### Test Language Selection
1. Open browser console
2. Select a language (e.g., Hindi)
3. Check console for: `Language changed to...`
4. Send a message
5. Check network tab - request should include `language: "hi"`

#### Test Backend Language Handling
1. Check backend logs when sending message
2. Should see: `🔍 Language check: hi, useSarvam: true`
3. If Sarvam fails, should see fallback message

#### Test Voice
1. Click microphone button
2. Speak in selected language
3. Check if browser recognizes the language
4. Check if response is spoken in selected language

### 5. Alternative: Use Gemini with Language Instructions

If Sarvam API doesn't work, Gemini can respond in multiple languages with proper instructions. The current implementation already includes this fallback.

To force Gemini multilingual mode:
1. Comment out Sarvam usage in `aiController.js`
2. The language instruction will be added to Gemini prompts
3. Gemini will respond in the requested language

### 6. Verify Sarvam API Format

Sarvam AI might use a different API format. Check:
- Official Sarvam documentation
- API endpoint format
- Request body format
- Authentication method

Current implementation assumes OpenAI-compatible format. If Sarvam uses a different format, update `backend/src/config/sarvam.js`.

## Quick Fix: Use Gemini for All Languages

If Sarvam isn't working, you can use Gemini for all languages:

1. The code already includes language instructions for Gemini
2. Gemini supports multiple languages natively
3. Just ensure `GEMINI_API_KEY` is set
4. The system will automatically use Gemini with language instructions

## Getting Help

1. Check backend console logs for detailed error messages
2. Check browser console for frontend errors
3. Check network tab to see API requests/responses
4. Verify all environment variables are set correctly

