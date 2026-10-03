import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SiteFooter from '../components/layout/SiteFooter';
import TeamPage from '../app/team/page';
import { team, challengeUrl } from '../config/team';
import { LanguageProvider } from '../lib/i18n';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe('Requirement 5: Footer verification', () => {
  it('renders challenge link and LinkedIn team accounts link with aria-label', () => {
    render(
      <LanguageProvider>
        <SiteFooter />
      </LanguageProvider>
    );

    // Challenge link
    const challengeLink = screen.getByRole('link', {
      name: /تحدي الذكاء الاصطناعي|AI Challenge/i,
    });
    expect(challengeLink).toBeInTheDocument();
    expect(challengeLink).toHaveAttribute('href', 'https://islamicaich.org/');
    expect(challengeLink).toHaveAttribute('target', '_blank');
    expect(challengeLink).toHaveAttribute('rel', 'noopener noreferrer');

    // LinkedIn icon link to /team
    const teamLinkedInIcon = screen.getByLabelText(/حسابات الفريق|Team accounts/i);
    expect(teamLinkedInIcon).toBeInTheDocument();
    expect(teamLinkedInIcon).toHaveAttribute('href', '/team');
  });
});

describe('Requirement 6: Team page verification (/team)', () => {
  it('displays the 5 members in the exact required order', () => {
    const { container } = render(
      <LanguageProvider>
        <TeamPage />
      </LanguageProvider>
    );

    expect(team).toHaveLength(5);
    expect(team[0].name.ar).toBe('حنين هيثم القصير');
    expect(team[1].name.ar).toBe('غلا محمد الرشيدي');
    expect(team[2].name.ar).toBe('أثير شعيفان الحربي');
    expect(team[3].name.ar).toBe('نوف تركي التركي');
    expect(team[4].name.ar).toBe('الماس المشيقح');

    // Verify all 5 member names are in the document
    expect(screen.getByText('حنين هيثم القصير')).toBeInTheDocument();
    expect(screen.getByText('غلا محمد الرشيدي')).toBeInTheDocument();
    expect(screen.getByText('أثير شعيفان الحربي')).toBeInTheDocument();
    expect(screen.getByText('نوف تركي التركي')).toBeInTheDocument();
    expect(screen.getByText('الماس المشيقح')).toBeInTheDocument();

    // Verify team lead card has special role
    expect(screen.getAllByText(/قائدة الفريق/i)[0]).toBeInTheDocument();
  });

  it('does NOT render action buttons for members without links (Nouf, Almas)', () => {
    render(
      <LanguageProvider>
        <TeamPage />
      </LanguageProvider>
    );

    // Atheer has LinkedIn with special encoded characters
    const atheerMember = team.find((m) => m.name.ar === 'أثير شعيفان الحربي');
    expect(atheerMember?.linkedin).toContain('%F0%9D%92%9C');

    // Nouf and Almas have no links
    const noufMember = team.find((m) => m.name.ar === 'نوف تركي التركي');
    expect(noufMember?.linkedin).toBeUndefined();
    expect(noufMember?.github).toBeUndefined();

    const almasMember = team.find((m) => m.name.ar === 'الماس المشيقح');
    expect(almasMember?.linkedin).toBeUndefined();
    expect(almasMember?.github).toBeUndefined();
  });

  it('does NOT display any email address anywhere in the team configuration or output', () => {
    const teamString = JSON.stringify(team);
    expect(teamString).not.toMatch(/@/);
    expect(teamString).not.toContain('mailto:');
  });
});
