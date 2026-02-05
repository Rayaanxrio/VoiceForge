import Navbar from './components/Navbar'
import Hero from './components/Hero'
import VoiceCloneCard from './components/VoiceCloneCard'
import Footer from './components/Footer'
import BackgroundEffects from './components/BackgroundEffects'

function App() {
  return (
    <div className="relative min-h-screen bg-dark-950">
      <BackgroundEffects />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <VoiceCloneCard />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
