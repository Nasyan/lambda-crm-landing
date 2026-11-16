import { useIdleDecor } from './lib/motion'
import { Header, Hero, Logos } from './sections/Top'
import { Core } from './sections/Core'
import { Implementation, DarkChapter, Quote } from './sections/Middle'
import { Stats, Cases, Updates, Faq, Closing, Footer } from './sections/Bottom'

export default function App() {
  useIdleDecor()
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Logos />
        <Core />
        <Implementation />
        <DarkChapter />
        <Quote />
        <Stats />
        <Cases />
        <Updates />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  )
}
