import {
  HomeHero, HomeMission, HomeProgramsPreview, HomeArtists,
  HomeEvents, HomeQuote, HomeApplyCTA, HomeDonate, HomeNewsletter,
} from '@/components/sections'

export default function Home() {
  return (
    <>
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
