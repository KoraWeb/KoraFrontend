
type Props = {
    className?: string
}

export default function HeartIcon({ className }: Props) {
    return (
        <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path fillRule="evenodd" clipRule="evenodd" d="M10.9932 3.15762C8.9938 0.798479 5.65975 0.163876 3.15469 2.32415C0.649644 4.48442 0.296968 8.09628 2.2642 10.6512C3.89982 12.7755 8.84977 17.2558 10.4721 18.7059C10.6536 18.8681 10.7444 18.9492 10.8502 18.9811C10.9426 19.0089 11.0437 19.0089 11.1361 18.9811C11.2419 18.9492 11.3327 18.8681 11.5142 18.7059C13.1365 17.2558 18.0865 12.7755 19.7221 10.6512C21.6893 8.09628 21.3797 4.46169 18.8316 2.32415C16.2835 0.1866 12.9925 0.798479 10.9932 3.15762Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}