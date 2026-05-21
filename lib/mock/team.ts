export type TeamItem = {
  id: string
  name: string
  roleFr: string
  roleEn: string
  bioFr: string
  bioEn: string
  photo: string
}

export const team: TeamItem[] = [
  {
    id: 'founder',
    name: 'Imani Joseph',
    roleFr: 'Fondatrice · Directrice artistique',
    roleEn: 'Founder · Artistic Director',
    bioFr: "Vétérane de l'industrie. 15 ans de A&R. Fondatrice de Musiqlt en 2017.",
    bioEn: '15 years A&R. Industry veteran. Founded Musiqlt in 2017.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'studio',
    name: 'Marcus Lebon',
    roleFr: 'Directeur studio · Ingénieur du son',
    roleEn: 'Studio Director · Sound Engineer',
    bioFr: "Diplômé McGill. Ingénieur primé Polaris 2021.",
    bioEn: 'McGill grad. Polaris-shortlisted engineer 2021.',
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'programs',
    name: 'Selma Diouf',
    roleFr: 'Coordonnatrice des programmes',
    roleEn: 'Programs Coordinator',
    bioFr: "Sociologie urbaine. Bénévole devenue indispensable.",
    bioEn: 'Urban sociology. Volunteer turned indispensable.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'community',
    name: 'Jules Roy-Étienne',
    roleFr: 'Animateur communauté',
    roleEn: 'Community Lead',
    bioFr: "Anciennement chez POP Montréal. Roue libre, tête bien faite.",
    bioEn: 'Formerly at POP Montréal. Free spirit, sharp mind.',
    photo: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&auto=format&fit=crop&q=80',
  },
]
