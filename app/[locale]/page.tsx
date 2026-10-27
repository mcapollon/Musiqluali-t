import { LogoIntro } from '@/components/chrome/LogoIntro'
import { ActRail } from '@/components/home/ActRail'
import { HomeOpening } from '@/components/home/HomeOpening'
import { HomeWhy } from '@/components/home/HomeWhy'
import { HomeMission } from '@/components/home/HomeMission'
import { HomeBackstage } from '@/components/home/HomeBackstage'
import { HomeImpact } from '@/components/home/HomeImpact'
import { HomeFormats } from '@/components/home/HomeFormats'
import { HomeArtists } from '@/components/home/HomeArtists'
import { HomeNextShow } from '@/components/home/HomeNextShow'
import { HomeCredits } from '@/components/home/HomeCredits'
import { HomeLights } from '@/components/home/HomeLights'
import { HomeFinale } from '@/components/home/HomeFinale'

/**
 * The home page is one evening in eleven acts (see components/home/ActRail.tsx):
 * overture, the gap, the mission, backstage, the record so far, what's on,
 * the artists, the next date, the values as credits, the vision with the
 * house lights up, and a place for everyone at the end.
 */
export default function Home() {
  return (
    <>
      <LogoIntro />
      <ActRail />
      <HomeOpening />
      <HomeWhy />
      <HomeMission />
      <HomeBackstage />
      <HomeImpact />
      <HomeFormats />
      <HomeArtists />
      <HomeNextShow />
      <HomeCredits />
      <HomeLights />
      <HomeFinale />
    </>
  )
}
