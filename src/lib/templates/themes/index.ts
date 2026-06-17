import { darkEnergy } from './dark-energy'
import { darkPremium } from './dark-premium'
import { corporateNavy } from './corporate-navy'
import type { ThemeName, ThemeVars } from '../types'

export const themes: Record<ThemeName, ThemeVars> = {
  'dark-energy': darkEnergy,
  'dark-premium': darkPremium,
  'corporate-navy': corporateNavy,
}
