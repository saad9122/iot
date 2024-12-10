import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Data {
  name: string;
  address: string;
  imgSrc: string;
}

const TopCustomersCard = () => {
  const data: Data[] = [
    {
      name: 'Livia Bator',
      address: 'address',
      imgSrc: '/icons/avatar.svg',
    },
    {
      name: 'Randy Press',
      address: 'address',
      imgSrc: '/icons/avatar.svg',
    },
    {
      name: 'Workman',
      address: 'address',
      imgSrc: '/icons/avatar.svg',
    },
    {
      name: 'Livia Bator',
      address: 'address',
      imgSrc: '/icons/avatar.svg',
    },
  ];
  return (
    <div>
      <p className="prose prose-xl">Top Customers Monthly</p>

      <Card className="h-[20.5rem] w-full">
        <div className="flex flex-col justify-center h-full w-full ">
          <CardContent>
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-full"
            >
              <CarouselContent>
                {data.map((value, index) => (
                  <CarouselItem key={index} className="basis-1/3 sm:basis-full md:basis-1/2">
                    <div className="p-1">
                      <div className="flex flex-col aspect-square items-center justify-center">
                        <Image alt="icon" src={value.imgSrc} width={70} height={78} />
                        <p className="prose prose-sm font-semibold mt-2">{value.name}</p>
                        <p className="prose prose-sm">{value.address}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <div className="flex justify-center mt-2">
              <Button>Learn More</Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default TopCustomersCard;
