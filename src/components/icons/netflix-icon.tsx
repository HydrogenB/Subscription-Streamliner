import Image from 'next/image';

export function NetflixIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Image
      src="https://images.icon-icons.com/2699/PNG/512/netflix_logo_icon_170919.png"
      alt="Netflix logo"
      width={64}
      height={64}
      className={props.className}
      style={{ objectFit: 'contain' }}
    />
  );
}
