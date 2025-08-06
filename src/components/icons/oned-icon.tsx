import Image from 'next/image';

export function OneDIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <Image
        src="https://www.oned.net/_nuxt/oneD_logo_black.BJCu-mC7.png"
        alt="oneD logo"
        width={40}
        height={40}
        className={props.className}
        style={{ objectFit: 'contain' }}
      />
    );
}
