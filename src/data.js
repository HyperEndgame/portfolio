// All editable content lives here.
import * as I from './icons'

const img = (f) => `${import.meta.env.BASE_URL}img/${f}`

// phones get the 1280px photos (portrait crops are blurred/filtered anyway); desktop gets 1920px
export const photo = (src) => innerWidth < 768 ? src.replace('.webp', '-1280.webp') : src

export const me = {
  name: 'Rohtak',
  tag: 'Hyper_Endgame',
  full: 'Rohtak Harith',
  email: 'rohtak.harith@gmail.com',
  location: 'Knoxville, TN',
  github: 'https://github.com/HyperEndgame',
  linkedin: 'https://www.linkedin.com/in/rohtak-harith-a11a33403/',
  instagram: 'https://www.instagram.com/rohtak_harith/',
  bio: 'Sophomore at Bearden High School who builds things — robots, custom PCs, AI Discord bots and websites. Science Olympiad medalist, first-chair viola, Scouts patrol leader.',
  stats: [
    ['Class', 'Student'],
    ['Level', '10 · Sophomore'],
    ['Guild', 'Bearden High School'],
    ['Spawn', 'Bangalore, India'],
    ['Home Base', 'Knoxville, TN'],
    ['Status', 'Online · accepting quests'],
  ],
  avatar: img('player-front.png'),
  head: img('player-head.png'),
  avatarBack: img('player-back.png'),
}

// Motion pinned inside each photo (x/y in % of the image).
// lights: [x, y, size(vmin), color]  shafts: rays from a point  glints: twinkles in a region
const BERRY = 'rgba(255,190,70,.85)'
export const scenes = {
  'lush-caves.webp': {
    size: [1920, 1071],
    shafts: [{ x: 52, y: 14, from: -16, to: 14, n: 6, len: 62, w: 3, color: 'rgba(255,250,220,.30)' }],
    lights: [[6, 14, 7, BERRY], [12, 18, 6, BERRY], [7, 23, 6, BERRY], [12, 27, 6, BERRY], [25, 18, 6, BERRY], [29, 13, 7, BERRY],
      [33, 16, 6, BERRY], [36, 12, 6, BERRY], [24, 33, 6, BERRY], [26, 41, 6, BERRY], [33, 40, 5, BERRY], [65, 18, 6, BERRY],
      [64, 24, 5, BERRY], [69, 40, 6, BERRY], [86, 28, 7, BERRY], [91, 24, 7, BERRY], [92, 33, 6, BERRY], [60, 42, 5, BERRY],
      [44, 58, 12, 'rgba(200,255,150,.45)']],
    glints: [{ x: 38, y: 64, w: 26, h: 26, n: 16, color: '#dff6ff' }],
  },
  'cherry-river.webp': {
    size: [1920, 1027],
    shafts: [{ x: 50, y: 38, from: -70, to: 70, n: 9, len: 70, w: 4, color: 'rgba(255,225,180,.22)' }],
    lights: [[50, 38, 40, 'rgba(255,220,170,.55)']],
    glints: [{ x: 6, y: 62, w: 38, h: 32, n: 18, color: '#fff3e0' }],
  },
  'cherry-grove.webp': {
    size: [1920, 1080],
    shafts: [{ x: 8, y: -6, from: -40, to: -10, n: 5, len: 90, w: 5, color: 'rgba(255,250,225,.16)' }],
    glints: [{ x: 0, y: 66, w: 100, h: 30, n: 18, color: '#fff7c8' }],
  },
  'village.webp': {
    size: [1920, 1080],
    shafts: [{ x: 47, y: 6, from: -55, to: 55, n: 8, len: 80, w: 4, color: 'rgba(255,255,240,.20)' }],
    lights: [[47, 8, 45, 'rgba(255,255,235,.5)']],
    glints: [{ x: 44, y: 46, w: 5, h: 18, n: 14, color: '#ffffff' }],
  },
  'end.webp': {
    size: [1920, 1080],
    haze: 'radial-gradient(ellipse 40% 50% at 50% 50%, rgba(190,110,255,.22), transparent 70%)',
    lights: [[60, 38, 55, 'rgba(170,90,255,.35)'], [16, 50, 8, 'rgba(255,240,255,.7)'], [21, 44, 8, 'rgba(255,240,255,.6)'],
      [26, 52, 7, 'rgba(255,240,255,.6)'], [37, 66, 9, 'rgba(210,90,255,.7)'], [70, 68, 9, 'rgba(210,90,255,.7)'], [80, 72, 9, 'rgba(210,90,255,.7)']],
    glints: [{ x: 0, y: 0, w: 100, h: 30, n: 18, color: '#e8d0ff' }, { x: 13, y: 32, w: 16, h: 36, n: 18, color: '#fff' }],
  },
}

