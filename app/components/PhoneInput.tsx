// PhoneInput.tsx
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import './PhoneInput.css';

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

export type Country = {
  iso2: string;
  name: string;
  dialCode: string;
  /** Min digits in the national number (without dial code / leading 0) */
  minLength: number;
  /** Max digits in the national number */
  maxLength: number;
  /** Optional stricter check applied after the length check */
  pattern?: RegExp;
};

export const COUNTRIES: Country[] = [
  { iso2: 'AE', name: 'United Arab Emirates', dialCode: '971', minLength: 9, maxLength: 9 },
  { iso2: 'AR', name: 'Argentina', dialCode: '54', minLength: 10, maxLength: 11 },
  { iso2: 'AT', name: 'Austria', dialCode: '43', minLength: 10, maxLength: 11 },
  { iso2: 'AU', name: 'Australia', dialCode: '61', minLength: 9, maxLength: 9 },
  { iso2: 'BD', name: 'Bangladesh', dialCode: '880', minLength: 10, maxLength: 10 },
  { iso2: 'BE', name: 'Belgium', dialCode: '32', minLength: 9, maxLength: 9 },
  { iso2: 'BG', name: 'Bulgaria', dialCode: '359', minLength: 9, maxLength: 9 },
  { iso2: 'BR', name: 'Brazil', dialCode: '55', minLength: 10, maxLength: 11 },
  { iso2: 'CA', name: 'Canada', dialCode: '1', minLength: 10, maxLength: 10, pattern: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/ },
  { iso2: 'CH', name: 'Switzerland', dialCode: '41', minLength: 9, maxLength: 9 },
  { iso2: 'CL', name: 'Chile', dialCode: '56', minLength: 9, maxLength: 9 },
  { iso2: 'CN', name: 'China', dialCode: '86', minLength: 11, maxLength: 11, pattern: /^1[3-9]\d{9}$/ },
  { iso2: 'CO', name: 'Colombia', dialCode: '57', minLength: 10, maxLength: 10 },
  { iso2: 'CZ', name: 'Czechia', dialCode: '420', minLength: 9, maxLength: 9 },
  { iso2: 'DE', name: 'Germany', dialCode: '49', minLength: 10, maxLength: 11 },
  { iso2: 'DK', name: 'Denmark', dialCode: '45', minLength: 8, maxLength: 8 },
  { iso2: 'EE', name: 'Estonia', dialCode: '372', minLength: 7, maxLength: 8 },
  { iso2: 'EG', name: 'Egypt', dialCode: '20', minLength: 10, maxLength: 10 },
  { iso2: 'ES', name: 'Spain', dialCode: '34', minLength: 9, maxLength: 9 },
  { iso2: 'FI', name: 'Finland', dialCode: '358', minLength: 9, maxLength: 10 },
  { iso2: 'FR', name: 'France', dialCode: '33', minLength: 9, maxLength: 9 },
  { iso2: 'GB', name: 'United Kingdom', dialCode: '44', minLength: 10, maxLength: 10 },
  { iso2: 'GH', name: 'Ghana', dialCode: '233', minLength: 9, maxLength: 9 },
  { iso2: 'GR', name: 'Greece', dialCode: '30', minLength: 10, maxLength: 10 },
  { iso2: 'HK', name: 'Hong Kong', dialCode: '852', minLength: 8, maxLength: 8 },
  { iso2: 'HR', name: 'Croatia', dialCode: '385', minLength: 8, maxLength: 9 },
  { iso2: 'HU', name: 'Hungary', dialCode: '36', minLength: 9, maxLength: 9 },
  { iso2: 'ID', name: 'Indonesia', dialCode: '62', minLength: 9, maxLength: 12 },
  { iso2: 'IE', name: 'Ireland', dialCode: '353', minLength: 9, maxLength: 9 },
  { iso2: 'IL', name: 'Israel', dialCode: '972', minLength: 9, maxLength: 9 },
  { iso2: 'IN', name: 'India', dialCode: '91', minLength: 10, maxLength: 10, pattern: /^[6-9]\d{9}$/ },
  { iso2: 'IT', name: 'Italy', dialCode: '39', minLength: 9, maxLength: 10 },
  { iso2: 'JP', name: 'Japan', dialCode: '81', minLength: 10, maxLength: 10 },
  { iso2: 'KE', name: 'Kenya', dialCode: '254', minLength: 9, maxLength: 9 },
  { iso2: 'KR', name: 'South Korea', dialCode: '82', minLength: 9, maxLength: 10 },
  { iso2: 'KW', name: 'Kuwait', dialCode: '965', minLength: 8, maxLength: 8 },
  { iso2: 'LT', name: 'Lithuania', dialCode: '370', minLength: 8, maxLength: 8 },
  { iso2: 'LV', name: 'Latvia', dialCode: '371', minLength: 8, maxLength: 8 },
  { iso2: 'MA', name: 'Morocco', dialCode: '212', minLength: 9, maxLength: 9 },
  { iso2: 'MX', name: 'Mexico', dialCode: '52', minLength: 10, maxLength: 10 },
  { iso2: 'MY', name: 'Malaysia', dialCode: '60', minLength: 9, maxLength: 10 },
  { iso2: 'NG', name: 'Nigeria', dialCode: '234', minLength: 10, maxLength: 10 },
  { iso2: 'NL', name: 'Netherlands', dialCode: '31', minLength: 9, maxLength: 9 },
  { iso2: 'NO', name: 'Norway', dialCode: '47', minLength: 8, maxLength: 8 },
  { iso2: 'NZ', name: 'New Zealand', dialCode: '64', minLength: 8, maxLength: 10 },
  { iso2: 'PE', name: 'Peru', dialCode: '51', minLength: 9, maxLength: 9 },
  { iso2: 'PH', name: 'Philippines', dialCode: '63', minLength: 10, maxLength: 10 },
  { iso2: 'PK', name: 'Pakistan', dialCode: '92', minLength: 10, maxLength: 10 },
  { iso2: 'PL', name: 'Poland', dialCode: '48', minLength: 9, maxLength: 9 },
  { iso2: 'PT', name: 'Portugal', dialCode: '351', minLength: 9, maxLength: 9 },
  { iso2: 'QA', name: 'Qatar', dialCode: '974', minLength: 8, maxLength: 8 },
  { iso2: 'RO', name: 'Romania', dialCode: '40', minLength: 9, maxLength: 9 },
  { iso2: 'RS', name: 'Serbia', dialCode: '381', minLength: 9, maxLength: 9 },
  { iso2: 'RU', name: 'Russia', dialCode: '7', minLength: 10, maxLength: 10 },
  { iso2: 'SA', name: 'Saudi Arabia', dialCode: '966', minLength: 9, maxLength: 9 },
  { iso2: 'SE', name: 'Sweden', dialCode: '46', minLength: 9, maxLength: 9 },
  { iso2: 'SG', name: 'Singapore', dialCode: '65', minLength: 8, maxLength: 8 },
  { iso2: 'SI', name: 'Slovenia', dialCode: '386', minLength: 8, maxLength: 8 },
  { iso2: 'SK', name: 'Slovakia', dialCode: '421', minLength: 9, maxLength: 9 },
  { iso2: 'TH', name: 'Thailand', dialCode: '66', minLength: 9, maxLength: 9 },
  { iso2: 'TR', name: 'Turkey', dialCode: '90', minLength: 10, maxLength: 10 },
  { iso2: 'TW', name: 'Taiwan', dialCode: '886', minLength: 9, maxLength: 9 },
  { iso2: 'UA', name: 'Ukraine', dialCode: '380', minLength: 9, maxLength: 9 },
  { iso2: 'US', name: 'United States', dialCode: '1', minLength: 10, maxLength: 10, pattern: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/ },
  { iso2: 'VN', name: 'Vietnam', dialCode: '84', minLength: 9, maxLength: 10 },
  { iso2: 'ZA', name: 'South Africa', dialCode: '27', minLength: 9, maxLength: 9 },
];

