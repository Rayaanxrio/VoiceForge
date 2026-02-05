import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import axios from 'axios'
import { 
  Upload, 
  FileAudio, 
  Sparkles, 
  Loader2, 
  Play, 
  Pause, 
  Download,
  X,
  Volume2,
  Wand2
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const VoiceCloneCard = () => {
  const [audioFile, setAudioFile] = useState(null)
  const [text, setText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAudio, setGeneratedAudio] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      if (!file.type.includes('audio') && !file.name.endsWith('.wav')) {
        toast.error('Please upload a valid audio file (.wav)')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      setAudioFile(file)
      toast.success('Voice sample uploaded!')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.wav', '.mp3', '.m4a', '.ogg']
    },
    maxFiles: 1
  })

  const handleGenerate = async () => {
    if (!audioFile) {
      toast.error('Please upload a reference voice')
      return
    }
    if (!text.trim()) {
      toast.error('Please enter text to generate')
      return
    }

    setIsGenerating(true)
    setGeneratedAudio(null)

    try {
      const formData = new FormData()
      formData.append('text', text)
      formData.append('reference_audio', audioFile)

      const response = await axios.post(`${API_URL}/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
        timeout: 120000,
      })

      const audioBlob = new Blob([response.data], { type: 'audio/wav' })
      const audioUrl = URL.createObjectURL(audioBlob)
      setGeneratedAudio(audioUrl)
      toast.success('Voice generated successfully!')
    } catch (error) {
      console.error('Generation error:', error)
      if (error.response?.status === 503) {
        toast.error('Colab server is not available. Please check the connection.')
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please try again.')
      } else {
        toast.error('Failed to generate voice. Please try again.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleDownload = () => {
    if (generatedAudio) {
      const link = document.createElement('a')
      link.href = generatedAudio
      link.download = `voiceforge_${Date.now()}.wav`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Audio downloaded!')
    }
  }

  const removeFile = () => {
    setAudioFile(null)
    setGeneratedAudio(null)
    setIsPlaying(false)
  }

  return (
    <section id="demo" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Card glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-70" />
          
          {/* Main card */}
          <div className="relative glass rounded-3xl p-8 md:p-10">
            {/* Card header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Voice Cloning Studio</h2>
                <p className="text-sm text-dark-400">Upload a voice sample and generate new speech</p>
              </div>
            </div>

            {/* Upload area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark-300 mb-3">
                Reference Voice
              </label>
              <AnimatePresence mode="wait">
                {!audioFile ? (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    {...getRootProps()}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      isDragActive 
                        ? 'border-violet-500 bg-violet-500/10' 
                        : 'border-dark-700 hover:border-dark-600 hover:bg-dark-800/30'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <motion.div
                      animate={{ y: isDragActive ? -5 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
                        <Upload className={`w-6 h-6 ${isDragActive ? 'text-violet-400' : 'text-dark-400'}`} />
                      </div>
                      <p className="text-white font-medium mb-1">
                        {isDragActive ? 'Drop your audio file here' : 'Drag & drop your voice sample'}
                      </p>
                      <p className="text-sm text-dark-500">
                        or click to browse • WAV, MP3 up to 10MB
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-dark-800/50 border border-dark-700"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <FileAudio className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{audioFile.name}</p>
                      <p className="text-sm text-dark-500">
                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <motion.button
                      onClick={removeFile}
                      className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Text input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-dark-300 mb-3">
                Text to Speak
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text you want to generate in the cloned voice..."
                rows={4}
                className="w-full px-5 py-4 rounded-2xl bg-dark-800/50 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-dark-500">
                  Tip: Use clear, well-punctuated sentences for best results
                </p>
                <p className="text-xs text-dark-500">{text.length}/1000</p>
              </div>
            </div>

            {/* Generate button */}
            <motion.button
              onClick={handleGenerate}
              disabled={isGenerating || !audioFile || !text.trim()}
              className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-300 ${
                isGenerating || !audioFile || !text.trim()
                  ? 'bg-dark-700 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5'
              }`}
              whileHover={!isGenerating && audioFile && text.trim() ? { scale: 1.01 } : {}}
              whileTap={!isGenerating && audioFile && text.trim() ? { scale: 0.99 } : {}}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Voice...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Voice
                </>
              )}
            </motion.button>

            {/* Generated audio player */}
            <AnimatePresence>
              {generatedAudio && (
                <motion.div
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 20, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8"
                >
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Volume2 className="w-5 h-5 text-violet-400" />
                      <span className="text-sm font-medium text-white">Generated Audio</span>
                    </div>
                    
                    <audio
                      ref={audioRef}
                      src={generatedAudio}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                    
                    <div className="flex items-center gap-4">
                      <motion.button
                        onClick={togglePlayback}
                        className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6 ml-1" />
                        )}
                      </motion.button>
                      
                      <div className="flex-1">
                        <audio
                          src={generatedAudio}
                          controls
                          className="w-full h-10"
                          style={{ filter: 'invert(1) hue-rotate(180deg) brightness(0.8)' }}
                        />
                      </div>
                      
                      <motion.button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 text-white font-medium transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default VoiceCloneCard
