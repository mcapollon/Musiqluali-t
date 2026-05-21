import { HomeHero } from '@/components/sections/HomeHero'
import { HomeMission } from '@/components/sections/HomeMission'
import { HomeProgramsPreview } from '@/components/sections/HomeProgramsPreview'
import { HomeArtists } from '@/components/sections/HomeArtists'
import { HomeEvents } from '@/components/sections/HomeEvents'

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeMission />
      <HomeProgramsPreview />
      <HomeArtists />
      <HomeEvents />
    </>
  )
}
