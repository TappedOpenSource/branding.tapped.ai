
import { optionFromNullable } from '@/utils/option';
import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from '@firebase/firestore';
import { Option } from '@sniptt/monads';

export type Booking = {
    id: string;
    serviceId: Option<string>;
    name: string;
    note: string;
    requesterId?: string | null;
    requesteeId: string;
    status: 'pending' | 'confirmed' | 'canceled';
    rate: number;
    placeId: Option<string>;
    geohash: Option<string>;
    lat: Option<number>;
    lng: Option<number>;
    startTime: Date;
    endTime: Date;
    timestamp: Date;
    flierUrl: Option<string>;
}

export const bookingConverter = {
  toFirestore: (booking: Booking) => {
    return {
      ...booking,
      timestamp: Timestamp.fromDate(booking.timestamp),
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Booking {
    const data = snapshot.data(options);
    return {
      id: data.id,
      serviceId: optionFromNullable(data.serviceId),
      name: data.name,
      note: data.note,
      requesterId: data.requesterId,
      requesteeId: data.requesteeId,
      status: data.status,
      rate: data.rate,
      placeId: optionFromNullable(data.placeId),
      geohash: optionFromNullable(data.geohash),
      lat: optionFromNullable(data.lat),
      lng: optionFromNullable(data.lng),
      startTime: data.startTime.toDate(),
      endTime: data.endTime.toDate(),
      timestamp: data.timestamp.toDate(),
      flierUrl: optionFromNullable(data.flierUrl),
    };
  },
};

export const bookingImage = (booking: Booking | null): string => {
  if (booking === null) {
    return defaultImage('0');
  }

  return booking.flierUrl.match({
    some: (flierUrl) => {
      return flierUrl;
    },
    none: () => {
      return defaultImage(booking.id);
    },
  });
};

const defaultImage = (id: string): string => {
  const defaultImages = [
    '/images/default_images/bob.png',
    '/images/default_images/daftpunk.png',
    '/images/default_images/deadmau5.png',
    '/images/default_images/kanye.png',
    '/images/default_images/skrillex.png',
  ];

  const index = id.length % defaultImages.length;
  return defaultImages[index];
};
