// TEMPORARY internal page — Gala Noir design-system review (Checkpoint 1).
// Not linked, not in the sitemap, noindex. Delete before launch.
// Copy here is specimen text for the founder's review, not site content, so it
// is intentionally not in messages/*.json.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Button } from '@/components/primitives/Button'
import { Pill } from '@/components/primitives/Pill'
import { Tag } from '@/components/primitives/Tag'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { GalaMark } from '@/components/editorial/GalaMark'
import { Wordmark } from '@/components/chrome/Wordmark'
import { CONTRAST_PAIRS, contrastRatio, resolveTheme } from '@/lib/design/contrast'

export const metadata: Metadata = { title: 'Gala Noir — système', robots: { index: false, follow: false } }

// PLACEHOLDER imagery (Unsplash) until real Night n Key photos / footage are supplied.
const PLACEHOLDER_PORTRAIT = 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&auto=format&fit=crop&q=80'
const PLACEHOLDER_STAGE = 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1600&auto=format&fit=crop&q=80'
const PLACEHOLDER_STAGE_2 = 'https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=1600&auto=format&fit=crop&q=80'

const PRIMITIVES = ['black', 'black-2', 'white', 'grey', 'gold', 'gold-bright', 'gold-deep'] as const
const ROLES = [
  ['ink', 'Page'],
  ['ink-2', 'Surface surélevée'],
  ['bone', 'Texte'],
  ['bone-mute', 'Texte secondaire'],
  ['rule', 'Filet décoratif'],
  ['rule-strong', 'Bordure de contrôle'],
] as const

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="section-pad-x py-16 md:py-24 border-t hairline">
      <div className="mb-10 md:mb-14">
        <ChapterMark number={n} title={title} />
      </div>
      {children}
    </section>
  )
}

