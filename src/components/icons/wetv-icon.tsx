import Image from 'next/image';

export function WeTVIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <Image
        src="https://yt3.googleusercontent.com/v3OXiNxiLUR6j2XGfddB5-ro63vfTufv2yqknWHMag7jRu-ZfRxO-SuIaCTWBmsY-NkY4IMDCg=s900-c-k-c0x00ffffff-no-rj"
        alt="WeTV logo"
        width={40}
        height={40}
        className={props.className}
        style={{ objectFit: 'contain' }}
      />
    );
}
