# 🎙️ VoiceForge - Complete Setup Guide

A full-stack voice cloning application powered by Qwen3-TTS, FastAPI, and React.

---

## 📁 Project Structure

```
Voice_clone/
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── VoiceCloneCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── BackgroundEffects.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/                  # FastAPI
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
│
├── colab/                    # Google Colab notebook
│   └── VoiceForge_Colab_Server.ipynb
│
├── SETUP_GUIDE.md           # This file
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.9+ (for backend)
- **Google Account** (for Colab)
- **ngrok Account** (free tier works)

---

## Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd Voice_clone
```

---

## Step 2: Frontend Setup

### 2.1 Navigate to Frontend Directory

```bash
cd frontend
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Configure Environment Variables

```bash
# Copy the example env file
copy .env.example .env
```

Edit `.env` and set:

```env
VITE_API_URL=http://localhost:8000
```

### 2.4 Start Development Server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

---

## Step 3: Backend Setup

### 3.1 Open New Terminal & Navigate to Backend

```bash
cd backend
```

### 3.2 Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3.3 Install Dependencies

```bash
pip install -r requirements.txt
```

### 3.4 Configure Environment Variables

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

**Important:** Leave `COLAB_URL` empty for now. You'll add it after setting up Colab.

### 3.5 Start Backend Server

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: **http://localhost:8000**

---

## Step 4: Google Colab Setup

### 4.1 Get ngrok Auth Token

1. Go to [ngrok.com](https://ngrok.com) and create a free account
2. Navigate to: **Dashboard → Your Authtoken**
3. Copy your auth token

### 4.2 Open Colab Notebook

1. Go to [Google Colab](https://colab.research.google.com)
2. Click **File → Upload notebook**
3. Upload `colab/VoiceForge_Colab_Server.ipynb`

### 4.3 Enable GPU Runtime

1. Click **Runtime → Change runtime type**
2. Select **GPU** (T4 recommended)
3. Click **Save**

### 4.4 Run All Cells

Execute cells in order:

1. **Cell 1**: Installs all dependencies
2. **Cell 2**: Verifies GPU availability
3. **Cell 3**: Loads Qwen3-TTS model (may take 2-5 minutes)
4. **Cell 4**: Sets up voice cloning function
5. **Cell 5**: Prompts for ngrok token - paste your token here
6. **Cell 6**: Configures FastAPI server
7. **Cell 7**: Starts server and displays public URL

### 4.5 Copy the Public URL

After running Cell 7, you'll see output like:

```
🚀 VoiceForge Colab Server is running!
📡 Public URL: https://abc123.ngrok-free.app
```

Copy this URL!

---

## Step 5: Connect Backend to Colab

### 5.1 Update Backend Environment

Edit `backend/.env`:

```env
COLAB_URL=https://abc123.ngrok-free.app
```

Replace with your actual ngrok URL.

### 5.2 Restart Backend

Stop the backend (Ctrl+C) and start it again:

```bash
python main.py
```

---

## Step 6: Test the Application

1. Open **http://localhost:3000** in your browser
2. Upload a reference voice (WAV file, 5-30 seconds works best)
3. Enter text to generate
4. Click **Generate Voice**
5. Wait for processing (10-60 seconds depending on text length)
6. Play or download the generated audio

---

## 🔧 Troubleshooting

### Frontend Issues

#### "Module not found" errors

```bash
rm -rf node_modules
npm install
```

#### Port 3000 already in use

Edit `vite.config.js` and change the port:

```javascript
server: {
  port: 3001,
}
```

---

### Backend Issues

#### "COLAB_URL not configured"

Make sure you've added the ngrok URL to `backend/.env`:

```env
COLAB_URL=https://your-url.ngrok-free.app
```

#### Connection refused to Colab

1. Check if Colab notebook is still running
2. Verify the ngrok URL is correct
3. Check Colab output for errors

#### Timeout errors

- The model may need more time for longer text
- Try shorter text first
- Check Colab GPU memory usage

---

### Colab Issues

#### "CUDA out of memory"

1. Go to **Runtime → Restart runtime**
2. Run all cells again
3. Try shorter reference audio (< 10 seconds)

#### ngrok URL changed

ngrok URLs change when you restart the tunnel:

1. Run Cell 7 again to get new URL
2. Update `backend/.env` with new URL
3. Restart backend

#### Session disconnected

Colab disconnects after idle time:

1. Re-run all cells
2. Update ngrok URL in backend
3. Consider using Colab Pro for longer sessions

#### Model loading fails

If Qwen3-TTS fails to load:

1. Ensure GPU runtime is enabled
2. Try **Runtime → Factory reset runtime**
3. Check if model is available on Hugging Face

---

## 🔄 Handling ngrok URL Changes

ngrok free tier generates new URLs on each restart. To handle this:

### Option 1: Manual Update

1. Copy new URL from Colab
2. Update `backend/.env`
3. Restart backend

### Option 2: ngrok Reserved Domain (Paid)

With ngrok paid plan, you can reserve a static domain:

```python
public_url = ngrok.connect(PORT, "http", domain="your-domain.ngrok.io")
```

### Option 3: Environment Variable Script

Create a script to update the URL:

```bash
# update_colab_url.bat (Windows)
@echo off
set /p URL="Enter Colab URL: "
echo COLAB_URL=%URL% > backend\.env
echo Updated!
```

---

## 💾 GPU Memory Tips

### Optimize Colab Memory

1. **Use shorter reference audio** (5-10 seconds is ideal)
2. **Limit text length** (under 200 characters for faster generation)
3. **Clear GPU cache** periodically:

```python
import torch
torch.cuda.empty_cache()
```

### Monitor Memory Usage

Add this to Colab to monitor GPU:

```python
!nvidia-smi
```

---

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Deploy `dist/` folder to Vercel or Netlify

3. Set environment variable:

```
VITE_API_URL=https://your-backend-url.com
```

### Backend (Railway/Render/Fly.io)

1. Create a `Procfile`:

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. Deploy to your preferred platform

3. Set environment variable `COLAB_URL`

### Colab Alternatives for Production

For production, consider:

- **RunPod**: GPU cloud with persistent instances
- **Vast.ai**: Affordable GPU rentals
- **Lambda Labs**: GPU cloud instances
- **Self-hosted**: Your own GPU server with the model

---

## 🔐 Security Considerations

### For Production

1. **Restrict CORS origins** in backend:

```python
allow_origins=["https://your-frontend-domain.com"]
```

2. **Add rate limiting**:

```bash
pip install slowapi
```

3. **Add authentication** for API endpoints

4. **Use HTTPS** for all connections

5. **Validate file types** server-side

---

## 📊 API Reference

### Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server info |
| GET | `/health` | Health check |
| POST | `/generate` | Generate cloned voice |

### POST /generate

**Request:**

```
Content-Type: multipart/form-data

text: string (required, 1-1000 chars)
reference_audio: file (required, WAV/MP3, max 10MB)
```

**Response:**

```
Content-Type: audio/wav
Content-Disposition: attachment; filename=generated_voice.wav
```

### Colab Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server info |
| GET | `/health` | Health check |
| POST | `/clone` | Clone voice |

---

## 📝 Environment Variables

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `COLAB_URL` | Colab ngrok URL | `https://abc123.ngrok-free.app` |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use for personal and commercial projects.

---

## 🙏 Credits

- **Qwen3-TTS** by Alibaba Cloud
- **FastAPI** by Sebastián Ramírez
- **React** by Meta
- **Tailwind CSS** by Tailwind Labs
- **Framer Motion** by Framer

---

## 💬 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Search existing GitHub issues
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, Python version)

---

Happy voice cloning! 🎙️✨
