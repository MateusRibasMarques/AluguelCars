
export default function CarIcon({
  size = 28,
  color = 'currentColor'
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Aluguel de carros"
    >
      <path d="M5 16H3.5a1 1 0 0 1-1-1v-3.2a1 1 0 0 1 .3-.7l2-2a2 2 0 0 1 1.4-.6h2.3L10.3 5.6A2 2 0 0 1 12 4.7h2.6a2 2 0 0 1 1.6.8L18.3 9h1.2a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1H19" />
      <path d="M2.5 11.5h19M9 16h6" />
      <circle cx="7" cy="16.5" r="2" />
      <circle cx="17" cy="16.5" r="2" />
    </svg>
  )
}
