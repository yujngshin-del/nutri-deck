export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return <img src="/icon.png" alt="" className={`${className} object-contain`} />;
}
