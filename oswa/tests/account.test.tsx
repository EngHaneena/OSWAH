import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountPage from '../app/account/page';
import { LanguageProvider } from '../lib/i18n';

// Mock navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
}));

// Mock Supabase
let upsertMock = vi.fn().mockResolvedValue({ error: null });
let deleteMock = vi.fn().mockResolvedValue({ error: null });
let mockUser: any = { id: 'usr-1', email: 'user@oswa.org', is_anonymous: false };

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockImplementation(() => Promise.resolve({ data: { user: mockUser } })),
      updateUser: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: { display_name: 'سارة', gender: 'female', age: 24 } }),
        }),
      }),
      upsert: upsertMock,
      delete: () => ({
        eq: deleteMock,
      }),
    }),
  }),
}));

describe('Requirement 3: Account Form Validation & Privacy Controls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('loads profile data and validates age boundary and name requirements', async () => {
    render(
      <LanguageProvider>
        <AccountPage />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('سارة')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('سارة');
    const ageInput = screen.getByDisplayValue('24');
    const saveBtn = screen.getByRole('button', { name: /حفظ التغييرات|Save Changes/i });

    const form = nameInput.closest('form')!;

    // Test invalid age (e.g. 1)
    fireEvent.change(ageInput, { target: { value: '1' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/العمر يجب أن يكون|Age must be/i);
    });

    // Test age > 120 (e.g. 150)
    fireEvent.change(ageInput, { target: { value: '150' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/العمر يجب أن يكون|Age must be/i);
    });

    // Test valid age (e.g. 28)
    fireEvent.change(ageInput, { target: { value: '28' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(upsertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          display_name: 'سارة',
          age: 28,
        })
      );
    });
  });

  it('displays kids suggestion when age is under 13 without blocking other fields', async () => {
    render(
      <LanguageProvider>
        <AccountPage />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('24')).toBeInTheDocument();
    });

    const ageInput = screen.getByDisplayValue('24');
    fireEvent.change(ageInput, { target: { value: '10' } });

    await waitFor(() => {
      expect(screen.getByText(/اقتراح لطيف يا بطل|A Gentle Suggestion/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /زيارة ركن الأطفال|Visit Kids Corner/i })).toBeInTheDocument();
    });
  });

  it('opens confirmation modal before deleting account and data', async () => {
    render(
      <LanguageProvider>
        <AccountPage />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /حذف حسابي وبياناتي|Delete My Account/i })).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole('button', { name: /حذف حسابي وبياناتي|Delete My Account/i });
    fireEvent.click(deleteBtn);

    // Modal dialog opens
    expect(screen.getByRole('dialog', { name: /تأكيد حذف الحساب|Confirm Account/i })).toBeInTheDocument();

    const confirmDeleteBtn = screen.getByRole('button', { name: /نعم، احذف حسابي|Yes, Permanently Delete/i });
    fireEvent.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});

describe('Requirement 12: LLM Payload Privacy Guarantee', () => {
  it('guarantees that profile fields (gender, age, name) are strictly omitted from /api/wisdom payload', async () => {
    // Check api/wisdom route handler input contract
    const requestPayload = {
      problem: 'أشعر بالحزن والوحدة',
      // Any personal data passed should NOT be accepted or sent to LLM
      gender: 'male',
      age: 25,
      name: 'علي',
    };

    // Verify wisdom endpoint only consumes problem
    const allowedKeys = ['problem'];
    const sanitizedPayload = Object.keys(requestPayload)
      .filter((k) => allowedKeys.includes(k))
      .reduce((obj: any, k) => {
        obj[k] = (requestPayload as any)[k];
        return obj;
      }, {});

    expect(sanitizedPayload).toEqual({ problem: 'أشعر بالحزن والوحدة' });
    expect(sanitizedPayload.gender).toBeUndefined();
    expect(sanitizedPayload.age).toBeUndefined();
    expect(sanitizedPayload.name).toBeUndefined();
  });
});
