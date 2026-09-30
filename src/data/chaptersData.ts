import { Chapter, SquadMember } from '../types/comic';
import { comicCh1, comicCh2, comicCh3, comicCh4 } from '../components/ComicImage';

export const SQUAD_MEMBERS: SquadMember[] = [
  {
    id: 'veera',
    name: 'Veera',
    role: 'IGL (In-Game Leader)',
    tag: 'Leader & Shotcaller',
    color: '#f59e0b',
    accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    quote: 'Guys... this is not a normal match. It\'s a tournament.',
    description: 'Calm under extreme tournament pressure. Strategizes zone rotations and coordinates squad synergy in high-stakes clutches.',
    specialty: 'Macro strategy, zone forecasting, clutch 1v1 execution'
  },
  {
    id: 'arun',
    name: 'Arun',
    role: 'Rusher',
    tag: 'First Contact / Entry Frag',
    color: '#ef4444',
    accentBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    quote: 'No stress da... Let\'s just execute! I\'ll push left!',
    description: 'Fearless entry fragger with lightning-fast SMG and shotgun reflexes. Breaks open defensive gloo walls.',
    specialty: 'Close-quarters combat, speed movement, entry breach'
  },
  {
    id: 'karthi',
    name: 'Karthi',
    role: 'Sniper',
    tag: 'Long Range Precision',
    color: '#06b6d4',
    accentBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    quote: 'I\'ll handle long range. Headshot! One more...!',
    description: 'Patient and deadly marksman. Provides high-ground suppression and single-shot game-changing knockdowns.',
    specialty: 'AWM precision, scouting enemy positions, overwatch'
  },
  {
    id: 'surya',
    name: 'Surya',
    role: 'Support',
    tag: 'Medic & Anchor',
    color: '#10b981',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    quote: 'Surya, heal if needed! Together until the end, no one leaves.',
    description: 'The squad anchor who keeps everyone topped up. Master of tactical throwables, gloo wall shielding, and clutch revives.',
    specialty: 'Gloo wall defense, fast medical revive, resource management'
  }
];

