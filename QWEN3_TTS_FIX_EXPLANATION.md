# 🔧 Qwen3-TTS: Why Your Code Failed & How to Fix It

## ❌ The Original Error

```
The checkpoint you are trying to load has model type `qwen3_tts` but Transformers 
does not recognize this architecture.
```

---

## 🔍 Root Cause Analysis

### What You Did (INCORRECT):
```python
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq

processor = AutoProcessor.from_pretrained(MODEL_ID, trust_remote_code=True)
model = AutoModelForSpeechSeq2Seq.from_pretrained(
    MODEL_ID,
    torch_dtype=DTYPE,
    device_map="auto",
    trust_remote_code=True,
    low_cpu_mem_usage=True
)
```

### Why It Failed:

1. **Qwen3-TTS is NOT a Transformers-native model**
   - It's a custom architecture built by Alibaba Cloud
   - Uses its own Python package: `qwen-tts`
   - Has custom model classes: `Qwen3TTSModel`, `Qwen3TTSTokenizer`

2. **AutoModelForSpeechSeq2Seq is the wrong class**
   - Designed for: Speech-to-text models (like Whisper)
   - Architecture: Encoder-decoder Seq2Seq
   - Qwen3-TTS uses: LM-based TTS with discrete codebooks
   - Completely different architecture!

3. **trust_remote_code=True doesn't help**
   - This flag loads custom code from model repository
   - BUT: Qwen3-TTS doesn't include modeling code in the repo
   - The code lives in the separate `qwen-tts` package

4. **Internal Transformers flow:**
   ```
   AutoModelForSpeechSeq2Seq.from_pretrained()
   ↓
   Reads config.json → finds "model_type": "qwen3_tts"
   ↓
   Searches AUTO_MODEL_MAPPING for "qwen3_tts"
   ↓
   NOT FOUND in Transformers registry
   ↓
   ERROR: "does not recognize this architecture"
   ```

---

## ✅ CORRECT SOLUTION

### Step 1: Install the Official Package

```bash
# In Google Colab:
!pip install -q qwen-tts
!pip install -q flash-attn --no-build-isolation  # Optional but recommended
```

**Why this works:**
- Installs `Qwen3TTSModel` and `Qwen3TTSTokenizer` classes
- Includes all required dependencies (torch, transformers, etc.)
- Contains the actual model architecture code

### Step 2: Use the Correct Model Class

```python
import torch
from qwen_tts import Qwen3TTSModel  # ← CORRECT import

MODEL_ID = "Qwen/Qwen3-TTS-12Hz-0.6B-Base"

# CORRECT loading method
model = Qwen3TTSModel.from_pretrained(
    MODEL_ID,
    device_map="cuda:0",          # Use specific device
    dtype=torch.bfloat16,         # FP16 for memory efficiency
    attn_implementation="flash_attention_2",  # Optional optimization
)
```

**Key differences:**
- ✅ Uses `Qwen3TTSModel` (not `AutoModelForSpeechSeq2Seq`)
- ✅ No need for `AutoProcessor` - model handles everything
- ✅ `trust_remote_code=True` not needed (code is in package)

### Step 3: Correct Inference API

```python
import soundfile as sf

# Voice Cloning Example
wavs, sr = model.generate_voice_clone(
    text="Hello, this is a test of voice cloning.",
    language="English",
    ref_audio="path/to/reference.wav",  # or URL, bytes, numpy array
    ref_text="Transcript of reference audio",
    x_vector_only_mode=False,  # Set True to skip ref_text
)

# Save output
sf.write("output.wav", wavs[0], sr)
```

---

## 🎯 Complete Working Colab Example

```python
# Cell 1: Install
!pip install -q torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
!pip install -q qwen-tts
!MAX_JOBS=4 pip install -q flash-attn --no-build-isolation

# Cell 2: Import and Load
import torch
from qwen_tts import Qwen3TTSModel
import soundfile as sf

model = Qwen3TTSModel.from_pretrained(
    "Qwen/Qwen3-TTS-12Hz-0.6B-Base",
    device_map="cuda:0",
    dtype=torch.bfloat16,
    attn_implementation="flash_attention_2",
)

print("✅ Model loaded successfully!")

# Cell 3: Test Inference
ref_audio_url = "https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3-TTS-Repo/clone.wav"
ref_text = "This is a sample voice."

wavs, sr = model.generate_voice_clone(
    text="Testing the voice cloning system.",
    language="English",
    ref_audio=ref_audio_url,
    ref_text=ref_text,
)

sf.write("test_output.wav", wavs[0], sr)
print("✅ Audio generated!")
```

---

## 🔬 Why AutoModelForSpeechSeq2Seq is Incorrect

