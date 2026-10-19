# MusiqualiT — content to review

The redesign is finished, but a lot of the text and images on the site are still demo content from the first build. Some of it states things as fact that were made up (a founder, a founding year, numbers, artists, events). Under the project's rule *"no invented facts presented as real"*, every item below needs a real answer, a decision, or removal before the site goes public.

**How to use this list:** tick each box when it's settled and write the real information (or "remove") next to **Answer**. You don't need to touch any code; whoever updates the site can take it from here. The *Where* line tells them exactly where it lives.

**Labels**

- **Invented**: made-up fact shown as real. Must be replaced or removed before launch.
- **Promise**: a commitment to artists or donors (time, money, receipts). Only keep it if it's true.
- **Placeholder**: a stand-in image, link or address that needs the real thing.
- **New copy**: text written during the redesign. True to the vision doc, but needs your OK on wording.

---

## 1. Assets we need from you

- [ ] **Logo file** (Placeholder). The site shows "MusiqualiT" typed in the headline font. Needed: the real logo as SVG, ideally a gold and a white version. It will be restyled for the gold-on-black look and shown to you for approval before it goes everywhere.
  *Where:* `components/chrome/Wordmark.tsx`
  **Answer:**
- [ ] **Night n Key performance video for the home page** (Placeholder). Currently a free stock clip of a saxophonist, labelled "Vidéo provisoire". Needed: a 10–20 second clip, ideally under 6 MB, plus one still frame from it.
  *Where:* `lib/mock/home.ts`
  **Answer:**
- [ ] **Artist portraits** (Placeholder). All 8 are stock photos, and some don't match the artist described (for example, the photo for "AYO Kalia (elle)" is of a man).
  *Where:* `lib/mock/artists.ts`
  **Answer:**
- [ ] **Photos for programs, events, team and the founder** (Placeholder). All stock photos. Several don't reflect an organization by and for artists of colour.
  *Where:* `lib/mock/programs.ts`, `lib/mock/team.ts`, `lib/mock/home.ts`, `components/sections/AboutPage.tsx`, `components/wizard/WizardShell.tsx`
  **Answer:**
- [ ] **Next-show poster image** (Placeholder, optional). For the big "next show" poster, a photo of the performer with the background removed (transparent PNG) gives the New York Philharmonic-style "performer in front of the type" effect. Without it, the poster still works.
  **Answer:**
- [ ] **Social sharing image** (Placeholder). The site points to `/og.png` for link previews (Instagram, Facebook, iMessage), but no such image exists yet, so shared links show no picture.
  **Answer:**

## 2. Facts about the organization

- [ ] **Founder** (Invented). "Imani Joseph, fondatrice" appears under the home-page quote, on the About page and in the team list. This person is fictional.
  **Answer (real name, role, and whether to show them):**
- [ ] **Founding year** (Invented). "En 2017…", "Huit ans plus tard…", milestone "2017 — Fondation".
  **Answer:**
- [ ] **Numbers** (Invented). "120 artistes. Une famille." (Artists page title), "Plus de 120 artistes sont passés par nos portes" (About), "1500 spectateur·rice·s", "80+ membres actifs", "12 artistes" (milestones).
  **Answer (real figures, or remove):**
- [ ] **Studio** (Invented). The site talks about a studio in several places: "Studio. Mentorat. Scène. Communauté." (home hero and mission), a "Studio" program, "Studio dans le Mile-End", "second studio". Does MusiqualiT have a studio?
  **Answer:**
- [ ] **Team** (Invented). Marcus Lebon (Studio director, "primé Polaris 2021"), Selma Diouf, Jules Roy-Étienne ("anciennement chez POP Montréal"). All fictional, including the credentials.
  **Answer (real team, or hide the section for now):**
- [ ] **Milestones / history** (Invented). 2017 founding, 2019 mentorship launch, 2021 showcase at Festival International Nuits d'Afrique, 2023 second studio, 2025 "Festival Musiqlt".
  **Answer:**
- [ ] **Non-profit status** (Promise). Home donate section: "Organisme sans but lucratif" / "MusiqualiT est un OSBL…". The English version says "registered non-profit". Please confirm the exact legal status and how it should be worded.
  **Answer:**

## 3. Page by page

### Home

- [ ] **Hero label** (New copy). "MONTRÉAL · FONDATION À BUT NON LUCRATIF" / "MONTRÉAL · NON-PROFIT FOUNDATION". This replaced the invented "MTL · EST. 2017 · ARTIST DEVELOPMENT".
  **Answer:**
- [ ] **"NOW PLAYING · LA RELÈVE 2026"** (Invented?). This suggests an edition or series called "La Relève 2026". Is that real? The music itself is a public-domain jazz track.
  **Answer:**
- [ ] **Mission pillars** (New copy). Four short lines (Exposition, Éducation, Occasions, Mentorat), written from the vision document. They replaced the invented stats ("120+", "8 années").
  **Answer:**
- [ ] **Pull quote** (Invented attribution). "On ne demande pas l'autorisation. On bâtit la table, on installe les chaises, on invite tout le monde." It's credited to the fictional founder. Need a real quote and a real person, or remove the section.
  **Answer:**
