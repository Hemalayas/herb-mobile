import { Session, Badge, TBreak } from '../types';
import { differenceInDays, startOfDay, getHours } from 'date-fns';

// Badge image mapping
export const getBadgeImage = (imageId: string) => {
  const images: Record<string, any> = {
    '3_days_sober': require('../assets/badges/3_days_sober.png'),
    '1_week_sober': require('../assets/badges/1_week_sober.png'),
    '2_weeks_sober': require('../assets/badges/2_weeks_sober.png'),
    '1_month_sober': require('../assets/badges/1_month_sober.png'),
    '2_months_sober': require('../assets/badges/2_months_sober.png'),
    '3_months_sober': require('../assets/badges/3_months_sober.png'),
    '6_months_sober': require('../assets/badges/6_months_sober.png'),
    '1_year_sober': require('../assets/badges/1_year_sober.png'),
    '2_years_sober': require('../assets/badges/2_years_sober.png'),
    '3_years_sober': require('../assets/badges/3_years_sober.png'),
    '4_years_sober': require('../assets/badges/4_years_sober.png'),
    '5_years_sober': require('../assets/badges/5_years_sober.png'),
    'starting': require('../assets/badges/Starting.png'),
    't_break_complete': require('../assets/badges/t_break_complete.png'),
    'clean_slate': require('../assets/badges/clean_slate.png'),
    'first_spark': require('../assets/badges/first_spark.png'),
    'blinker': require('../assets/badges/blinker.png'),
    'ripper': require('../assets/badges/ripper.png'),
    'lore_master': require('../assets/badges/lore_master.png'),
    'munchies': require('../assets/badges/munchies.png'),
    'dab': require('../assets/badges/dab.png'),
    'paper_mache': require('../assets/badges/paper_mache.png'),
    'night_owl': require('../assets/badges/night_owl.png'),
    'early_bird': require('../assets/badges/early_bird.png'),
    '420': require('../assets/badges/420.png'),
    'weekend_warrior': require('../assets/badges/weekend_warrior.png'),
    'uh_oh': require('../assets/badges/uh_oh.png'),
    'lung_capacity': require('../assets/badges/lung_capacity.png'),
    'iron_lungs': require('../assets/badges/iron_lungs.png'),
    'according_to_plan': require('../assets/badges/according_to_plan.png'),
    'phoenix': require('../assets/badges/phoenix.png'),
    'retired': require('../assets/badges/retired.png'),
    'clarity': require('../assets/badges/clarity.png'),
    'rem': require('../assets/badges/rem.png'),
    'mixologist': require('../assets/badges/mixologist.png'),
    'the_scientist': require('../assets/badges/the_scientist.png'),
    'high_roller': require('../assets/badges/high_roller.png'),
    'whale': require('../assets/badges/whale.png'),
    'loot_hoarder': require('../assets/badges/loot_hoarder.png'),
    'botanist': require('../assets/badges/botanist.png'),
    'terpene_taster': require('../assets/badges/terpene_taster.png'),
    'strain_hunter': require('../assets/badges/strain_hunter.png'),
    'eighth': require('../assets/badges/eighth.png'),
    'quarter_oz': require('../assets/badges/quarter_oz.png'),
    'half_oz': require('../assets/badges/half_oz.png'),
    '1_oz': require('../assets/badges/1_oz.png'),
    'quarter_pound': require('../assets/badges/quarter_pound.png'),
    '1_pound': require('../assets/badges/1_pound.png'),
    'social_butterfly': require('../assets/badges/social_butterfly.png'),
    'lone_wolf': require('../assets/badges/lone_wolf.png'),
  };
  return images[imageId] || images['first_spark'];
};

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  imageId: string;
  category: 'sobriety' | 'tbreak' | 'usage' | 'time' | 'special' | 'variety' | 'financial' | 'strains' | 'volume';
  requirement: number;
}

