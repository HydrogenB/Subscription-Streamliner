import Image from 'next/image';

export function ViuIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <Image
        src="https://www.true.th/hubfs/assets_logos/logo-viu-transparent-200x200.png"
        alt="Viu logo"
        width={40}
        height={40}
        className={props.className}
        style={{ objectFit: 'contain' }}
      />
    );
}
