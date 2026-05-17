export default function CrossIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0)">
        <path d="M13.5 0.5L0.5 13.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0.5 0.5L13.5 13.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="14" height="14" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}