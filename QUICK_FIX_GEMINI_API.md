# Quick Fix: Gemini API Key Error

## Error Message
```
Invalid Gemini API key. Please check your GEMINI_API_KEY in .env file.
```

## Solution Steps

### 1. Create/Check `.env` File

Navigate to `backend/src/` directory and create a `.env` file if it doesn't exist:

```bash
cd backend/src
```

### 2. Add Your Gemini API Key

Open the `.env` file and add:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Important:**
- Replace `your_actual_api_key_here` with your real API key
- No spaces around the `=` sign
- No quotes around the key value
- Make sure there are no extra spaces or characters

### 3. Get Your Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key" or use an existing key
4. Copy the API key
5. Paste it in your `.env` file

### 4. Restart Your Backend Server

**IMPORTANT:** After adding/changing the `.env` file, you MUST restart your backend server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend/src
npm run dev
```

### 5. Verify It's Working

Check your backend console. You should see:
```
✅ Gemini AI initialized successfully
```

If you see:
```
❌ Error: GEMINI_API_KEY is missing in .env
```

Then:
- Check the `.env` file is in `backend/src/` (not `backend/`)
- Check the file is named exactly `.env` (not `.env.txt` or `env`)
- Check there are no typos: `GEMINI_API_KEY` (not `GEMINI_API` or `GEMINI_KEY`)
- Restart the server after making changes

## Example `.env` File

Your `backend/src/.env` file should look like this:

```env
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
SARVAM_API_KEY=your_sarvam_key_here
MONGODB_URI=mongodb://localhost:27017/joblelo
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

## Common Mistakes

1. ❌ **Wrong location**: `.env` in `backend/` instead of `backend/src/`
2. ❌ **Wrong filename**: `.env.txt` or `env` instead of `.env`
3. ❌ **Typos**: `GEMINI_API` instead of `GEMINI_API_KEY`
4. ❌ **Spaces**: `GEMINI_API_KEY = value` (should be `GEMINI_API_KEY=value`)
5. ❌ **Quotes**: `GEMINI_API_KEY="value"` (should be `GEMINI_API_KEY=value`)
6. ❌ **Not restarting**: Changed `.env` but didn't restart server

## Still Not Working?

1. Check backend console for error messages
2. Verify the API key is valid at https://makersuite.google.com/app/apikey
3. Make sure you're using the correct API key (not a different Google API key)
4. Check if the API key has proper permissions enabled
5. Try generating a new API key

## Test Your Setup

After fixing, try sending a message in the chat. It should work now! 🎉

