import Image from 'next/image';

export function TrueIDIcon(props: React.SVGProps<SVGSVGElement> & { serviceid?: string }) {
  const { serviceid, ...rest } = props;
  const logos = {
    trueplus: "https://cms.dmpcdn.com/helpcenter/2022/04/04/3f6f68a0-b3d3-11ec-a6ff-d1a30b937bc5_webp_original.png",
    trueidshort: "https://cms.dmpcdn.com/trueyoumerchant/2025/05/16/a12119a0-3232-11f0-aef9-77bd2df9da99_webp_original.webp",
  };
  
  const src = serviceid === 'trueplus' ? logos.trueplus : logos.trueidshort;

  return (
     <Image
      src={src}
      alt="TrueID logo"
      width={64}
      height={40}
      className={props.className}
      style={{ objectFit: 'contain' }}
      {...rest}
    />
  );
}
