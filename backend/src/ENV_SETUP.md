# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env` file in the `backend/src/` directory with the following variables:

```env
# Google Gemini AI Configuration
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Sarvam AI Configuration (for multilingual support)
# Get your API key from: https://sarvam.ai
SARVAM_API_KEY=your_sarvam_api_key_here
SARVAM_API_URL=https://api.sarvam.ai/v1/chat/completions

# MongoDB Connection
# Format: mongodb://username:password@host:port/database
# Or: mongodb://localhost:27017/joblelo
MONGODB_URI=mongodb://localhost:27017/joblelo

# JWT Secret for authentication
# Generate a random string for production
JWT_SECRET=your_jwt_secret_key_here

# Server Port
PORT=5000
```

## Quick Setup Steps

1. **Create the .env file:**
   ```bash
   cd backend/src
   touch .env
   ```

2. **Add your Gemini API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key
   - Copy it to `.env` as `GEMINI_API_KEY=your_key_here`

3. **Add your Sarvam API Key (optional for multilingual):**
   - Visit: https://sarvam.ai
   - Get your API key
   - Copy it to `.env` as `SARVAM_API_KEY=your_key_here`

4. **Set MongoDB URI:**
   - Use your MongoDB connection string
   - Or use local: `MONGODB_URI=mongodb://localhost:27017/joblelo`

5. **Set JWT Secret:**
   - Generate a random string (e.g., use `openssl rand -base64 32`)
   - Add to `.env` as `JWT_SECRET=your_secret_here`

## Error: API key not valid

If you see the error:
```
API key not valid. Please pass a valid API key.
```

**Solutions:**
1. Check that your `.env` file exists in `backend/src/`
2. Verify the API key is correct (no extra spaces)
3. Restart your server after adding the API key
4. For Gemini: Make sure the API key is from https://makersuite.google.com/app/apikey
5. Check that the API key has proper permissions enabled

## Testing Your Setup

After setting up your `.env` file:

1. Restart your backend server
2. Check the console for initialization messages:
   - ✅ `Gemini AI initialized successfully` (if Gemini key is set)
   - ⚠️ `Warning: SARVAM_API_KEY is missing` (if Sarvam key is missing)

3. Try making a chat request - it should work if configured correctly

## Security Notes

- **NEVER commit your `.env` file to git** (it's already in .gitignore)
- Use different API keys for development and production
- Rotate your API keys regularly
- Keep your JWT_SECRET secure and random

