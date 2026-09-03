import type { ActId } from '../../course'

/**
 * What the wizard says, and when.
 *
 * His framing evolves across the three acts, because the material does. In Act
 * I the magic is a metaphor for the language. By Act III the metaphor has
 * inverted: the network, the filesystem and the screen are the genuinely
 * uncanny things, and he treats them that way. Scraping is scrying. GUI
 * automation is a pair of phantom hands. He is not pretending any more.
 */

export type WizardEvent =
  | 'greeting'
  | 'booting'
  | 'checking'
  | 'pass'
  | 'passFirstTry'
  | 'failOffer'
  | 'fatalSyntax'
  | 'moduleComplete'
  | 'locked'

type Bank = Record<WizardEvent, string[]>

const ACT1: Bank = {
  greeting: [
    'Every spell starts as nonsense you do not understand yet. Read it twice.',
    'The book is open. Take your time with it.',
  ],
  booting: ['Lighting the lamps…', 'Waking the interpreter…'],
  checking: ['Let us see what you have made.', 'Hold still. I am reading it.'],
  pass: [
    'There. It holds.',
    'Clean work. On to the next.',
    'That will stand up on its own now.',
  ],
  passFirstTry: [
    'First cast, and it held. Rare.',
    'No fumbling at all. Well done.',
  ],
  failOffer: [
    'Third time. Come here — let me show you where to look.',
    'You are circling it. Shall I point?',
  ],
  fatalSyntax: [
    'It did not run at all. Python stopped at the punctuation — read the line above the arrow.',
    'The words are wrong before the meaning is. Check your colons and brackets.',
  ],
  moduleComplete: [
    'That is a whole region behind you.',
    'You have the shape of it now. The next part gets stranger.',
  ],
  locked: ['That door is still shut. Finish the one before it.'],
}

const ACT2: Bank = {
  greeting: [
    'You are not learning words any more. You are building tools.',
    'A craftsman keeps their work where they can find it again. Today, so will your program.',
  ],
  booting: ['Heating the forge…', 'Setting out the tools…'],
  checking: ['Let us test the joins.', 'Under load, then.'],
  pass: [
    'Sound. It will take weight.',
    'That is a tool now, not a trick.',
    'It survives being used twice. That is the whole test.',
  ],
  passFirstTry: [
    'Straight and true, first pass.',
    'No rework. That is craft.',
  ],
  failOffer: [
    'Three attempts. Put the tool down and let me show you the grain.',
    'You are forcing it. There is an easier angle — want it?',
  ],
  fatalSyntax: [
    'It broke before it ran. Read the traceback from the bottom: the last line is what actually went wrong.',
    'The structure is wrong, not the idea. Find the line Python names.',
  ],
  moduleComplete: [
    'That is a full set of tools. They will all come back.',
    'You could build something real with what you now have.',
  ],
  locked: ['Not yet. The tool before it comes first.'],
}

const ACT3: Bank = {
  greeting: [
    'Here is the secret I have been keeping: none of this was ever the magic. This is.',
    'A machine you have never seen will answer you in under a second. Sit with how strange that is.',
  ],
  booting: ['Opening the channel…', 'The glass is clearing…'],
  checking: ['Let us see what comes back.', 'Scrying now. Hold.'],
  pass: [
    'It reached out, and something answered. That is real.',
    'You just moved things in the world without touching them.',
    'Phantom hands, and they did exactly as told.',
  ],
  passFirstTry: [
    'First reach, and the world answered. Most never get that.',
    'Straight through the glass, first try.',
  ],
  failOffer: [
    'Three attempts against a thing that does not care about you. Let me read the omens.',
    'The world is not cooperating. Want me to show you where it is refusing?',
  ],
  fatalSyntax: [
    'It never got as far as the network. The error is in your own hand — read the line Python names.',
    'The spell broke before it left the room. Check the syntax first.',
  ],
  moduleComplete: [
    'You can reach outside the machine now. Few ever bother to learn it.',
    'That is not a lesson any more. That is a thing you can do on Monday.',
  ],
  locked: ['The glass is dark for that one. Finish what came before.'],
}

const BANKS: Record<ActId, Bank> = { act1: ACT1, act2: ACT2, act3: ACT3 }

const lastSpoken = new Map<string, string>()

/** Pick a line, avoiding an immediate repeat of the same one. */
export function speak(act: ActId, event: WizardEvent): string {
  const options = BANKS[act][event]
  if (!options?.length) return ''

  const key = `${act}:${event}`
  const previous = lastSpoken.get(key)
  const fresh = options.length > 1 ? options.filter((line) => line !== previous) : options
  const chosen = fresh[Math.floor(Math.random() * fresh.length)]
  lastSpoken.set(key, chosen)
  return chosen
}

/**
 * How a hint is introduced, per act. The hint text itself belongs to the
 * project; this is only the wizard handing it over.
 */
export function hintPreamble(act: ActId, tier: number): string {
  if (act === 'act1') {
    return tier === 1 ? 'A nudge, no more:' : tier === 2 ? 'Closer, then:' : 'Very well — nearly the words themselves:'
  }
  if (act === 'act2') {
    return tier === 1 ? 'Where I would start:' : tier === 2 ? 'The tool you want:' : 'The shape of it:'
  }
  return tier === 1 ? 'What the omens say:' : tier === 2 ? 'Look here:' : 'Plainly, then:'
}

/** How many failed checks before he speaks up at all. */
export const PATIENCE = 3
