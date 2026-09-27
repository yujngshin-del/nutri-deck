export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        fill="#1f9d55"
        d="M32 4 10 14v18c0 14 9.2 24.2 22 28 12.8-3.8 22-14 22-28V14L32 4z"
      />
      <path fill="#ffffff" d="M32 18c-6 6-8 12-8 18 4-2 8-2 12 0 0-8-1-14-4-18z" />
      <path fill="#d9ffe8" d="M32 22c2 4 3 8 3 14-2-1-4-1-6 0 1-5 2-9 3-14z" />
    </svg>
  );
}
