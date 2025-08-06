import Image from 'next/image';

export function IQIYIIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <Image
        src="https://yt3.googleusercontent.com/R14r3tJePVd8Wu8qeslUa0eBCGpizZBGECAqhZmwFpfwcPtdvzvIqy7tJuuCKWkyKI6Wzex3yuo=s900-c-k-c0x00ffffff-no-rj"
        alt="iQIYI logo"
        width={40}
        height={40}
        className={props.className}
        style={{ objectFit: 'contain' }}
      />
    );
}
