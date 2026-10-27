import {
  HomeMission, HomeProgramsPreview, HomeArtists,
  HomeEvents, HomeQuote, HomeApplyCTA, HomeDonate, HomeNewsletter,
} from '@/components/sections'
import { LogoIntro } from '@/components/chrome/LogoIntro'
import { INTRO_SCRIPT } from '@/components/chrome/logoIntroScript'
import { VenueHero } from '@/components/venue/VenueHero'

export default function Home() {
  return (
    <>
      {/* Must run before the overlay is parsed so first-time visitors never see a flash of the page. */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      <LogoIntro />
      <VenueHero />
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
