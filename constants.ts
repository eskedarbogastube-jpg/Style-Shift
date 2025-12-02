import { PresetStyle } from './types';

export const PRESET_STYLES: PresetStyle[] = [
  {
    id: 'suit-dark',
    label: 'Dark Business Suit',
    prompt: 'Change the clothing to a professional dark charcoal business suit with a crisp white shirt and tie.',
    icon: '👔'
  },
  {
    id: 'tuxedo',
    label: 'Formal Tuxedo',
    prompt: 'Change the clothing to a formal black tuxedo with a bow tie.',
    icon: '🎩'
  },
  {
    id: 'casual-chic',
    label: 'Smart Casual',
    prompt: 'Change the clothing to a smart casual outfit, like a blazer with a t-shirt.',
    icon: '👕'
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk Techwear',
    prompt: 'Change the clothing to futuristic cyberpunk techwear with neon accents.',
    icon: '🤖'
  },
  {
    id: 'leather',
    label: 'Leather Jacket',
    prompt: 'Change the clothing to a stylish black leather jacket and jeans.',
    icon: '🧥'
  }
];

export const DEFAULT_PROMPT = "Change the person's clothing to a professional business suit.";