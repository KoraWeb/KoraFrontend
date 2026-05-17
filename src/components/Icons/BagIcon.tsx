type Props = {
    className?: string
}

export default function BagIcon({ className }: Props) {
    return (
        <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M6.56145 8.73684V4.31579C6.56145 2.48453 8.10094 1 10 1C11.8991 1 13.4385 2.48453 13.4385 4.31579V8.73684M1.97672 17H18.0233M3.29248 22H16.7075C18.0379 22 19.0888 20.9116 18.9941 19.632L18.1754 8.57935C18.0897 7.42257 17.0915 6.52632 15.8888 6.52632H4.11119C2.90852 6.52632 1.91033 7.42257 1.82465 8.57935L1.00594 19.632C0.91116 20.9116 1.96213 22 3.29248 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}