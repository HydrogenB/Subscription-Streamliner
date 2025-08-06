export function YouTubeIcon(props: React.SVGProps<SVGSVGElement> & { serviceId?: string }) {
    const { serviceId, ...rest } = props;
    return (
        <svg {...rest} viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.5 3.125C27.1875 1.875 26.1875 0.875 24.9375 0.5625C22.75 0 14 0 14 0C14 0 5.25 0 3.0625 0.5625C1.8125 0.875 0.8125 1.875 0.5 3.125C0 5.3125 0 10 0 10C0 10 0 14.6875 0.5 16.875C0.8125 18.125 1.8125 19.125 3.0625 19.4375C5.25 20 14 20 14 20C14 20 22.75 20 24.9375 19.4375C26.1875 19.125 27.1875 18.125 27.5 16.875C28 14.6875 28 10 28 10C28 10 28 5.3125 27.5 3.125Z" fill="#FF0000"/>
            <path d="M11.1875 14.375L18.375 10L11.1875 5.625V14.375Z" fill="white"/>
        </svg>
    );
}
