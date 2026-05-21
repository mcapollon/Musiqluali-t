export type Artist = {
  id: string
  name: string
  pronouns?: string
  genre: string
  city: string
  bioFr: string
  bioEn: string
  photo: string
  track?: { id: string; title: string; src: string; duration: number }
  links?: { label: string; href: string }[]
}

export const artists: Artist[] = [
  {
    id: 'ayo',
    name: 'AYO Kalia',
    pronouns: 'elle',
    genre: 'Afrobeats',
    city: 'Montréal',
    bioFr: "Voix éclatante entre Lagos et le Mile-End, AYO Kalia bâtit un afro-pop sans frontière.",
    bioEn: 'A radiant voice between Lagos and the Mile-End, AYO Kalia builds borderless afro-pop.',
    photo: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=1200&auto=format&fit=crop&q=80',
    track: { id: 'ayo-01', title: 'Sunshade', src: '/audio/clip-01.mp3', duration: 28 },
    links: [{ label: 'Spotify', href: 'https://open.spotify.com' }],
  },
  {
    id: 'dre',
    name: 'Dré Saint-Vil',
    pronouns: 'il',
    genre: 'Hip-Hop',
    city: 'Montréal',
    bioFr: "Rappeur lyrique du nord de la ville. Beats lourds, mots précis.",
    bioEn: 'Lyrical rapper from the north end. Heavy beats, precise words.',
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&auto=format&fit=crop&q=80',
    track: { id: 'dre-01', title: 'Nord', src: '/audio/clip-02.mp3', duration: 32 },
    links: [{ label: 'SoundCloud', href: 'https://soundcloud.com' }],
  },
  {
    id: 'naya',
    name: 'Naya M.',
    pronouns: 'elle',
    genre: 'R&B',
    city: 'Laval',
    bioFr: "R&B intime et soyeux. Première EP en 2025.",
    bioEn: 'Intimate, silky R&B. Debut EP in 2025.',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1200&auto=format&fit=crop&q=80',
    track: { id: 'naya-01', title: 'Soir', src: '/audio/clip-01.mp3', duration: 26 },
  },
  {
    id: 'kobe',
    name: 'Kobe Liu',
    pronouns: 'iel',
    genre: 'Électro',
    city: 'Montréal',
    bioFr: "Productrice électronique nuit-tard. Influences Caribou, FKA twigs.",
    bioEn: 'Late-night electronic producer. Caribou, FKA twigs influences.',
    photo: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'solene',
    name: 'Solène Aristide',
    pronouns: 'elle',
    genre: 'Soul',
    city: 'Montréal',
    bioFr: "Soul moderne. Voix qui porte. A ouvert pour Charlotte Cardin en 2024.",
    bioEn: 'Modern soul. Carrying voice. Opened for Charlotte Cardin in 2024.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80',
    track: { id: 'solene-01', title: 'Berceuse', src: '/audio/clip-02.mp3', duration: 30 },
    links: [{ label: 'Instagram', href: 'https://instagram.com' }],
  },
  {
    id: 'mahir',
    name: 'Mahir',
    pronouns: 'il',
    genre: 'Hip-Hop',
    city: 'Brossard',
    bioFr: "Trap mélancolique. Texte en français, ad-libs en anglais.",
    bioEn: 'Melancholic trap. Lyrics in French, ad-libs in English.',
    photo: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'talia',
    name: 'Talia & Co.',
    genre: 'Jazz',
    city: 'Montréal',
    bioFr: "Quintette jazz-fusion. Talia Mendes au lead vocal.",
    bioEn: 'Jazz-fusion quintet. Talia Mendes on lead vocals.',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&auto=format&fit=crop&q=80',
    track: { id: 'talia-01', title: 'Quatorze', src: '/audio/clip-01.mp3', duration: 35 },
  },
  {
    id: 'onyx',
    name: 'Onyx Renaud',
    pronouns: 'il',
    genre: 'Pop',
    city: 'Gatineau',
    bioFr: "Pop alternative bilingue. Production maison, ambitions internationales.",
    bioEn: 'Bilingual alt-pop. Bedroom production, international ambition.',
    photo: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1200&auto=format&fit=crop&q=80',
  },
]
