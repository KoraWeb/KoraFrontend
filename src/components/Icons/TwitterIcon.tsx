type Props = {
    className?: string
}

export default function TwitterIcon({ className }: Props) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M18.7701 0H22.4247L14.4405 9.82741L23.8333 23.2003H16.4788L10.7185 15.0897L4.12744 23.2003H0.470635L9.01055 12.6888L0 0H7.5412L12.748 7.41339L18.7701 0ZM17.4875 20.8446H19.5126L6.44084 2.23199H4.26775L17.4875 20.8446Z" fill="currentColor" />
        </svg>

    )
}

