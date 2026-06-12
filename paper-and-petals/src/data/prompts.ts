/**
 * Gentle journalling prompts. One is chosen per calendar day (stable across the
 * day) so the home screen can offer a soft nudge without nagging.
 */
export const JOURNAL_PROMPTS: string[] = [
  'What made you smile today?',
  'A small thing you’re grateful for.',
  'Describe the light in your room right now.',
  'Something you want to remember about this week.',
  'A place you’d love to wander to.',
  'What does cosy look like to you today?',
  'A tiny win worth celebrating.',
  'Who are you thinking of fondly?',
  'A song that fits your mood.',
  'Something beautiful you noticed lately.',
  'What are you looking forward to?',
  'A memory that feels like sunshine.',
  'What would make tomorrow gentle?',
  'A texture, scent, or taste you love.',
  'Something you’d like to let go of.',
  'A word to carry through the day.',
  'What did you make space for today?',
  'A page from your week, in three words.',
  'Where did you feel most yourself?',
  'A little luxury you enjoyed.',
  'What’s blooming in your life right now?',
]

/** Day-stable prompt: same prompt all day, rotates with the calendar date. */
export function promptOfTheDay(d: Date = new Date()): string {
  const dayNumber = Math.floor(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000,
  )
  return JOURNAL_PROMPTS[dayNumber % JOURNAL_PROMPTS.length]
}
