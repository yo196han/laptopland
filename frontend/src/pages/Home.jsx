import React, { useState } from 'react'
import LoadingScreen from '../components/LoadingScreen.jsx'
import Navbar from '../components/Navbar.jsx'
import HeroSection from '../components/HeroSection.jsx'
import ProductsSection from '../components/ProductsSection.jsx'
import ServicesSection from '../components/ServicesSection.jsx'
import AboutSection from '../components/AboutSection.jsx'
import ContactSection from '../components/ContactSection.jsx'
import Footer from '../components/Footer.jsx'
import { useLanguage } from '../hooks/useLanguage.js'

const Home = () => {
  const [loading, setLoading] = useState(true)
  const { lang } = useLanguage()

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <div className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        <Navbar lang={lang} />
        <main>
          <HeroSection lang={lang} />
          <ProductsSection lang={lang} />
          <ServicesSection lang={lang} />
          <AboutSection lang={lang} />
          <ContactSection lang={lang} />
        </main>
        <Footer lang={lang} />
      </div>
    </>
  )
}

export default Home