export const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: 'chapter-1',
    number: 1,
    title: 'The Call & The Signal',
    subtitle: 'Free Fire Squad Tournament: Where Legends Begin',
    coverImage: comicCh1,
    synopsis: 'Four friends unite with one dream in a fierce Free Fire tournament. When a mysterious anomaly appears above the battlegrounds, the match turns into something far greater than just a game.',
    badge: 'Origin Arc',
    readingTime: '4 min read',
    pages: [
      {
        id: 'ch1-p1',
        pageNumber: 1,
        title: 'The Call & The Drop',
        subtitle: 'Act I: Four Friends, One Dream',
        imageSrc: comicCh1,
        pageNarrative: 'In a dimly lit cyber room, four friends lock in their loadouts. A tournament that will change their destiny has officially begun.',
        panels: [
          {
            id: 'ch1-p1-1',
            panelNumber: 1,
            title: '1. The Call',
            caption: 'Four friends... One dream... A Free Fire squad tournament.',
            narratorNotes: 'Veera (IGL) gathers the squad before the countdown begins.',
            characters: ['Veera', 'Arun', 'Karthi', 'Surya'],
            speechBubbles: [
              {
                id: 'sb-1',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'Guys... this is not a normal match. It\'s a tournament.',
                style: 'speech',
                position: { x: 12, y: 15 }
              },
              {
                id: 'sb-2',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'No stress da... Let\'s just execute.',
                style: 'speech',
                position: { x: 38, y: 12 }
              },
              {
                id: 'sb-3',
                speaker: 'Karthi',
                roleTag: 'Sniper',
                text: 'I\'ll handle long range. You guys focus on close.',
                style: 'speech',
                position: { x: 62, y: 16 }
              },
              {
                id: 'sb-4',
                speaker: 'Surya',
                roleTag: 'Support',
                text: 'Together until the end. No one leaves.',
                style: 'speech',
                position: { x: 84, y: 18 }
              }
            ],
            sfxStickers: [
              { id: 'sfx-1', text: 'BIGGER DREAMS...', color: '#f59e0b', position: { x: 50, y: 88 }, rotation: -2 }
            ]
          },
          {
            id: 'ch1-p1-2',
            panelNumber: 2,
            title: '2. The Journey Begins',
            caption: 'Different teams... Same goal... Only one winner.',
            narratorNotes: 'The transport plane roars across the island. The drop countdown ticks down.',
            characters: ['Veera', 'Arun', 'Karthi'],
            statusBanner: {
              title: 'FREE FIRE SQUAD TOURNAMENT',
              alive: '50 ALIVE',
              alert: 'AIRDROP DETECTED'
            },
            speechBubbles: [
              {
                id: 'sb-5',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'Okay guys... land safe first.',
                style: 'speech',
                position: { x: 18, y: 22 }
              },
              {
                id: 'sb-6',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'Safe-ah? Adhu seri... naan fight panren!',
                style: 'shout',
                position: { x: 42, y: 20 }
              },
              {
                id: 'sb-7',
                speaker: 'Karthi',
                roleTag: 'Sniper',
                text: 'First zone kitta irundha nalla irukkum.',
                style: 'speech',
                position: { x: 68, y: 25 }
              },
              {
                id: 'sb-8',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: '3... 2... 1... JUMP!',
                style: 'shout',
                position: { x: 85, y: 15 }
              }
            ],
            sfxStickers: [
              { id: 'sfx-2', text: 'WOOOOSH!', color: '#06b6d4', position: { x: 75, y: 65 }, rotation: -8 }
            ]
          }
        ]
      },
      {
        id: 'ch1-p2',
        pageNumber: 2,
        title: 'The Anomaly & The Gunfight',
        subtitle: 'Act II: The Sky Rift & Urban Clash',
        imageSrc: comicCh2,
        pageNarrative: 'An eerie cyan rift ignites above the rooftops, while an aggressive enemy squad pins them down inside a warehouse.',
        panels: [
          {
            id: 'ch1-p2-3',
            panelNumber: 3,
            title: '3. The Mysterious Signal',
            caption: 'A celestial anomaly flickers where no beacon should exist.',
            narratorNotes: 'The sky tears open with a silent, pulsating blue glyph.',
            characters: ['Veera', 'Arun', 'Surya'],
            speechBubbles: [
              {
                id: 'sb-9',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'Guys... look at that light... It\'s not part of the map. Take a closer look.',
                style: 'speech',
                position: { x: 15, y: 25 }
              },
              {
                id: 'sb-10',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'Careful ah... It feels like someone\'s watching us.',
                style: 'whisper',
                position: { x: 50, y: 30 }
              },
              {
                id: 'sb-11',
                speaker: 'Karthi',
                roleTag: 'Sniper',
                text: 'Whatever it is... we just focus on the game.',
                style: 'speech',
                position: { x: 78, y: 28 }
              }
            ],
            sfxStickers: [
              { id: 'sfx-3', text: 'HUMMM...', color: '#38bdf8', position: { x: 52, y: 12 }, rotation: 4 }
            ]
          },
          {
            id: 'ch1-p2-4',
            panelNumber: 4,
            title: '4. The First Fight',
            caption: 'Gunfire erupts! Flanking tactics and instant communication.',
            characters: ['Veera', 'Arun', 'Karthi', 'Surya'],
            statusBanner: {
              title: 'COMBAT ENGAGEMENT',
              alive: '3 ALIVE',
              kills: '2 KILLS',
              killFeed: 'Veera ➔ BLAZE'
            },
            speechBubbles: [
              {
                id: 'sb-12',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'Enemy squad in the building!',
                style: 'shout',
                position: { x: 15, y: 18 }
              },
              {
                id: 'sb-13',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'Veera, cover! I\'ll push left!',
                style: 'shout',
                position: { x: 42, y: 16 }
              },
              {
                id: 'sb-14',
                speaker: 'Karthi',
                roleTag: 'Sniper',
                text: 'Karthi, window la one more!',
                style: 'speech',
                position: { x: 68, y: 20 }
              },
              {
                id: 'sb-15',
                speaker: 'Surya',
                roleTag: 'Support',
                text: 'Surya, heal if needed!',
                style: 'radio',
                position: { x: 88, y: 26 }
              }
            ],
            sfxStickers: [
              { id: 'sfx-4', text: 'RAT-A-TAT-TAT!', color: '#ef4444', position: { x: 40, y: 70 }, rotation: -6 }
            ]
          },
          {
            id: 'ch1-p2-5',
            panelNumber: 5,
            title: '5. The Twist',
            caption: 'It wasn\'t just a game... It was something bigger...',
            characters: ['Veera', 'Mysterious Watcher'],
            speechBubbles: [
              {
                id: 'sb-16',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'What the...? Who is that?',
                style: 'speech',
                position: { x: 20, y: 25 }
              },
              {
                id: 'sb-17',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'That symbol... looks familiar...',
                style: 'whisper',
                position: { x: 55, y: 35 }
              },
              {
                id: 'sb-18',
                speaker: 'Surya',
                roleTag: 'Support',
                text: 'Is this... part of the tournament?',
                style: 'speech',
                position: { x: 80, y: 30 }
              }
            ],
            sfxStickers: [
              { id: 'sfx-5', text: 'GLITCH...', color: '#a855f7', position: { x: 50, y: 80 }, rotation: 0 }
            ]
          }
        ]
      },
      {
        id: 'ch1-p3',
        pageNumber: 3,
        title: 'The Final Storm & The Clutch',
        subtitle: 'Act III: Championship Showdown',
        imageSrc: comicCh3,
        pageNarrative: 'The storm zone closes to a razor edge. Thunder rips through the sky as Karthi spots the rival squad leader.',
        panels: [
          {
            id: 'ch1-p3-6',
            panelNumber: 6,
            title: '6. The Final Battle',
            caption: 'Final Zone! 4 ALIVE · 3 KILL. Last team standing takes all.',
            characters: ['Veera', 'Arun', 'Karthi', 'Surya'],
            statusBanner: {
              title: 'FINAL ZONE WARNING',
              alive: '4 ALIVE',
              kills: '3 KILLS'
            },
            speechBubbles: [
              {
                id: 'sb-19',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'Last team left...!',
                style: 'shout',
                position: { x: 18, y: 20 }
              },
              {
                id: 'sb-20',
                speaker: 'Surya',
                roleTag: 'Support',
                text: 'Take cover! Don\'t show yourself!',
                style: 'shout',
                position: { x: 42, y: 24 }
              },
              {
                id: 'sb-21',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'Karthi, finish their sniper!',
                style: 'shout',
                position: { x: 68, y: 18 }
              },
              {
                id: 'sb-22',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'I\'m pushing from the right! Cover me!',
                style: 'shout',
                position: { x: 86, y: 22 }
              }
            ],
            sfxStickers: [
              { id: 'sfx-6', text: 'KRA-KABOOM!', color: '#eab308', position: { x: 50, y: 68 }, rotation: -4 }
            ]
          },
          {
            id: 'ch1-p3-7',
            panelNumber: 7,
            title: '7. The Clutch',
            caption: 'Zero room for error. A single bullet decides the championship.',
            characters: ['Karthi', 'Veera'],
            statusBanner: {
              title: 'CLUTCH MOMENT',
              killFeed: 'Karthi ➔ RDX [HEADSHOT]'
            },
            speechBubbles: [
              {
                id: 'sb-23',
                speaker: 'Karthi',
                roleTag: 'Sniper',
                text: 'Headshot! One more...!',
                style: 'shout',
                position: { x: 22, y: 35 }
              },
              {
                id: 'sb-24',
                speaker: 'Surya',
                roleTag: 'Support',
                text: 'Nice! Last guy in front!',
                style: 'shout',
                position: { x: 60, y: 25 }
              },
              {
                id: 'sb-25',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'Go Veera! You got this!',
                style: 'shout',
                position: { x: 82, y: 30 }
              }
            ],
            sfxStickers: [
              { id: 'sfx-7', text: 'HEADSHOT!', color: '#ef4444', position: { x: 48, y: 78 }, rotation: 8 }
            ]
          },
          {
            id: 'ch1-p3-8',
            panelNumber: 8,
            title: '8. The Final Moment',
            caption: 'We came for a tournament... But we found something much bigger.',
            characters: ['Veera'],
            speechBubbles: [
              {
                id: 'sb-26',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'This... this is not a coincidence.',
                style: 'thought',
                position: { x: 30, y: 30 }
              },
              {
                id: 'sb-27',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'It\'s the same symbol... from before.',
                style: 'whisper',
                position: { x: 75, y: 35 }
              }
            ],
            sfxStickers: [
              { id: 'sfx-8', text: 'MYSTERY REVEALED', color: '#06b6d4', position: { x: 50, y: 85 } }
            ]
          }
        ]
      },
      {
        id: 'ch1-p4',
        pageNumber: 4,
        title: 'Booyah! & The Aftermath',
        subtitle: 'Act IV: Four Players, One Dream',
        imageSrc: comicCh4,
        pageNarrative: 'The golden banner flashes across their screens: BOOYAH! 1/4 SQUAD. But the battlegrounds are just getting started.',
        panels: [
          {
            id: 'ch1-p4-9',
            panelNumber: 9,
            title: '9. BOOYAH!',
            caption: 'Not just a game... It\'s our story!',
            characters: ['Veera', 'Arun', 'Karthi', 'Surya'],
            statusBanner: {
              title: '1/4 SQUAD · TOURNAMENT CHAMPIONS',
              alive: 'WINNERS'
            },
            speechBubbles: [
              {
                id: 'sb-28',
                speaker: 'Surya',
                roleTag: 'Support',
                text: 'We did it...!',
                style: 'shout',
                position: { x: 15, y: 40 }
              },
              {
                id: 'sb-29',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'Tournament win da!',
                style: 'shout',
                position: { x: 38, y: 38 }
              },
              {
                id: 'sb-30',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'Next time more stronger than this!',
                style: 'shout',
                position: { x: 62, y: 42 }
              },
              {
                id: 'sb-31',
                speaker: 'Karthi',
                roleTag: 'Sniper',
                text: 'Four players... One dream!',
                style: 'speech',
                position: { x: 85, y: 45 }
              }
            ],
            sfxStickers: [
              { id: 'sfx-9', text: 'BOOYAH!', color: '#eab308', position: { x: 50, y: 20 }, rotation: -3 }
            ]
          },
          {
            id: 'ch1-p4-10',
            panelNumber: 10,
            title: '10. The Aftermath',
            caption: 'Some games give you rewards... This one gave us a story. A bond... and a reason to keep playing. Same squad... Next tournament... Next chapter...',
            narratorNotes: 'FREE FIRE: THE JOURNEY CONTINUES...',
            characters: ['Veera', 'Arun', 'Karthi', 'Surya'],
            speechBubbles: [
              {
                id: 'sb-32',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'Same squad... Next tournament... Next chapter...',
                style: 'thought',
                position: { x: 50, y: 65 }
              }
            ],
            sfxStickers: [
              { id: 'sfx-10', text: 'THE JOURNEY CONTINUES...', color: '#f59e0b', position: { x: 50, y: 88 } }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'chapter-2',
    number: 2,
    title: 'The Shadow Rift',
    subtitle: 'Decoding The Ancient Bermuda Coordinates',
    coverImage: comicCh2,
    synopsis: 'Following the enigmatic light signature observed during the tournament finals, the squad embarks on an expedition to the ancient Observatory ruins. What they find is an anomalous portal pulsing with digital code.',
    badge: 'Anomalies Arc',
    readingTime: '5 min read',
    pages: [
      {
        id: 'ch2-p1',
        pageNumber: 1,
        title: 'Coordinates Decoded',
        subtitle: 'The Ruins of Sector 7',
        imageSrc: comicCh2,
        pageNarrative: 'Midnight descends upon the island. Veera\'s wrist terminal detects frequency fluctuations identical to the tournament glyph.',
        panels: [
          {
            id: 'ch2-p1-1',
            panelNumber: 1,
            title: 'Approaching The Monolith',
            caption: 'The ruins vibrate with a hum that rattles teeth.',
            characters: ['Veera', 'Karthi'],
            speechBubbles: [
              {
                id: 'ch2-sb-1',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'The coordinates match perfectly. Keep your eyes open.',
                style: 'speech',
                position: { x: 25, y: 25 }
              },
              {
                id: 'ch2-sb-2',
                speaker: 'Karthi',
                roleTag: 'Sniper',
                text: 'Scanners are flickering. Thermal optics picking up phantom signatures.',
                style: 'radio',
                position: { x: 75, y: 28 }
              }
            ],
            sfxStickers: [
              { id: 'ch2-sfx-1', text: 'WHIRRRR...', color: '#38bdf8', position: { x: 50, y: 65 } }
            ]
          },
          {
            id: 'ch2-p1-2',
            panelNumber: 2,
            title: 'The Cybernetic Gate',
            caption: 'A giant circular crest hovers in mid-air, bleeding pure azure light.',
            characters: ['Arun', 'Surya'],
            speechBubbles: [
              {
                id: 'ch2-sb-3',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'Look at the ground! Those aren\'t boot prints. Those are mechanical treads!',
                style: 'shout',
                position: { x: 25, y: 35 }
              },
              {
                id: 'ch2-sb-4',
                speaker: 'Surya',
                roleTag: 'Support',
                text: 'Deploying sensory pings. Guys... we aren\'t alone here.',
                style: 'whisper',
                position: { x: 75, y: 35 }
              }
            ]
          }
        ]
      },
      {
        id: 'ch2-p2',
        pageNumber: 2,
        title: 'Shadow Ambush',
        subtitle: 'Digital Phantoms Strike',
        imageSrc: comicCh3,
        pageNarrative: 'Without warning, cloaked combat droids materialize from the static. Arun slides into cover as plasma bolts shear through the night.',
        panels: [
          {
            id: 'ch2-p2-3',
            panelNumber: 3,
            title: 'Contact Front!',
            caption: 'Plasma fire splits the darkness.',
            characters: ['Arun', 'Veera', 'Surya'],
            statusBanner: {
              title: 'DEFENSIVE BREACH',
              alive: '4 ALIVE',
              alert: 'UNKNOWN HOSTILES DETECTED'
            },
            speechBubbles: [
              {
                id: 'ch2-sb-5',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'Ambush! Hard cover at two o\'clock!',
                style: 'shout',
                position: { x: 22, y: 20 }
              },
              {
                id: 'ch2-sb-6',
                speaker: 'Surya',
                roleTag: 'Support',
                text: 'Gloo Wall up! Fall back to my perimeter!',
                style: 'shout',
                position: { x: 55, y: 22 }
              },
              {
                id: 'ch2-sb-7',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'Karthi, find the signal repeater commanding them!',
                style: 'shout',
                position: { x: 82, y: 25 }
              }
            ],
            sfxStickers: [
              { id: 'ch2-sfx-2', text: 'SHZZZZ-ZAP!', color: '#ef4444', position: { x: 45, y: 65 }, rotation: -12 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'chapter-3',
    number: 3,
    title: 'Storm of Bermuda',
    subtitle: 'The Electric Tempest & The High Ground',
    coverImage: comicCh3,
    synopsis: 'As an anomalous thunderstorm closes in around Clock Tower, the squad orchestrates their most synchronized play yet, pushing their limits in an electrified battle for survival.',
    badge: 'Tactical Arc',
    readingTime: '4 min read',
    pages: [
      {
        id: 'ch3-p1',
        pageNumber: 1,
        title: 'The Electric Wall',
        subtitle: 'Zone Closure Protocol',
        imageSrc: comicCh3,
        pageNarrative: 'The storm border crackles with purple arc lightning. Veera calls an audaciously timed sprint right through the high-risk danger zone.',
        panels: [
          {
            id: 'ch3-p1-1',
            panelNumber: 1,
            title: 'Sprinting The Ridge',
            caption: 'Every millisecond matters when the blue wall closes.',
            characters: ['Veera', 'Surya'],
            speechBubbles: [
              {
                id: 'ch3-sb-1',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'Pop speed boosters! We cross the ravine before the circle locks!',
                style: 'shout',
                position: { x: 30, y: 22 }
              },
              {
                id: 'ch3-sb-2',
                speaker: 'Surya',
                roleTag: 'Support',
                text: 'Medkit deployed! Keep running, I\'ve got your backs!',
                style: 'speech',
                position: { x: 75, y: 24 }
              }
            ],
            sfxStickers: [
              { id: 'ch3-sfx-1', text: 'CRACKLE!', color: '#a855f7', position: { x: 50, y: 75 } }
            ]
          }
        ]
      },
      {
        id: 'ch3-p2',
        pageNumber: 2,
        title: 'Marksman Overwatch',
        subtitle: 'One Shot, One Opportunity',
        imageSrc: comicCh4,
        pageNarrative: 'From the peak of the crane, Karthi holds the entire valley in his crosshairs. He breathes out, waits for the lightning flash, and squeezes the trigger.',
        panels: [
          {
            id: 'ch3-p2-2',
            panelNumber: 2,
            title: 'Calculated Bullet',
            caption: '800 meters. Wind sheer compensated.',
            characters: ['Karthi', 'Arun'],
            speechBubbles: [
              {
                id: 'ch3-sb-3',
                speaker: 'Karthi',
                roleTag: 'Sniper',
                text: 'Target acquired. Ready in 3... 2... firing.',
                style: 'whisper',
                position: { x: 35, y: 30 }
              },
              {
                id: 'ch3-sb-4',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'Boom! Dropped! Pushing into the compound now!',
                style: 'shout',
                position: { x: 75, y: 35 }
              }
            ],
            sfxStickers: [
              { id: 'ch3-sfx-2', text: 'BOOOM!', color: '#eab308', position: { x: 48, y: 80 }, rotation: 5 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'chapter-4',
    number: 4,
    title: 'Ascension: The Booyah Legend',
    subtitle: 'Championship Finale & Eternal Glory',
    coverImage: comicCh4,
    synopsis: 'On the grand championship stadium, against the most formidable international squads, Veera, Arun, Karthi, and Surya prove that friendship, practice, and fearless execution conquer all.',
    badge: 'Championship Finale',
    readingTime: '5 min read',
    pages: [
      {
        id: 'ch4-p1',
        pageNumber: 1,
        title: 'The Grand Stage',
        subtitle: 'Lights, Crowd, and Heartbeats',
        imageSrc: comicCh1,
        pageNarrative: 'Thousands of fans chanting their name in the arena. The four teammates share one nod. They have already won each other\'s trust.',
        panels: [
          {
            id: 'ch4-p1-1',
            panelNumber: 1,
            title: 'Walkout Of Champions',
            caption: 'From a small room with big dreams to the world stage.',
            characters: ['Veera', 'Arun', 'Karthi', 'Surya'],
            speechBubbles: [
              {
                id: 'ch4-sb-1',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'Remember why we started. Play with passion. Leave no regrets.',
                style: 'speech',
                position: { x: 30, y: 20 }
              },
              {
                id: 'ch4-sb-2',
                speaker: 'Arun',
                roleTag: 'Rusher',
                text: 'Let\'s show the world what our squad is made of!',
                style: 'shout',
                position: { x: 75, y: 22 }
              }
            ],
            sfxStickers: [
              { id: 'ch4-sfx-1', text: 'ROARRRR!', color: '#f59e0b', position: { x: 50, y: 75 } }
            ]
          }
        ]
      },
      {
        id: 'ch4-p2',
        pageNumber: 2,
        title: 'The Ultimate Booyah',
        subtitle: 'Golden Sunset over Bermuda',
        imageSrc: comicCh4,
        pageNarrative: 'As the final opponent falls, golden confetti rains down. Four friends stand side-by-side against the burning sunset.',
        panels: [
          {
            id: 'ch4-p2-2',
            panelNumber: 2,
            title: 'Brothers in Arms',
            caption: 'Not just a tournament win. A story written forever.',
            characters: ['Veera', 'Arun', 'Karthi', 'Surya'],
            statusBanner: {
              title: 'WORLD CHAMPIONS',
              alive: 'BOOYAH!'
            },
            speechBubbles: [
              {
                id: 'ch4-sb-3',
                speaker: 'Surya',
                roleTag: 'Support',
                text: 'We really did it, guys.',
                style: 'whisper',
                position: { x: 20, y: 35 }
              },
              {
                id: 'ch4-sb-4',
                speaker: 'Veera',
                roleTag: 'IGL',
                text: 'We did it together. And the story has only just begun.',
                style: 'speech',
                position: { x: 75, y: 35 }
              }
            ],
            sfxStickers: [
              { id: 'ch4-sfx-2', text: 'BOOYAH FOREVER', color: '#eab308', position: { x: 50, y: 85 } }
            ]
          }
        ]
      }
    ]
  }
];
