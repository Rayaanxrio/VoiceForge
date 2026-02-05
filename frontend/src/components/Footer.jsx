import { motion } from 'framer-motion'
import { Waves, Github, Twitter } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const links = [
    { name: 'Documentation', href: '#docs' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
  ]

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Rayaanxrio', label: 'GitHub' },

  ]

  return (
    <footer className="border-t border-dark-800/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo and copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Waves className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">Voice</span>
                <span className="gradient-text">Forge</span>
              </span>
            </a>
            <p className="text-sm text-dark-500">
              © {currentYear} VoiceForge. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-sm text-dark-400 hover:text-white transition-colors"
                whileHover={{ y: -1 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-dark-800/50 border border-dark-700/50 flex items-center justify-center text-dark-400 hover:text-white hover:border-dark-600 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-8 pt-8 border-t border-dark-800/50 text-center">
          <p className="text-xs text-dark-600">
            Built By Rayaan
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