// Per-slot scene. pos/zoom/filter let one photo serve two biomes.
export const biomes = {
  1: { name: 'Cherry Valley', color: '#ff9ccf', src: img('cherry-river.webp'), fx: 'petals' },
  2: { name: 'Cherry Grove', color: '#ff9ccf', src: img('cherry-grove.webp'), fx: 'petals' },
  3: { name: 'Enchanted Grove', color: '#c79bff', src: img('cherry-grove.webp'), pos: '30% 35%', zoom: 1.45, filter: 'hue-rotate(-28deg) saturate(1.15) brightness(.62)', fx: 'glyphs' },
  4: { name: 'Dripstone Caves', color: '#ffb35c', src: img('lush-caves.webp'), pos: '12% 55%', zoom: 1.35, filter: 'sepia(.35) saturate(1.2) brightness(.72)', fx: 'embers' },
  5: { name: 'Windswept Peaks', color: '#9fd6ff', src: img('village.webp'), pos: '50% 20%', zoom: 1.18, fx: 'motes' },
  6: { name: 'Twilight River', color: '#7fd8ff', src: img('cherry-river.webp'), pos: '85% 75%', zoom: 1.4, filter: 'brightness(.55) saturate(.85) hue-rotate(-12deg)', fx: 'fireflies' },
  7: { name: 'Village', color: '#7dff7d', src: img('village.webp'), pos: '40% 70%', fx: 'motes' },
  8: { name: 'Lush Caves', color: '#7dffb0', src: img('lush-caves.webp'), fx: 'fireflies' },
  9: { name: 'The End', color: '#e3a6ff', src: img('end.webp'), fx: 'end' },
}

export const slots = [
  { n: 1, icon: I.grass, label: 'Main Menu', lore: 'Title screen' },
  { n: 2, icon: I.head, label: 'Player Profile', lore: 'About me' },
  { n: 3, icon: I.book, label: 'Enchantments', lore: 'Skills' },
  { n: 4, icon: I.chest, label: 'Completed Builds', lore: 'Projects' },
  { n: 5, icon: I.compass, label: 'The Journey', lore: 'Experience' },
  { n: 6, icon: I.star, label: 'Advancements', lore: 'Achievements' },
  { n: 7, icon: I.emerald, label: 'Villager Trades', lore: 'Services' },
  { n: 8, icon: I.quill, label: 'Book & Quill', lore: 'Contact' },
  { n: 9, icon: I.pearl, label: 'The End', lore: 'Links' },
]

// TODO: tune levels — self-assessed placeholders
export const skills = [
  { name: 'Leadership', lvl: 'V', pct: 92, lore: 'Patrol Leader since 2022. Led a 5-person robotics team to a school championship.' },
  { name: 'CAD / 3D Printing', lvl: 'V', pct: 90, lore: 'Taught 10+ new freshmen the fundamentals of 3D printing and CAD.' },
  { name: 'Robotics', lvl: 'IV', pct: 86, lore: 'Designs and builds competition robots with the Robotics Club.' },
  { name: 'Python / AI Bots', lvl: 'IV', pct: 84, lore: 'Builds AI-powered Discord bots. AI Fluency certified (Anthropic, 2026).' },
  { name: 'Web Development', lvl: 'IV', pct: 82, lore: 'Next.js, React and Tailwind sites — including this one.' },
  { name: 'PC Hardware', lvl: 'IV', pct: 80, lore: 'Picks parts, builds, cable-manages and tunes custom PCs.' },
  { name: 'Public Speaking', lvl: 'III', pct: 76, lore: 'Model UN delegate and club teacher.' },
]

