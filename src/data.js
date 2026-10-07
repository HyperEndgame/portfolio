// All editable content lives here.
import * as I from './icons'

export const me = {
  name: 'Rohtak',
  full: 'Rohtak Harith',
  email: 'rohtak.harith@gmail.com',
  github: 'https://github.com/HyperEndgame',
  // TODO: replace with your exact profile URL (linkedin.com/in/<handle>)
  linkedin: 'https://www.linkedin.com/search/results/people/?keywords=Rohtak%20Harith',
  bio: "Student builder, hardware tinkerer and AI bot maker. I build things that aren't just functional — they're memorable.",
  stats: [
    ['Class', 'Student Builder'],
    ['Level', '10 - Sophomore'],
    ['Guild', 'Bearden High School'],
    ['Spawn', 'Knoxville, TN'],
    ['Status', 'Online - accepting quests'],
  ],
}

// slot -> biome scene + particles
export const biomes = {
  1: { name: 'Plains', scene: 'plains', fx: 'pollen' },
  2: { name: 'Cherry Grove', scene: 'cherry', fx: 'petals' },
  3: { name: 'Stronghold', scene: 'stronghold', fx: 'magic' },
  4: { name: 'Mineshaft', scene: 'mineshaft', fx: 'dust' },
  5: { name: 'Snowy Peaks', scene: 'snowy', fx: 'snow' },
  6: { name: 'Nether Wastes', scene: 'nether', fx: 'embers' },
  7: { name: 'Village', scene: 'village', fx: 'pollen' },
  8: { name: 'Birch Forest', scene: 'birch', fx: 'leaves' },
  9: { name: 'The End', scene: 'end', fx: 'magic' },
}

export const slots = [
  { n: 1, icon: I.grass, label: 'Main Menu' },
  { n: 2, icon: I.head, label: 'Player Profile' },
  { n: 3, icon: I.book, label: 'Enchantments' },
  { n: 4, icon: I.chest, label: 'Completed Builds' },
  { n: 5, icon: I.compass, label: 'The Journey' },
  { n: 6, icon: I.star, label: 'Advancements' },
  { n: 7, icon: I.emerald, label: 'Villager Trades' },
  { n: 8, icon: I.quill, label: 'Contact' },
  { n: 9, icon: I.pearl, label: 'The End' },
]

export const skills = [
  { name: 'HTML / CSS', lvl: 'V', pct: 92, lore: 'Builds sturdy layouts that survive any screen size. Unbreaking.' },
  { name: 'JavaScript / React', lvl: 'V', pct: 90, lore: 'Interactive UIs, state, animation. Grants Haste on the frontend.' },
  { name: 'Node.js / Python', lvl: 'IV', pct: 85, lore: 'Servers, scripts and AI Discord bots. Efficiency IV.' },
  { name: 'Hardware / PC Building', lvl: 'IV', pct: 82, lore: 'Picks parts, routes cables, flashes BIOS. Fortune on benchmarks.' },
  { name: 'UI / UX Design', lvl: 'IV', pct: 80, lore: 'Pixel-perfect interfaces people enjoy using. Mending.' },
]

// TODO: swap placeholders for real project details + links
export const projects = [
  { icon: I.pc, title: 'Custom PC Build', desc: 'My self-built gaming / dev rig — part picking, assembly, cable management and tuning.', tags: ['Hardware', 'Overclocking'], link: '' },
  { icon: I.bot, title: 'AI Discord Bot', desc: 'An AI-powered Discord bot that chats, answers questions and helps run the server.', tags: ['Python', 'LLM', 'Discord API'], link: 'https://github.com/HyperEndgame' },
  { icon: I.diamond, title: 'Zectron', desc: 'Landing site for Zectron. Placeholder description.', tags: ['Next.js', 'Tailwind'], link: 'https://zectron.net' },
  { icon: I.apple, title: 'TeamBir', desc: 'Team website. Placeholder description.', tags: ['Web'], link: 'https://github.com/HyperEndgame/TeamBir' },
  { icon: I.pickaxe, title: 'This Portfolio', desc: 'The Minecraft-themed site you are standing in. React, Vite, Framer Motion, Web Audio.', tags: ['React', 'Vite'], link: 'https://github.com/HyperEndgame/portfolio' },
  { icon: I.lucky, title: 'Coming Soon', desc: 'Placeholder build slot.', tags: ['???'], link: '' },
]

// Crafting recipes: ingredients -> result. TODO: fill from LinkedIn
export const journey = [
  { when: '2025 - NOW', title: 'Sophomore, Bearden High School', desc: 'Building PCs, AI bots and websites between classes. Placeholder: add clubs & activities.', items: [I.pc, I.bot, I.book] },
  { when: '2024 - 2025', title: 'Freshman, Bearden High School', desc: 'Started shipping real projects for friends and teams. Placeholder.', items: [I.pickaxe, I.chest, I.compass] },
  { when: 'BEFORE', title: 'Learning & Exploring', desc: 'Code, design, hardware — building in public from day one.', items: [I.grass, I.stone, I.lucky] },
]

// TODO: replace with real achievements
export const advancements = [
  { icon: I.pc, title: 'Hot Topic', desc: 'Build your own PC from parts' },
  { icon: I.bot, title: 'Hello, World', desc: 'Ship an AI Discord bot' },
  { icon: I.diamond, title: 'Diamonds!', desc: 'Launch a live website' },
  { icon: I.book, title: 'Enchanter', desc: 'Learn React, Node and Python' },
  { icon: I.apple, title: 'Team Player', desc: 'Build for a team — placeholder' },
  { icon: I.amulet, title: 'The Amulet', desc: 'Mine for the hidden amulet', secret: true },
]

export const trades = [
  { cost: 8, icon: I.diamond, title: 'Website Build', desc: 'Landing pages & portfolios' },
  { cost: 6, icon: I.bot, title: 'Discord Bot', desc: 'Custom / AI-powered bots' },
  { cost: 4, icon: I.pc, title: 'PC Build Help', desc: 'Part lists & assembly' },
  { cost: 5, icon: I.book, title: 'UI Design', desc: 'Clean, playful interfaces' },
]