| Aspect | AutoModelForSpeechSeq2Seq | Qwen3-TTS |
|--------|---------------------------|-----------|
| **Task** | Speech recognition (ASR) | Text-to-speech (TTS) |
| **Architecture** | Encoder-Decoder Seq2Seq | LM with discrete codebooks |
| **Input** | Audio → Text | Text (+Audio) → Audio |
| **Output** | Text tokens | Audio codes |
| **Examples** | Whisper, Wav2Vec2-Seq2Seq | Qwen3-TTS (unique) |
| **Base Class** | `transformers.models.speech_to_text` | Custom Qwen implementation |

**Architecture Comparison:**
```
Whisper (Seq2Seq):
Audio → Encoder → Hidden States → Decoder → Text Tokens

Qwen3-TTS:
Text → LM → Discrete Audio Codes → Tokenizer Decode → Audio Waveform
(+Reference Audio for voice cloning)
```

---

## 📦 What's Inside the `qwen-tts` Package

```python
from qwen_tts import (
    Qwen3TTSModel,      # Main model class
    Qwen3TTSTokenizer,  # Audio tokenizer (codec)
)

# Available models:
# - Qwen3-TTS-12Hz-0.6B-Base          (Voice cloning)
# - Qwen3-TTS-12Hz-1.7B-Base          (Voice cloning, larger)
# - Qwen3-TTS-12Hz-0.6B-CustomVoice   (9 preset voices)
# - Qwen3-TTS-12Hz-1.7B-CustomVoice   (9 preset voices)
# - Qwen3-TTS-12Hz-1.7B-VoiceDesign   (Natural language voice design)
```

---

## 🚀 Advanced Usage

### Batch Generation
```python
texts = ["Sentence one.", "Sentence two."]
languages = ["English", "English"]

wavs, sr = model.generate_voice_clone(
    text=texts,
    language=languages,
    ref_audio="reference.wav",
    ref_text="Reference transcript",
)

for i, wav in enumerate(wavs):
    sf.write(f"output_{i}.wav", wav, sr)
```

### Reusable Voice Clone Prompt
```python
# Extract features once
voice_clone_prompt = model.create_voice_clone_prompt(
    ref_audio="reference.wav",
    ref_text="Reference text",
)

# Reuse for multiple generations (faster)
wavs, sr = model.generate_voice_clone(
    text=["Hello", "World"],
    language=["English", "English"],
    voice_clone_prompt=voice_clone_prompt,
)
```

### Custom Voice (Preset Speakers)
```python
from qwen_tts import Qwen3TTSModel

model = Qwen3TTSModel.from_pretrained(
    "Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice",
    device_map="cuda:0",
    dtype=torch.bfloat16,
)

# Get available speakers
speakers = model.get_supported_speakers()
print(speakers)  # ['Vivian', 'Serena', 'Ryan', 'Aiden', ...]

wavs, sr = model.generate_custom_voice(
    text="Hello from Vivian!",
    language="Chinese",
    speaker="Vivian",
    instruct="Speak with excitement",  # Optional
)
```

---

## 🛠️ Troubleshooting

### "CUDA out of memory"
```python
# Use FP16 instead of BF16 on older GPUs
model = Qwen3TTSModel.from_pretrained(
    MODEL_ID,
    device_map="cuda:0",
    dtype=torch.float16,  # or torch.bfloat16
)

# Clear cache between generations
torch.cuda.empty_cache()
```

### "flash-attn installation failed"
```python
# Skip flash attention (slower but works)
model = Qwen3TTSModel.from_pretrained(
    MODEL_ID,
    device_map="cuda:0",
    dtype=torch.bfloat16,
    attn_implementation="eager",  # Default attention
)
```

### "Model download is slow"
```python
# Use ModelScope (faster in China)
!pip install modelscope
from modelscope import snapshot_download

model_dir = snapshot_download('Qwen/Qwen3-TTS-12Hz-0.6B-Base')
model = Qwen3TTSModel.from_pretrained(model_dir, ...)
```

---

## 📚 Official Resources

- **GitHub:** https://github.com/QwenLM/Qwen3-TTS
- **Paper:** https://arxiv.org/abs/2601.15621
- **Hugging Face:** https://huggingface.co/collections/Qwen/qwen3-tts
- **Demo:** https://huggingface.co/spaces/Qwen/Qwen3-TTS
- **Blog:** https://qwen.ai/blog?id=qwen3tts-0115

---

## ✨ Summary

| ❌ WRONG | ✅ CORRECT |
|----------|-----------|
| `from transformers import AutoModelForSpeechSeq2Seq` | `from qwen_tts import Qwen3TTSModel` |
| `AutoModelForSpeechSeq2Seq.from_pretrained()` | `Qwen3TTSModel.from_pretrained()` |
| Speech-to-text model class | Text-to-speech model class |
| Generic Transformers architecture | Qwen3-TTS custom architecture |
| Requires `trust_remote_code=True` | No special flags needed |

**Key Takeaway:** Qwen3-TTS is a standalone TTS system with its own package. Always use the official `qwen-tts` package and `Qwen3TTSModel` class!
