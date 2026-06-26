export type Team = 'village' | 'werewolf' | 'solo' | 'solo_voting';

export interface Role {
  id: string;
  name: string;
  team: Team;
  emoji: string;
}

export const ROLES: Role[] = [
  { id: 'villager',           name: 'Villager',           team: 'village',     emoji: '👤' },
  { id: 'seer',               name: 'Seer',               team: 'village',     emoji: '🔭' },
  { id: 'aura_seer',          name: 'Aura Seer',          team: 'village',     emoji: '🔮' },
  { id: 'doctor',             name: 'Doctor',             team: 'village',     emoji: '💉' },
  { id: 'bodyguard',          name: 'Bodyguard',          team: 'village',     emoji: '🛡️' },
  { id: 'vigilante',          name: 'Vigilante',          team: 'village',     emoji: '🔫' },
  { id: 'jailer',             name: 'Jailer',             team: 'village',     emoji: '⛓️' },
  { id: 'sheriff',            name: 'Sheriff',            team: 'village',     emoji: '⭐' },
  { id: 'priest',             name: 'Priest',             team: 'village',     emoji: '✝️' },
  { id: 'soulbinder',         name: 'Soulbinder',         team: 'village',     emoji: '🔗' },
  { id: 'witch',              name: 'Witch',              team: 'village',     emoji: '🧙' },
  { id: 'hunter',             name: 'Hunter',             team: 'village',     emoji: '🏹' },
  { id: 'beast_hunter',       name: 'Beast Hunter',       team: 'village',     emoji: '🦁' },
  { id: 'tracker',            name: 'Tracker',            team: 'village',     emoji: '👣' },
  { id: 'trapper',            name: 'Trapper',            team: 'village',     emoji: '🪤' },
  { id: 'medium',             name: 'Medium',             team: 'village',     emoji: '👻' },
  { id: 'analyst',            name: 'Analyst',            team: 'village',     emoji: '🔬' },
  { id: 'oracle',             name: 'Oracle',             team: 'village',     emoji: '📖' },
  { id: 'psychic',            name: 'Psychic',            team: 'village',     emoji: '🌀' },
  { id: 'detective',          name: 'Detective',          team: 'village',     emoji: '🔍' },
  { id: 'bully',              name: 'Bully',              team: 'village',     emoji: '👊' },
  { id: 'loudmouth',          name: 'Loudmouth',          team: 'village',     emoji: '📢' },
  { id: 'cupid',              name: 'Cupid',              team: 'village',     emoji: '💕' },
  { id: 'red_lady',           name: 'Red Lady',           team: 'village',     emoji: '🌹' },
  { id: 'ghost_lady',         name: 'Ghost Lady',         team: 'village',     emoji: '💨' },
  { id: 'snow_angel',         name: 'Snow Angel',         team: 'village',     emoji: '❄️' },
  { id: 'flower_child',       name: 'Flower Child',       team: 'village',     emoji: '🌸' },
  { id: 'admirer',            name: 'Admirer',            team: 'village',     emoji: '💘' },
  { id: 'guardian_wolf',      name: 'Guardian Wolf',      team: 'village',     emoji: '🐾' },
  { id: 'philosopher',        name: 'Philosopher',        team: 'village',     emoji: '📚' },
  { id: 'mayor',              name: 'Mayor',              team: 'village',     emoji: '🏅' },
  { id: 'veteran',            name: 'Veteran',            team: 'village',     emoji: '🎖️' },
  { id: 'grave_digger',       name: 'Grave Digger',       team: 'village',     emoji: '⛏️' },
  { id: 'maid',               name: 'Maid',               team: 'village',     emoji: '🧹' },
  { id: 'amnesiac',           name: 'Amnesiac',           team: 'village',     emoji: '🧠' },
  { id: 'wise_man',           name: 'Wise Man',           team: 'village',     emoji: '🧓' },
  { id: 'time_master',        name: 'Time Master',        team: 'village',     emoji: '⏱️' },
  { id: 'pacifist',           name: 'Pacifist',           team: 'village',     emoji: '✌️' },
  { id: 'cursed',             name: 'Cursed',             team: 'village',     emoji: '😈' },
  { id: 'revealer',           name: 'Revealer',           team: 'village',     emoji: '📣' },
  { id: 'wild_child',         name: 'Wild Child',         team: 'village',     emoji: '🌿' },
  { id: 'harlot',             name: 'Harlot',             team: 'village',     emoji: '💃' },
  { id: 'warden',             name: 'Warden',             team: 'village',     emoji: '🔒' },
  { id: 'werewolf',           name: 'Werewolf',           team: 'werewolf',    emoji: '🐺' },
  { id: 'alpha_wolf',         name: 'Alpha Wolf',         team: 'werewolf',    emoji: '👑' },
  { id: 'junior_werewolf',    name: 'Junior Werewolf',    team: 'werewolf',    emoji: '🐶' },
  { id: 'nightmare_werewolf', name: 'Nightmare Werewolf', team: 'werewolf',    emoji: '😱' },
  { id: 'party_wolf',         name: 'Party Wolf',         team: 'werewolf',    emoji: '🎉' },
  { id: 'wolf_seer',          name: 'Wolf Seer',          team: 'werewolf',    emoji: '👁️' },
  { id: 'shadow_wolf',        name: 'Shadow Wolf',        team: 'werewolf',    emoji: '🌑' },
  { id: 'kitten_wolf',        name: 'Kitten Wolf',        team: 'werewolf',    emoji: '🐱' },
  { id: 'snatcher_wolf',      name: 'Snatcher Wolf',      team: 'werewolf',    emoji: '🫳' },
  { id: 'wolf_shaman',        name: 'Wolf Shaman',        team: 'werewolf',    emoji: '🪄' },
  { id: 'cursed_wolf_father', name: 'Cursed Wolf Father', team: 'werewolf',    emoji: '🧛' },
  { id: 'lone_wolf',          name: 'Lone Wolf',          team: 'werewolf',    emoji: '🌙' },
  { id: 'berserker',          name: 'Berserker',          team: 'werewolf',    emoji: '⚔️' },
  { id: 'wolf_blocker',       name: 'Wolf Blocker',       team: 'werewolf',    emoji: '🚫' },
  { id: 'sorcerer',           name: 'Sorcerer',           team: 'werewolf',    emoji: '🧿' },
  { id: 'wolf_magician',      name: 'Wolf Magician',      team: 'werewolf',    emoji: '🎩' },
  { id: 'conjuror',           name: 'Conjuror',           team: 'werewolf',    emoji: '🔵' },
  { id: 'serial_killer',      name: 'Serial Killer',      team: 'solo',        emoji: '🔪' },
  { id: 'arsonist',           name: 'Arsonist',           team: 'solo',        emoji: '🔥' },
  { id: 'bomber',             name: 'Bomber',             team: 'solo',        emoji: '💣' },
  { id: 'cannibal',           name: 'Cannibal',           team: 'solo',        emoji: '🍖' },
  { id: 'corruptor',          name: 'Corruptor',          team: 'solo',        emoji: '🕷️' },
  { id: 'bandit',             name: 'Bandit',             team: 'solo',        emoji: '🥷' },
  { id: 'siren',              name: 'Siren',              team: 'solo',        emoji: '🧜' },
  { id: 'vampire',            name: 'Vampire',            team: 'solo',        emoji: '🧛' },
  { id: 'evil_genie',         name: 'Evil Genie',         team: 'solo',        emoji: '🧞' },
  { id: 'fool',               name: 'Fool',               team: 'solo_voting', emoji: '🃏' },
  { id: 'headhunter',         name: 'Headhunter',         team: 'solo_voting', emoji: '🎯' },
  { id: 'doomsayer',          name: 'Doomsayer',          team: 'solo_voting', emoji: '💀' },
];

export const TEAM_COLORS: Record<Team, string> = {
  village:     '#4ade80',
  werewolf:    '#f87171',
  solo:        '#c084fc',
  solo_voting: '#fb923c',
};

export const TEAM_LABELS: Record<Team, string> = {
  village:     'Village',
  werewolf:    'Werewolves',
  solo:        'Solo Killer',
  solo_voting: 'Solo Voting',
};

export const TEAMS: Team[] = ['village', 'werewolf', 'solo', 'solo_voting'];
