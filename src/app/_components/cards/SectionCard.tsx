import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface SectionCardProps {
  name: string;
  imgSrc: string;
  link?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ name, imgSrc, link }) => {
  return (
    <Link href={`${link}`} className="basis-full md:basis-1/2 lg:basis-1/3 p-4">
      <Card className="flex justify-center gap-4 items-center py-4">
        <Image alt="icon" src={imgSrc} width={50} height={50} />
        <p className="prose prose-xl text-wrap">{name}</p>
      </Card>
    </Link>
  );
};

export default SectionCard;
