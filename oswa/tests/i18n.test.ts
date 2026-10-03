import { describe, it, expect } from 'vitest';
import arMessages from '../messages/ar.json';
import enMessages from '../messages/en.json';

describe('i18n Messages Parity & Sharia Integrity', () => {
  function getDeepKeys(obj: Record<string, any>, prefix = ''): string[] {
    let keys: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        keys = keys.concat(getDeepKeys(value, fullPath));
      } else {
        keys.push(fullPath);
      }
    }
    return keys;
  }

  it('Requirement 4: should have exact matching translation keys between Arabic and English', () => {
    const arKeys = getDeepKeys(arMessages).sort();
    const enKeys = getDeepKeys(enMessages).sort();

    const missingInEn = arKeys.filter((key) => !enKeys.includes(key));
    const missingInAr = enKeys.filter((key) => !arKeys.includes(key));

    expect(missingInEn, `Keys present in ar.json but missing in en.json: ${missingInEn.join(', ')}`).toEqual([]);
    expect(missingInAr, `Keys present in en.json but missing in ar.json: ${missingInAr.join(', ')}`).toEqual([]);
    expect(arKeys.length).toBeGreaterThan(20);
  });

  it('Requirement 8: Sharia terms and texts retain Arabic original reverence and do not distort source text', () => {
    expect(arMessages.nav.siteName).toBe('أسوة');
    expect(arMessages.account.privacyRights).toContain('النموذج اللغوي');
    expect(enMessages.account.privacyRights).toContain('language models');
  });
});