// rarity: common #fff, uncommon #ffff55, rare #55ffff, epic #ff55ff
export const projects = [
  { icon: I.phone, title: 'Sakai', rarity: '#ff55ff', desc: 'A mobile-first personal operating system — an AI chief of staff with daily briefings, Eisenhower-matrix priorities and a Claude-powered assistant. Ships as an Android app.', tags: ['TypeScript', 'Claude API', 'Android'], link: 'https://github.com/HyperEndgame/Sakai' },
  { icon: I.pc, title: 'Custom PC Build', rarity: '#ff55ff', desc: 'My self-built rig — part picking, assembly, cable management and tuning.', tags: ['Hardware', 'Overclocking'], link: '' },
  { icon: I.bot, title: 'AI Discord Bot', rarity: '#55ffff', desc: 'An AI-powered Discord bot that chats, answers questions and helps run the server.', tags: ['Python', 'LLM', 'Discord API'], link: 'https://github.com/HyperEndgame' },
  { icon: I.gear, title: 'Championship Robot', rarity: '#ffff55', desc: 'Led a team of 5 to design the robot that won the school championship.', tags: ['Robotics', 'CAD', 'Team Lead'], link: '' },
  { icon: I.diamond, title: 'Zectron', rarity: '#55ffff', desc: 'Landing site for Zectron, deployed on Railway.', tags: ['Next.js', 'Tailwind'], link: 'https://zectron.net' },
  { icon: I.blossom, title: 'TeamBir', rarity: '#ffff55', desc: 'Team website and EagleBot.', tags: ['Web', 'Bot'], link: 'https://github.com/HyperEndgame/TeamBir' },
  { icon: I.pickaxe, title: 'This Portfolio', rarity: '#ffffff', desc: 'The world you are standing in. React, Vite, Framer Motion, Web Audio.', tags: ['React', 'Vite'], link: 'https://github.com/HyperEndgame/portfolio' },
]

export const journey = [
  { when: '2025 — NOW', title: 'Robotics Club', desc: 'Led a team of 5 to design a VEX robot that won the school championship. Taught 10+ freshmen 3D printing and CAD.', items: [I.gear, I.bolt, I.pc] },
  { when: '2025 — NOW', title: 'Science Olympiad · Study Captain', desc: 'Earned 3 medals at the 2026 East Tennessee Regional Science Olympiad.', items: [I.flask, I.book, I.medal] },
  { when: '2025 — 2029', title: 'Bearden High School', desc: 'Grade 10. Model UN, Japanese Club, Orchestra, Robotics, Science Olympiad.', items: [I.globe, I.blossom, I.scroll] },
  { when: '2022 — NOW', title: 'Patrol Leader · Boy Scouts of America', desc: '14+ hours of conservation volunteering at national parks.', items: [I.campfire, I.compass, I.pin] },
  { when: '2022 — NOW', title: 'Orchestra', desc: 'First chair viola.', items: [I.viola, I.book, I.star] },
]

export const advancements = [
  { icon: I.trophy, title: 'True Blue 100', desc: 'Top 100 Freshman in TN 2025–26 (MTSU)' },
  { icon: I.medal, title: 'Podium Finish', desc: '3 medals · 2026 E. TN Regional Sci Oly' },
  { icon: I.gear, title: 'Champion Build', desc: 'Robot won the school championship' },
  { icon: I.scroll, title: 'AI Fluent', desc: 'AI Fluency: Framework & Foundations · Anthropic' },
  { icon: I.viola, title: 'First Chair', desc: 'First chair viola, Orchestra' },
  { icon: I.campfire, title: 'Patrol Leader', desc: 'Leading a Scouts patrol since 2022' },
  { icon: I.lucky, title: 'Free the End', desc: 'Next build loading…', locked: true },
]

export const trades = [
  { cost: 12, icon: I.diamond, title: 'Website Build', desc: 'Landing pages & portfolios', stock: 'In stock' },
  { cost: 8, icon: I.bot, title: 'Discord Bot', desc: 'Custom / AI-powered bots', stock: 'In stock' },
  { cost: 6, icon: I.pc, title: 'PC Build Help', desc: 'Part lists, assembly, tuning', stock: 'In stock' },
  { cost: 10, icon: I.gear, title: 'CAD & 3D Printing', desc: 'Parts designed and printed', stock: 'Limited' },
]

export const tradeStats = [['6+', 'Builds'], ['3', 'Medals'], ['10+', 'Taught']]

export const links = [
  { icon: I.envelope, label: 'Email', value: me.email, copy: me.email },
  { icon: I.pin, label: 'Location', value: me.location },
  { icon: I.briefcase, label: 'LinkedIn', value: '/in/rohtak-harith', href: me.linkedin },
  { icon: I.github, label: 'GitHub', value: '@HyperEndgame', href: me.github },
  { icon: I.camera, label: 'Instagram', value: '@rohtak_harith', href: me.instagram },
]