function ContrastTable({ colors }: { colors: Record<string, [number, number, number]> }) {
  const rows = CONTRAST_PAIRS
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] text-sm">
        <caption className="text-mono-meta text-gold mb-4 text-left">Thème unique : sombre</caption>
        <thead>
          <tr className="text-mono-micro text-bone-mute text-left">
            <th className="py-2 pr-4 font-normal">Usage</th>
            <th className="py-2 pr-4 font-normal">Paire</th>
            <th className="py-2 pr-4 font-normal">Ratio</th>
            <th className="py-2 font-normal">AA</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const fg = colors[p.fg]
            const bg = colors[p.bg]
            if (!fg || !bg) return null
            const ratio = contrastRatio(fg, bg)
            const pass = ratio >= p.min
            return (
              <tr key={`${p.fg}-${p.bg}`} className="border-t hairline">
                <td className="py-3 pr-4">{p.use}</td>
                <td className="py-3 pr-4 font-mono text-xs text-bone-mute">
                  {p.fg} / {p.bg}
                </td>
                <td className="py-3 pr-4 font-mono">{ratio.toFixed(2)}:1</td>
                <td className={`py-3 font-mono text-xs ${pass ? 'text-ok' : 'text-err'}`}>
                  {pass ? 'PASS' : 'FAIL'} ≥{p.min}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function StylePage() {
  const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8')
  const dark = resolveTheme(css)

  return (
    <div className="pb-24">
      {/* 00 — Title */}
      <header className="section-pad-x pt-16 pb-20 md:pt-24 md:pb-28">
        <p className="text-mono-micro text-gold">Interne · non lié · à supprimer avant lancement</p>
        <h1 className="text-display-xl mt-6 max-w-5xl">
          Gala <em>Noir</em>, le système visuel
        </h1>
        <p className="text-lede text-bone-mute mt-8 max-w-2xl">
          Noir, blanc, et l’or comme une lumière. Cette page montre les jetons, la typographie, les boutons et les
          traitements d’image avant qu’on les applique aux pages.
        </p>
        <GalaMark className="mt-16 justify-start" />
      </header>

      {/* 01 — Logo placeholder */}
      <Section n="01" title="Logo (provisoire)">
        <div className="frame-invitation grid place-items-center px-6 py-20 md:py-28">
          <Wordmark className="text-[clamp(3rem,11vw,10rem)]" />
          <p className="text-mono-micro text-bone-mute mt-8 text-center">
            Mot-symbole provisoire en Bodoni Moda — en attente du fichier logo réel
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-end gap-10">
          <Wordmark className="text-3xl" />
          <Wordmark className="text-3xl" tone="white" />
        </div>
      </Section>

      {/* 02 — Colour */}
      <Section n="02" title="Couleur">
        <h2 className="text-mono-meta text-bone-mute mb-6">Primitives de marque</h2>
        <ul className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-4">
          {PRIMITIVES.map((name) => (
            <li key={name} className="bg-ink p-4">
              <div className="aspect-[4/3] w-full border hairline" style={{ background: `var(--color-${name})` }} />
              <p className="mt-3 font-mono text-xs">--color-{name}</p>
              <p className="font-mono text-xs text-bone-mute">rgb({dark[name]?.join(' ')})</p>
            </li>
          ))}
        </ul>
        <h2 className="text-mono-meta text-bone-mute mt-14 mb-6">Rôles (ce qu’utilisent les composants)</h2>
        <ul className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-3 lg:grid-cols-6">
          {ROLES.map(([name, label]) => (
            <li key={name} className="bg-ink p-4">
              <div className="h-14 w-full border hairline" style={{ background: `var(--color-${name})` }} />
              <p className="mt-3 font-mono text-xs">{name}</p>
              <p className="text-xs text-bone-mute">{label}</p>
            </li>
          ))}
        </ul>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            ['Accents fins', 'Filets, petites étiquettes mono, anneaux de focus, bordures de boutons, états actifs.'],
            ['Affirmations', 'Le logo, un mot-clé dans un titre, les dates, les numéros de chapitre.'],
            ['Images', 'Captations de scène étalonnées chaudes et dorées sur des noirs profonds.'],
          ].map(([h, p], i) => (
            <div key={h} className="border-t border-gold/60 pt-5">
              <p className="text-mono-micro text-gold">Or · {String(i + 1).padStart(2, '0')}</p>
              <p className="text-display-m mt-3">{h}</p>
              <p className="text-bone-mute mt-3">{p}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 03 — Type */}
      <Section n="03" title="Typographie">
        <p className="text-mono-micro text-gold">Display · Bodoni Moda · opsz 6–96 · 400–900 + italique</p>
        <p className="text-display-hero mt-6 -ml-[0.04em]">Night n Key</p>
        <p className="text-display-xl mt-10">
          La scène est notre <em>mentorat</em>
        </p>
        <p className="text-display-l mt-8">Renaissance of Culture</p>
        <p className="text-display-m mt-6">Prépa, arrangement, répétitions, puis la scène.</p>
        <p className="font-display text-2xl mt-6 italic text-bone-mute">
          Élève zélé à Montréal : ça s’accélère — être, où, Noël, cœur, Ô, À, Ç.
        </p>

        <div className="mt-20 grid gap-12 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-mono-micro text-gold">Affiche · Anton · capitales, avec parcimonie</p>
            <p className="text-poster-xl mt-6 text-bone">Night n Key</p>
            <p className="text-poster-l mt-2 text-gold">JJ.MM · 20 h</p>
            <p className="text-poster-m mt-4 text-bone-mute">Line-up · à confirmer</p>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-mono-micro text-gold">Texte · Inter</p>
              <p className="text-lede mt-3">
                MusiqualiT est une fondation montréalaise à but non lucratif qui aide les artistes d’ici à grandir, par
                des spectacles où l’on se fait découvrir, où l’on bâtit son réseau et où l’on apprend en le faisant.
              </p>
              <p className="mt-4 text-bone-mute">
                Corps de texte, interlignage 1,65. Le texte courant n’est jamais en or. Les titres d’affichage sont
                serrés (0,86–1,05); le texte respire.
              </p>
            </div>
            <div>
              <p className="text-mono-micro text-gold">Méta · JetBrains Mono</p>
              <p className="text-mono-meta mt-3">Chapitre 07 · Montréal · 20 h</p>
              <p className="text-mono-micro mt-2 text-bone-mute">Micro · 11 px · interlettrage 0,2 em</p>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t hairline pt-8 max-w-3xl">
          <p className="text-mono-micro text-gold">Pourquoi Bodoni Moda</p>
          <p className="mt-4 text-bone-mute">
            Une vraie didone : contraste extrême entre pleins et déliés, la sensation « soirée de gala » et
            l’héritage de la référence King of Pop. Son axe de taille optique est décisif : à 200 px les déliés
            deviennent des fils d’or, à 18 px ils s’épaississent pour rester lisibles sur fond noir. Playfair est
            plus répandue et plus molle; Instrument Serif n’a qu’une graisse; Cormorant est trop fragile en petit.
            Accents français complets (latin + latin-ext).
          </p>
        </div>
      </Section>

      {/* 04 — Controls */}
      <Section n="04" title="Boutons et détails">
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg">Postuler</Button>
          <Button size="lg" variant="ghost">
            Voir le prochain spectacle
          </Button>
          <Button size="lg" variant="quiet">
            En savoir plus
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button size="md">Postuler</Button>
          <Button size="md" variant="ghost">
            Billets
          </Button>
          <Button size="sm">S’inscrire</Button>
          <Button size="sm" variant="ghost">
            FR / EN
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Tag>Archive</Tag>
          <Tag tone="gold">Prochain</Tag>
          <Pill>Hip-hop</Pill>
          <Pill active>Soul</Pill>
        </div>
        <p className="text-bone-mute mt-6 text-sm">Tab pour voir l’anneau de focus or (2 px, décalé de 3 px).</p>
        <div className="mt-14 space-y-10">
          <ChapterMark number="07" title="Night n Key" />
          <GalaMark />
        </div>
      </Section>

      {/* 05 — Imagery */}
      <Section n="05" title="Images">
        <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
          <figure>
            <div className="grade-portrait relative aspect-[3/4] w-full">
              <Image src={PLACEHOLDER_PORTRAIT} alt="Portrait d’artiste (image provisoire)" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            </div>
            <figcaption className="mt-4">
              <span className="text-display-m">Nom d’artiste</span>
              <span className="text-mono-micro text-bone-mute mt-1 block">Portrait · N&amp;B contrasté · provisoire</span>
            </figcaption>
          </figure>
          <figure className="flex flex-col">
            <div className="grade-stage relative aspect-[4/5] w-full md:aspect-auto md:min-h-[28rem] md:flex-1">
              <Image src={PLACEHOLDER_STAGE} alt="Musicien sur scène (image provisoire)" fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10">
                <p className="text-mono-micro text-gold-bright">Captation · étalonnage or</p>
                <p className="text-display-l mt-3 text-white">Live, avec le band</p>
              </div>
            </div>
            <figcaption className="text-mono-micro text-bone-mute mt-4">
              Tuile captation — filtre CSS, fonctionne sur toute photo ou vidéo téléversée
            </figcaption>
          </figure>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-6">
          <figure>
            <div className="relative aspect-video w-full overflow-hidden">
              <Image src={PLACEHOLDER_STAGE_2} alt="Chanteur sur scène, image originale (provisoire)" fill sizes="50vw" className="object-cover" />
            </div>
            <figcaption className="text-mono-micro text-bone-mute mt-3">Original</figcaption>
          </figure>
          <figure>
            <div className="grade-stage relative aspect-video w-full">
              <Image src={PLACEHOLDER_STAGE_2} alt="Chanteur sur scène, étalonné or (provisoire)" fill sizes="50vw" className="object-cover" />
            </div>
            <figcaption className="text-mono-micro text-bone-mute mt-3">Étalonné</figcaption>
          </figure>
        </div>
      </Section>

      {/* 06 — Invitation */}
      <Section n="06" title="Cadre invitation">
        <div className="frame-invitation mx-auto max-w-3xl px-6 py-16 text-center md:px-16 md:py-24">
          <p className="text-mono-micro text-gold">Tu es invité·e</p>
          <p className="text-display-l mt-6">
            Monte sur <em>notre</em> scène
          </p>
          <GalaMark className="my-10" />
          <p className="text-bone-mute mx-auto max-w-md">
            Dis-nous ce que tu cherches : jouer à Night n Key, rejoindre une distribution hommage, une scène ouverte
            ou du mentorat.
          </p>
          <div className="mt-10 flex justify-center">
            <Button size="lg">Postuler</Button>
          </div>
        </div>
      </Section>

      {/* 07 — Contrast */}
      <Section n="07" title="Contraste WCAG AA">
        <p className="text-bone-mute mb-10 max-w-2xl">
          Calculé à partir de app/globals.css à chaque build; les mêmes paires sont vérifiées par les tests
          (lib/design/__tests__/contrast.test.ts). Or sur blanc : 2,1:1, refusé — une raison de plus pour un seul éclairage, sombre.
        </p>
        <div className="max-w-4xl">
          <ContrastTable colors={dark} />
        </div>
      </Section>
    </div>
  )
}
