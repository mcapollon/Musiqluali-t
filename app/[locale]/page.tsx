import {
  HomeHero, HomeMission, HomeProgramsPreview, HomeArtists,
  HomeEvents, HomeQuote, HomeApplyCTA, HomeDonate, HomeNewsletter,
} from '@/components/sections'
import { LogoIntro } from '@/components/chrome/LogoIntro'
import { INTRO_SCRIPT } from '@/components/chrome/logoIntroScript'

export default function Home() {
  return (
    <>
      {/* Must run before the overlay is parsed so first-time visitors never see a flash of the page. */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      <LogoIntro />
      <HomeHero />
      <HomeMission />
      <HomeProgramsPreview />
      <HomeArtists />
      <HomeEvents />
      <HomeQuote />
      <HomeApplyCTA />
      <HomeDonate />
      <HomeNewsletter />
    </>
  )
}
