export type Program = {
  slug: 'dev' | 'studio' | 'mentorat' | 'communaute'
  fr: { title: string; blurb: string; outcomes: string[]; audience: string }
  en: { title: string; blurb: string; outcomes: string[]; audience: string }
  cover: string
}

export const programs: Program[] = [
  {
    slug: 'dev',
    fr: {
      title: 'Développement artistique',
      blurb: 'Forge ton son. Trace ta trajectoire.',
      outcomes: ['Direction artistique', 'Coaching scène', 'Plan de carrière 12 mois'],
      audience: 'Artistes émergent·e·s 18+ basé·e·s à Montréal.',
    },
    en: {
      title: 'Artistic Development',
      blurb: 'Forge your sound. Map your path.',
      outcomes: ['Artistic direction', 'Stage coaching', '12-month career plan'],
      audience: 'Emerging artists 18+ based in Montréal.',
    },
    cover: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=1200&auto=format&fit=crop&q=80',
  },
  {
    slug: 'studio',
    fr: {
      title: 'Studio',
      blurb: 'Captation, mix, mastering. Qualité industrielle, prix accessible.',
      outcomes: ['Captation voix', 'Mix professionnel', 'Mastering streaming-ready'],
      audience: "Artistes indépendant·e·s prêts à enregistrer.",
    },
    en: {
      title: 'Studio',
      blurb: 'Tracking, mixing, mastering. Industry quality, accessible pricing.',
      outcomes: ['Vocal capture', 'Professional mixing', 'Streaming-ready masters'],
      audience: 'Independent artists ready to record.',
    },
    cover: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&auto=format&fit=crop&q=80',
  },
  {
    slug: 'mentorat',
    fr: {
      title: 'Mentorat',
      blurb: 'Un·e mentor pour t\'accompagner six mois. Industrie, art, vie.',
      outcomes: ['Rencontres 1-à-1 mensuelles', "Bilan d'équipe trimestriel", "Accès au réseau Musiqlt"],
      audience: 'Artistes en transition vers le professionnel.',
    },
    en: {
      title: 'Mentorship',
      blurb: 'A mentor by your side for six months. Industry, art, life.',
      outcomes: ['Monthly 1-on-1s', 'Quarterly team review', 'Musiqlt network access'],
      audience: 'Artists transitioning to professional.',
    },
    cover: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&auto=format&fit=crop&q=80',
  },
  {
    slug: 'communaute',
    fr: {
      title: 'Communauté',
      blurb: 'Soirées, ateliers, jam sessions. La maison qu\'on a bâtie pour nous.',
      outcomes: ['Soirées showcase mensuelles', 'Ateliers production / business', 'Espace de cowork'],
      audience: 'Toute personne investie dans la scène montréalaise.',
    },
    en: {
      title: 'Community',
      blurb: 'Showcases, workshops, jam sessions. The home we built for ourselves.',
      outcomes: ['Monthly showcase nights', 'Production / business workshops', 'Cowork space'],
      audience: 'Anyone invested in Montréal\'s scene.',
    },
    cover: 'https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?w=1200&auto=format&fit=crop&q=80',
  },
]
