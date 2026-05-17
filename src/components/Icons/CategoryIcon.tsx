type Props = {
    className?: string
}

export default function CategoryIcon({ className }: Props) {
    return (
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M3 7H15V5H3V7ZM0 0V2H18V0H0ZM7 12H11V10H7V12Z" fill="#2B2B2B"/>
        </svg>

    )
}