- [ ] **Apply invitation** (Promise). "Postule au programme. Trois tours d'admission par année." Are there really three intakes a year?
  **Answer:**
- [ ] **Donations** (Promise). "Tes dons financent directement les bourses, le studio…" and **"Reçu fiscal pour tout don de 20 $ et plus"**. A tax receipt is a legal claim: only a registered charity can issue official receipts. The amount buttons (25 / 50 / 100 $) and "Donner un montant personnalisé" don't go anywhere yet.
  **Answer (is there a donation platform? are receipts real?):**
- [ ] **Next-show poster** (New copy). With no date announced, it says: "NIGHT N KEY — DATE À ANNONCER. La prochaine soirée Night n Key se prépare. Inscris-toi à l'infolettre pour l'apprendre en premier." The **M'aviser** button jumps to the newsletter.
  **Answer:**
- [ ] **Newsletter** (Placeholder). The sign-up form only shows a "demo" message; it doesn't save anything yet (that's Phase 2).

### Programs

- [ ] **The four programs** (Invented). "Développement artistique", "Studio", "Mentorat", "Communauté", each with a short description, expected outcomes and an audience. They describe a generic artist-development organization, not MusiqualiT's real formats (Night n Key, Renaissance of Culture, open mic). Changing this page's structure is a later step, so for now the question is only which of these statements are true.
  **Answer:**
- [ ] **Specific promises** (Promise). "Plan de carrière 12 mois", "Un·e mentor… six mois", "Qualité industrielle, prix accessible" (this implies a paid studio service).
  **Answer:**

### Artists

- [ ] **All 8 artists** (Invented). AYO Kalia, Dré Saint-Vil, Naya M., Kobe Liu, Solène Aristide, Mahir, Talia & Co., Onyx Renaud: their names, pronouns, genres, cities, bios, audio previews ("Sunshade", "Nord", "Soir", "Berceuse", "Quatorze") and profile links.
  **Answer (real artists who agreed to be featured, with photos and bios):**
- [ ] **Page title** (Invented). "120 artistes. Une famille." / "120 artists. One family."
  **Answer:**

### Events

- [ ] **All 5 events** (Invented). "Showcase été · La Relève" (Le Ministère), "Carte blanche · AYO Kalia" (Théâtre Rialto), "Nuit Hip-Hop" (Le Ritz PDB), "Atelier · Production maison", "Portes ouvertes" (Studio Musiqlt). They show as past shows in the archive, which presents fiction as a track record. Ticket links go nowhere.
  **Answer (real past Night n Key shows, with dates, venues and lineups; or empty the archive):**
- [ ] **Page title** (Invented?). "Showcase. Atelier. Communauté." / "Showcase. Workshop. Community."
  **Answer:**
- [ ] **Empty state** (New copy). "Aucune date annoncée pour l'instant. Inscris-toi à l'infolettre pour être avisé·e."
  **Answer:**

### About

- [ ] **The whole page** (Invented). Intro "Bâtir l'industrie qu'on n'a pas vue.", the founder's story, the team, the milestones (see section 2). The design is done; it only needs real content.
  **Answer:**

### Contact

- [ ] **Response time** (Promise). "Écris-nous, on revient vers toi en 48h." Only keep it if the team can actually reply that fast.
  **Answer:**
- [ ] **Email address** (Placeholder). `bonjour@musiqlt.example` (on the Contact page and in the footer).
  **Answer:**

### Apply (the 5-step form)

- [ ] **Account and password on step 1**. Noted for Phase 2 (the vision is to start from what the artist wants, with no account up front). No action now.
- [ ] **What happens next** (Promise). The confirmation page promises "On lit ta candidature dans les 5 jours ouvrables", "on planifie une rencontre 30 min", "Démarrage du programme dès la rentrée".
  **Answer:**
- [ ] **Interest choices** (check). Step 3 offers "Studio, Mentorat, Scène, Distribution, Sync, Communauté". Do these match what MusiqualiT offers?
  **Answer:**

### Footer and site-wide

- [ ] **Tagline** (check). "Développement artistique en musique pour artistes de couleur, par artistes de couleur. Montréal."
  **Answer:**
- [ ] **Social links** (Placeholder). Instagram points to `instagram.com/musiqlt` (is that the real handle?). Facebook and YouTube go nowhere.
  **Answer:**
- [ ] **Privacy and Terms** (Placeholder). The links exist, but the pages don't. The apply form asks people to accept them, so they're needed before launch.
  **Answer:**
- [ ] **Search and sharing text** (Invented). Site description: "MusiqualiT accompagne les artistes de couleur depuis Montréal. Studio, mentorat, programmes de développement, communauté." The web address is a placeholder (`musiqlt.example`).
  **Answer (real domain):**

---

## For whoever applies the answers

- All site text lives in `messages/fr.json` and `messages/en.json` (French and English must always match).
- Artists, events, programs, team and milestones live in `lib/mock/*.ts`. Home-page media is in `lib/mock/home.ts`.
- Lines marked `TODO` or `PLACEHOLDER` in the code point back to items on this list.
