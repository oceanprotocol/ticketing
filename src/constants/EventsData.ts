import { ImageSourcePropType } from 'react-native';

export type EventType = {
  id: number;
  artist: string;
  image: ImageSourcePropType;
  type?: string;
  date?: string;
  time?: string;
  location?: string;
  price?: string;
  description?: string;
  service?: string;
  dataToken?: string;
  reservationCode?: string;
};

export const EventsData: EventType[] = [
  {
    id: 1,
    artist: 'Coldplay',
    image: require('../../assets/concert-coldplay.jpg'),
    type: 'Concert',
    date: '13 Jun, 2024',
    time: '20:00',
    location: 'National Arena, Bucharest',
    price: '€40 - €90',
    service: 'Concert Booking',
    reservationCode: Math.random().toString().slice(2, 11),
    dataToken: '0x52b3f88c8aeba977abc56a6c5f3c7f1e3ae9de279ce5280d0b0f879931b3c16b',
    description:
      'Coldplay are a British rock band formed in London in 1997. They consist of vocalist and pianist Chris Martin, guitarist Jonny Buckland, bassist Guy Berryman, drummer Will Champion and creative director Phil Harvey  view more',
  },
  {
    id: 2,
    artist: 'Madonna',
    image: require('../../assets/concert-madonna.webp'),
    type: 'Concert',
    date: '23 Sept, 2024',
    time: '20:00',
    location: 'National Arena, Bucharest',
    price: '€40 - €90',
    service: 'Concert Booking',
    reservationCode: Math.random().toString().slice(2, 11),
    dataToken: '0xcaf8497d47c5a173a579b754100b0d474cbe000f570582c9f374e4cdd00c56a5',
    description:
      'Coldplay are a British rock band formed in London in 1997. They consist of vocalist and pianist Chris Martin, guitarist Jonny Buckland, bassist Guy Berryman, drummer Will Champion and creative director Phil Harvey  view more',
  },
  {
    id: 3,
    artist: 'Art Safari',
    image: require('../../assets/photo-1482160549825-59d1b23cb208.jpeg'),
    type: 'Exhibition',
    date: '2 Nov, 2024',
    time: '20:00',
    location: 'Bruxelles, Belgium',
    price: '€40 - €90',
    service: 'Museum Access',
    reservationCode: Math.random().toString().slice(2, 11),
    dataToken: '0xd9fdbad7f643ca69f18866842d45bf67ad5e7db9e5008e07dbe8ec041ae32737',
    description:
      'Coldplay are a British rock band formed in London in 1997. They consist of vocalist and pianist Chris Martin, guitarist Jonny Buckland, bassist Guy Berryman, drummer Will Champion and creative director Phil Harvey  view more',
  },
  {
    id: 4,
    artist: 'DJ Beat',
    image: require('../../assets/photo-1547210841-2ceb0c5f0679.jpeg'),
    type: 'DJ Set',
    date: '6 Sept, 2024',
    time: '20:00',
    location: 'Berlin Central Club',
    price: '€40 - €90',
    service: 'Club Access',
    reservationCode: Math.random().toString().slice(2, 11),
    dataToken: '0x334b098b22a10542f05640cfbf8695f1434efff53131dbbd2339030ac52c5d73',
    description:
      'Coldplay are a British rock band formed in London in 1997. They consist of vocalist and pianist Chris Martin, guitarist Jonny Buckland, bassist Guy Berryman, drummer Will Champion and creative director Phil Harvey  view more',
  },
];
