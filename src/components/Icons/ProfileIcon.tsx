type Props = {
    className?: string
}

export default function ProfileIcon({ className }: Props) {
    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M11 13.5C14.4518 13.5 17.25 10.7018 17.25 7.25C17.25 3.79822 14.4518 1 11 1C7.54822 1 4.75 3.79822 4.75 7.25C4.75 10.7018 7.54822 13.5 11 13.5ZM11 13.5C5.47715 13.5 1 16.8579 1 21M11 13.5C16.5228 13.5 21 16.8579 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}