const getDaysSinceLastSession = (sessions: Session[]): number => {
  if (sessions.length === 0) return 0;
  const lastSession = sessions[0];
  return differenceInDays(Date.now(), lastSession.timestamp);
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // SOBRIETY
  { id: '3_days_sober', name: '3 Days Sober', description: '3 days without consumption', imageId: '3_days_sober', category: 'sobriety', requirement: 3 },
  { id: '1_week_sober', name: '1 Week Sober', description: '7 days without consumption', imageId: '1_week_sober', category: 'sobriety', requirement: 7 },
  { id: '2_weeks_sober', name: '2 Weeks Sober', description: '14 days without consumption', imageId: '2_weeks_sober', category: 'sobriety', requirement: 14 },
  { id: '1_month_sober', name: '1 Month Sober', description: '30 days without consumption', imageId: '1_month_sober', category: 'sobriety', requirement: 30 },
  { id: '2_months_sober', name: '2 Months Sober', description: '60 days without consumption', imageId: '2_months_sober', category: 'sobriety', requirement: 60 },
  { id: '3_months_sober', name: '3 Months Sober', description: '90 days without consumption', imageId: '3_months_sober', category: 'sobriety', requirement: 90 },
  { id: '6_months_sober', name: '6 Months Sober', description: '180 days without consumption', imageId: '6_months_sober', category: 'sobriety', requirement: 180 },
  { id: '1_year_sober', name: '1 Year Sober', description: '365 days without consumption', imageId: '1_year_sober', category: 'sobriety', requirement: 365 },
  { id: '2_years_sober', name: '2 Years Sober', description: '730 days without consumption', imageId: '2_years_sober', category: 'sobriety', requirement: 730 },
  { id: '3_years_sober', name: '3 Years Sober', description: '1095 days without consumption', imageId: '3_years_sober', category: 'sobriety', requirement: 1095 },
  { id: '4_years_sober', name: '4 Years Sober', description: '1460 days without consumption', imageId: '4_years_sober', category: 'sobriety', requirement: 1460 },
  { id: '5_years_sober', name: '5 Years Sober', description: '1825 days without consumption', imageId: '5_years_sober', category: 'sobriety', requirement: 1825 },
  
  // T-BREAK
  { id: 'starting', name: 'Starting', description: 'Begin your journey', imageId: 'starting', category: 'tbreak', requirement: 1 },
  { id: 't_break_complete', name: 'T-Break Complete', description: 'Complete a T-Break', imageId: 't_break_complete', category: 'tbreak', requirement: 1 },
  
  // USAGE
  { id: 'first_spark', name: 'First Spark', description: 'Log your first session', imageId: 'first_spark', category: 'usage', requirement: 1 },
  { id: 'blinker', name: 'Blinker', description: '50 pen sessions', imageId: 'blinker', category: 'usage', requirement: 50 },
  
  // TIME
  { id: 'night_owl', name: 'Night Owl', description: 'Log session after 10pm', imageId: 'night_owl', category: 'time', requirement: 1 },
  { id: 'early_bird', name: 'Early Bird', description: 'Log session before 10am', imageId: 'early_bird', category: 'time', requirement: 1 },
  { id: '420', name: '4:20 Club', description: '???', imageId: '420', category: 'time', requirement: 1 },
  { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Log weekend sessions', imageId: 'weekend_warrior', category: 'time', requirement: 1 },
  
  // SPECIAL
  { id: 'uh_oh', name: 'Uh Oh', description: 'Over your limit', imageId: 'uh_oh', category: 'special', requirement: 1 },
  { id: 'phoenix', name: 'Phoenix', description: '3 days after slip-up', imageId: 'phoenix', category: 'special', requirement: 1 },
  { id: 'according_to_plan', name: 'According to Plan', description: 'Under limit 7 days', imageId: 'according_to_plan', category: 'special', requirement: 7 },
  
  // VARIETY
  { id: 'mixologist', name: 'Mixologist', description: '3 methods in one day', imageId: 'mixologist', category: 'variety', requirement: 1 },
  { id: 'the_scientist', name: 'The Scientist', description: 'Try all 5 consumption methods', imageId: 'the_scientist', category: 'variety', requirement: 5 },

  // FINANCIAL
  { id: 'high_roller', name: 'High Roller', description: '$500 spent', imageId: 'high_roller', category: 'financial', requirement: 500 },
  { id: 'whale', name: 'Whale', description: '$1000 spent', imageId: 'whale', category: 'financial', requirement: 1000 },
  { id: 'loot_hoarder', name: 'Loot Hoarder', description: '$100 saved', imageId: 'loot_hoarder', category: 'financial', requirement: 100 },
  
  // STRAINS
  { id: 'botanist', name: 'Botanist', description: '5 unique strains', imageId: 'botanist', category: 'strains', requirement: 5 },
  { id: 'terpene_taster', name: 'Terpene Taster', description: '10 unique strains', imageId: 'terpene_taster', category: 'strains', requirement: 10 },
  { id: 'strain_hunter', name: 'Strain Hunter', description: '25 unique strains', imageId: 'strain_hunter', category: 'strains', requirement: 25 },
  
  // VOLUME
  { id: 'eighth', name: '1/8 oz', description: '3.5g total', imageId: 'eighth', category: 'volume', requirement: 3.5 },
  { id: 'quarter_oz', name: '1/4 oz', description: '7g total', imageId: 'quarter_oz', category: 'volume', requirement: 7 },
  { id: 'half_oz', name: '1/2 oz', description: '14g total', imageId: 'half_oz', category: 'volume', requirement: 14 },
  { id: '1_oz', name: '1 oz', description: '28g total', imageId: '1_oz', category: 'volume', requirement: 28 },
  { id: 'quarter_pound', name: '1/4 lb', description: '113g total', imageId: 'quarter_pound', category: 'volume', requirement: 113 },
  { id: '1_pound', name: '1 lb', description: '453g total', imageId: '1_pound', category: 'volume', requirement: 453 },
  
  // SOCIAL
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Session with friends', imageId: 'social_butterfly', category: 'special', requirement: 1 },
  { id: 'lone_wolf', name: 'Lone Wolf', description: 'Solo session', imageId: 'lone_wolf', category: 'special', requirement: 1 },
];

export const calculateBadgeProgress = (sessions: Session[], tbreaks: TBreak[]): Badge[] => {
  const badges: Badge[] = [];

  const uniqueStrains = new Set(sessions.filter(s => s.strain).map(s => s.strain!.toLowerCase()));
  const totalSpent = sessions.reduce((sum, s) => sum + (s.cost || 0), 0);
  const totalAmount = sessions.reduce((sum, s) => sum + (s.amount || 0), 0);
  const penCount = sessions.filter(s => s.method === 'pen').length;
  const socialCount = sessions.filter(s => s.social === true).length;
  const soloCount = sessions.filter(s => s.social !== true).length;

  // The Scientist: track unique methods used
  const uniqueMethods = new Set(sessions.map(s => s.method));
  const scientistProgress = uniqueMethods.size; // 0-5
  const scientistUnlocked = uniqueMethods.size === 5; // All 5 methods used

  const nightOwlCount = sessions.filter(s => {
    const h = getHours(new Date(s.timestamp));
    return h >= 22 || h < 4;
  }).length;

  const earlyBirdCount = sessions.filter(s => {
    const h = getHours(new Date(s.timestamp));
    return h >= 4 && h < 10;
  }).length;

  const fourTwentyCount = sessions.filter(s => {
    const d = new Date(s.timestamp);
    return (d.getHours() === 16 || d.getHours() === 4) && d.getMinutes() === 20;
  }).length;

  const dayGroups = sessions.reduce((acc, s) => {
    const dayKey = startOfDay(s.timestamp).getTime();
    if (!acc[dayKey]) acc[dayKey] = new Set();
    acc[dayKey].add(s.method);
    return acc;
  }, {} as Record<number, Set<string>>);
  
  let mixologistUnlocked = false;
  for (const methods of Object.values(dayGroups)) {
    if (methods.size >= 3) {
      mixologistUnlocked = true;
      break;
    }
  }

  for (const def of BADGE_DEFINITIONS) {
    let progress = 0;
    let unlockedAt: number | undefined = undefined;
    let timesEarned: number | undefined = undefined;

    switch (def.id) {
      case '3_days_sober':
      case '1_week_sober':
      case '2_weeks_sober':
      case '1_month_sober':
      case '2_months_sober':
      case '3_months_sober':
      case '6_months_sober':
      case '1_year_sober':
      case '2_years_sober':
      case '3_years_sober':
      case '4_years_sober':
      case '5_years_sober':
        const daysSober = getDaysSinceLastSession(sessions);
        progress = Math.min((daysSober / def.requirement) * 100, 100);
        if (daysSober >= def.requirement) unlockedAt = Date.now();
        break;

      case 'starting':
        progress = tbreaks.length > 0 ? 100 : 0;
        if (tbreaks.length > 0) unlockedAt = tbreaks[0].startDate;
        break;

      case 't_break_complete':
        const completedTBreaks = tbreaks.filter(t => t.completed);
        progress = completedTBreaks.length > 0 ? 100 : 0;
        if (completedTBreaks.length > 0) unlockedAt = completedTBreaks[0].endDate;
        break;

      case 'first_spark':
        progress = sessions.length > 0 ? 100 : 0;
        if (sessions.length > 0) unlockedAt = sessions[sessions.length - 1].timestamp;
        break;

      case 'blinker':
        progress = Math.min((penCount / def.requirement) * 100, 100);
        if (penCount >= def.requirement) unlockedAt = Date.now();
        break;

      case 'night_owl':
        progress = nightOwlCount > 0 ? 100 : 0;
        timesEarned = nightOwlCount;
        if (nightOwlCount > 0) unlockedAt = Date.now();
        break;

      case 'early_bird':
        progress = earlyBirdCount > 0 ? 100 : 0;
        timesEarned = earlyBirdCount;
        if (earlyBirdCount > 0) unlockedAt = Date.now();
        break;

      case '420':
        progress = fourTwentyCount > 0 ? 100 : 0;
        timesEarned = fourTwentyCount;
        if (fourTwentyCount > 0) unlockedAt = Date.now();
        break;

      case 'mixologist':
        progress = mixologistUnlocked ? 100 : 0;
        if (mixologistUnlocked) unlockedAt = Date.now();
        break;

      case 'the_scientist':
        progress = Math.min((scientistProgress / 5) * 100, 100);
        if (scientistUnlocked) {
          unlockedAt = Date.now();
          timesEarned = 1; // Only earned once when all 5 methods tried
        }
        break;

      case 'high_roller':
      case 'whale':
      case 'loot_hoarder':
        progress = Math.min((totalSpent / def.requirement) * 100, 100);
        if (totalSpent >= def.requirement) unlockedAt = Date.now();
        break;

      case 'botanist':
      case 'terpene_taster':
      case 'strain_hunter':
        progress = Math.min((uniqueStrains.size / def.requirement) * 100, 100);
        if (uniqueStrains.size >= def.requirement) unlockedAt = Date.now();
        break;

      case 'eighth':
      case 'quarter_oz':
      case 'half_oz':
      case '1_oz':
      case 'quarter_pound':
      case '1_pound':
        progress = Math.min((totalAmount / def.requirement) * 100, 100);
        if (totalAmount >= def.requirement) unlockedAt = Date.now();
        break;

      case 'social_butterfly':
        progress = socialCount > 0 ? 100 : 0;
        timesEarned = socialCount;
        if (socialCount > 0) unlockedAt = Date.now();
        break;

      case 'lone_wolf':
        progress = soloCount > 0 ? 100 : 0;
        timesEarned = soloCount;
        if (soloCount > 0) unlockedAt = Date.now();
        break;

      default:
        progress = 0;
    }

    badges.push({
      id: def.id,
      name: def.name,
      description: def.description,
      icon: def.imageId,
      progress: Math.round(progress),
      requirement: def.requirement,
      unlockedAt,
      timesEarned,
    });
  }

  return badges;
};