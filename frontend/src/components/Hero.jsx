import { motion } from 'framer-motion'
import { Sparkles, Zap, Shield } from 'lucide-react'

const Hero = () => {
  const features = [
    { icon: Zap, text: 'Lightning Fast' },
    { icon: Shield, text: 'Privacy First' },
    { icon: Sparkles, text: 'Studio Quality' },
  ]

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-dark-700/50 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          <span className="text-sm text-dark-300">Powered by Qwen3-TTS</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance"
        >
          <span className="text-white">AI Voice Cloning</span>
          <br />
          <span className="gradient-text">Powered by Qwen3</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10 text-balance"
        >
          Clone any voice with just a few seconds of audio. Create natural, 
          expressive speech that sounds exactly like the original.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/50 border border-dark-700/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(39, 39, 42, 0.8)' }}
            >
              <feature.icon className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-dark-300">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-dark-500 uppercase tracking-widest">Scroll to try</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-dark-700 flex items-start justify-center p-1.5"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-3 bg-dark-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