const COUNTRIES_BY_ISO2 = new Map(COUNTRIES.map((c) => [c.iso2, c]));
const DEFAULT_COUNTRY = COUNTRIES_BY_ISO2.get('US')!;

export function getCountry(iso2: string): Country {
  return COUNTRIES_BY_ISO2.get(iso2.toUpperCase()) ?? DEFAULT_COUNTRY;
}

/** 🇺🇸 Builds a flag emoji from an ISO-3166-1 alpha-2 code. */
export function flagEmoji(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export type ValidationResult = { isValid: boolean; error: string | null };

export function validatePhoneNumber(
  country: Country,
  digits: string,
): ValidationResult {
  if (!digits) return { isValid: false, error: null };

  if (digits.length < country.minLength || digits.length > country.maxLength) {
    const error =
      country.minLength === country.maxLength
        ? `${country.name} numbers must be ${country.minLength} digits`
        : `${country.name} numbers must be ${country.minLength}–${country.maxLength} digits`;
    return { isValid: false, error };
  }

  if (country.pattern && !country.pattern.test(digits)) {
    return {
      isValid: false,
      error: `That doesn't look like a valid ${country.name} number`,
    };
  }

  return { isValid: true, error: null };
}

/** Parses "+919876543210" → { iso2: 'IN', nationalNumber: '9876543210' } */
export function parseInternational(
  raw: string,
  preferredIso2?: string,
): { iso2: string; nationalNumber: string } | null {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;

  const candidates = COUNTRIES.filter((c) => digits.startsWith(c.dialCode));
  if (!candidates.length) return null;

  const preferred = candidates.find((c) => c.iso2 === preferredIso2);
  const best =
    preferred ??
    candidates.reduce((a, b) => (b.dialCode.length > a.dialCode.length ? b : a));

  return { iso2: best.iso2, nationalNumber: digits.slice(best.dialCode.length) };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export type PhoneInputChange = {
  country: Country;
  /** Digits only, no dial code, no leading zero */
  nationalNumber: string;
  /** "+<dialCode><nationalNumber>" — empty string when there is no number */
  e164: string;
  isValid: boolean;
};

export interface PhoneInputProps {
  /** Controlled country (ISO-2). Omit for uncontrolled usage. */
  countryIso2?: string;
  /** Controlled national number (digits only). Omit for uncontrolled usage. */
  nationalNumber?: string;
  defaultCountryIso2?: string;
  defaultNationalNumber?: string;
  onChange?: (value: PhoneInputChange) => void;
  onBlur?: () => void;

  label?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  /** External error (e.g. from your form library) — overrides internal error. */
  error?: string | null;
  className?: string;
  autoFocus?: boolean;
}

export function PhoneInput({
  countryIso2,
  nationalNumber,
  defaultCountryIso2 = 'US',
  defaultNationalNumber = '',
  onChange,
  onBlur,
  label = 'Phone number',
  placeholder = 'Phone number',
  name,
  id,
  disabled = false,
  required = false,
  error: externalError,
  className,
  autoFocus = false,
}: PhoneInputProps) {
  const reactId = useId().replace(/:/g, '');
  const inputId = id ?? `phone-input-${reactId}`;
  const errorId = `${inputId}-error`;

  const [internalIso2, setInternalIso2] = useState(defaultCountryIso2.toUpperCase());
  const [internalNumber, setInternalNumber] = useState(
    defaultNationalNumber.replace(/\D/g, ''),
  );
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const isCountryControlled = countryIso2 !== undefined;
  const isNumberControlled = nationalNumber !== undefined;

  const currentIso2 = (
    isCountryControlled ? countryIso2! : internalIso2
  ).toUpperCase();
  const country = getCountry(currentIso2);
  const digits = isNumberControlled
    ? nationalNumber!.replace(/\D/g, '')
    : internalNumber;

  const { isValid, error: validationError } = validatePhoneNumber(country, digits);
  const requiredError =
    required && touched && !digits ? 'Phone number is required' : null;
  const shownError = externalError ?? requiredError ?? (touched ? validationError : null);

  /* ---------------------------- emitters ---------------------------- */

  const emitChange = useCallback(
    (iso2: string, nextDigits: string) => {
      const nextCountry = getCountry(iso2);
      const { isValid: ok } = validatePhoneNumber(nextCountry, nextDigits);
      onChange?.({
        country: nextCountry,
        nationalNumber: nextDigits,
        e164: nextDigits ? `+${nextCountry.dialCode}${nextDigits}` : '',
        isValid: ok,
      });
    },
    [onChange],
  );

  const updateCountry = (iso2: string) => {
    if (!isCountryControlled) setInternalIso2(iso2);
    emitChange(iso2, digits);
  };

  const updateNumber = (nextIso2: string, raw: string) => {
    const nextCountry = getCountry(nextIso2);
    const clean = raw.replace(/\D/g, '').slice(0, nextCountry.maxLength);
    if (!isNumberControlled) setInternalNumber(clean);
    emitChange(nextIso2, clean);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Pasting / typing an international number switches the country automatically
    if (raw.trim().startsWith('+')) {
      const parsed = parseInternational(raw, currentIso2);
      if (parsed) {
        if (!isCountryControlled) setInternalIso2(parsed.iso2);
        updateNumber(parsed.iso2, parsed.nationalNumber);
        return;
      }
    }

    updateNumber(currentIso2, raw);
  };

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  /* ---------------------------- dropdown ---------------------------- */

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    const qDigits = q.replace(/^\+/, '');

    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso2.toLowerCase() === q ||
        (qDigits.length > 0 && c.dialCode.startsWith(qDigits)),
    );
  }, [query]);

  const toggleOpen = () => {
    if (!open) {
      setQuery('');
      const idx = COUNTRIES.findIndex((c) => c.iso2 === country.iso2);
      setActiveIndex(idx < 0 ? 0 : idx);
    }
    setOpen((prev) => !prev);
  };

  const selectCountry = (iso2: string) => {
    updateCountry(iso2);
    setOpen(false);
    setQuery('');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const c = filtered[activeIndex];
      if (c) selectCountry(c.iso2);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setQuery('');
    }
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Keep the active option visible
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  /* ---------------------------- render ------------------------------ */

  return (
    <div className={`phone-input ${className ?? ''}`.trim()} ref={rootRef}>
      {label && (
        <label className="phone-input__label" htmlFor={inputId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <div
        className={
          'phone-input__field' + (shownError ? ' phone-input__field--invalid' : '')
        }
      >
        <button
          type="button"
          className="phone-input__country"
          onClick={toggleOpen}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Country code: ${country.name} +${country.dialCode}. Change country`}
        >
          <span className="phone-input__flag" aria-hidden="true">
            {flagEmoji(country.iso2)}
          </span>
          <span className="phone-input__dial">+{country.dialCode}</span>
          <svg
            className="phone-input__chevron"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            aria-hidden="true"
          >
            <path
              d="M2 4.5 6 8.5 10 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <input
          id={inputId}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          className="phone-input__number"
          value={digits}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={shownError ? errorId : undefined}
        />

        {open && (
          <div className="phone-input__popover">
            <input
              type="text"
              className="phone-input__search"
              placeholder="Search country or code…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              autoFocus
              aria-label="Search countries"
            />

            <ul
              className="phone-input__list"
              role="listbox"
              ref={listRef}
              aria-label="Countries"
            >
              {filtered.length === 0 && (
                <li className="phone-input__empty">No countries found</li>
              )}

              {filtered.map((c, i) => (
                <li
                  key={c.iso2}
                  role="option"
                  aria-selected={c.iso2 === country.iso2}
                  data-active={i === activeIndex}
                  className={
                    'phone-input__option' +
                    (c.iso2 === country.iso2 ? ' phone-input__option--selected' : '')
                  }
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => selectCountry(c.iso2)}
                >
                  <span className="phone-input__flag" aria-hidden="true">
                    {flagEmoji(c.iso2)}
                  </span>
                  <span className="phone-input__name">{c.name}</span>
                  <span className="phone-input__code">+{c.dialCode}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {shownError && (
        <p id={errorId} className="phone-input__error" role="alert">
          {shownError}
        </p>
      )}
    </div>
  );
}

export default PhoneInput;