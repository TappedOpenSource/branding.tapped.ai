import {
  addDoc,
  collection,
  doc,
  query,
  getDoc,
  getDocs,
  setDoc,
  where,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';
import { Option, None, Some } from '@sniptt/monads';
import {
  LabelApplication,
  labelApplicationConverter,
} from '@/domain/models/label_application';
import { db } from '@/utils/firebase';
import { UserModel } from '@/domain/models/user_model';
import { Booking, bookingConverter } from '@/domain/models/booking';
import { Review, reviewConverter } from '@/domain/models/review';
import { Service, serviceConverter } from '@/domain/models/service';
import { Opportunity, opportunityConverter } from '@/domain/models/opportunity';

export async function getUserById(userId: string): Promise<Option<UserModel>> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    console.log('user doesnt exist');
    return None;
  }

  const user = docSnap.data() as UserModel;
  return Some(user);
}

export async function getUserByUsername(
  username: string
): Promise<Option<UserModel>> {
  const usersCollection = collection(db, 'users');
  const q = query(usersCollection, where('username', '==', username), limit(1));

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log('No user found!');
    return None;
  }

  const user = querySnapshot.docs[0].data() as UserModel;
  return Some(user);
}
export async function getLatestBookingByRequestee(
  userId: string
): Promise<Option<Booking>> {
  const bookingsCollection = collection(db, 'bookings');
  const querySnapshot = query(
    bookingsCollection,
    where('requesteeId', '==', userId),
    where('status', '==', 'confirmed'),
    orderBy('timestamp', 'desc'),
    limit(1)
  ).withConverter(bookingConverter);
  const queryDocs = await getDocs(querySnapshot);

  if (queryDocs.empty) {
    console.log('No booking found!');
    return None;
  }

  const booking = queryDocs.docs[0].data();
  return Some(booking);
}

export async function getLatestBookingByRequester(
  userId: string
): Promise<Option<Booking>> {
  const bookingsCollection = collection(db, 'bookings');
  const querySnapshot = query(
    bookingsCollection,
    where('requesterId', '==', userId),
    where('status', '==', 'confirmed'),
    orderBy('timestamp', 'desc'),
    limit(1)
  ).withConverter(bookingConverter);
  const queryDocs = await getDocs(querySnapshot);

  if (queryDocs.empty) {
    console.log('No booking found!');
    return None;
  }

  const booking = queryDocs.docs[0].data();
  return Some(booking);
}

export async function getLatestPerformerReviewByPerformerId(
  userId: string
): Promise<Option<Review>> {
  const reviewsCollection = collection(
    db,
    `reviews/${userId}/performerReviews`
  );
  const querySnapshot = query(
    reviewsCollection,
    orderBy('timestamp', 'desc'),
    limit(1)
  ).withConverter(reviewConverter);

  const queryDocs = await getDocs(querySnapshot);

  if (queryDocs.empty) {
    console.log('No review found!');
    return None;
  }

  const review = queryDocs.docs[0].data();
  return Some(review);
}

export async function getLatestBookerReviewByBookerId(
  userId: string
): Promise<Option<Review>> {
  const reviewsCollection = collection(db, `reviews/${userId}/bookerReviews`);
  const querySnapshot = query(
    reviewsCollection,
    orderBy('timestamp', 'desc'),
    limit(1)
  ).withConverter(reviewConverter);

  const queryDocs = await getDocs(querySnapshot);

  if (queryDocs.empty) {
    console.log('No review found!');
    return None;
  }

  const review = queryDocs.docs[0].data();
  return Some(review);
}

export async function getUserOpportunities(
  userId: string
): Promise<Opportunity[]> {
  const opportunitiesCollection = collection(db, 'opportunities');
  const querySnapshot = query(
    opportunitiesCollection,
    orderBy('startTime', 'desc'),
    where('startTime', '>', new Date()),
    where('deleted', '==', false),
    where('userId', '==', userId)
  ).withConverter(opportunityConverter);

  const queryDocs = await getDocs(querySnapshot);

  if (queryDocs.empty) {
    return [];
  }

  return queryDocs.docs.map((doc) => doc.data());
}

export async function getOpportunityById(opportunityId: string) {
  const docRef = doc(db, 'opportunities', opportunityId).withConverter(
    opportunityConverter
  );
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    console.log('No such document!');
    return None;
  }

  const opportunity = docSnap.data() as Opportunity;
  return Some(opportunity);
}

export async function getFeaturedOpportunities(): Promise<Opportunity[]> {
  const opportunitiesRef = collection(db, 'opportunities');
  const tccOpsQuery = query(
    opportunitiesRef,
    where('userId', '==', 'yfjw9oCMwPVzAxgENxGxecPcNym1'),
    where('deleted', '==', false),
    where('startTime', '>', new Date()),
    orderBy('startTime', 'desc'),
    limit(3),
  ).withConverter(opportunityConverter);
  const tccOpsSnap = await getDocs(tccOpsQuery);
  const tccOps = tccOpsSnap.docs.map((doc) => doc.data());

  const leadersRef = collection(db, 'leaderboard');
  const leadersSnap = doc(leadersRef, 'leaders');
  const leadersDoc = await getDoc(leadersSnap);
  const { featuredOpportunities } = leadersDoc.data() as {
    featuredOpportunities: string[];
  };
  const leaderOps = await Promise.all(
    featuredOpportunities
      .map(getOpportunityById)
      .filter(async (op) => (await op).isSome())
      .map(async (op) => (await op).unwrap())
  );

  return [...tccOps, ...leaderOps];
}

export async function getServiceById({
  userId,
  serviceId,
}: {
  userId: string;
  serviceId: string;
}): Promise<Option<Service>> {
  const docRef = doc(
    db,
    `/services/${userId}/userServices/${serviceId}`
  ).withConverter(serviceConverter);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return None;
  }

  const service = docSnap.data();
  return Some(service);
}

export async function getReviewsByPerformerId(
  userId: string
): Promise<Review[]> {
  const reviewsCollection = collection(
    db,
    `reviews/${userId}/performerReviews`
  );
  const querySnapshot = query(
    reviewsCollection,
    orderBy('timestamp', 'desc')
  ).withConverter(reviewConverter);

  const queryDocs = await getDocs(querySnapshot);

  return queryDocs.docs.map((doc) => doc.data());
}

export async function getReviewsByBookerId(userId: string): Promise<Review[]> {
  const reviewsCollection = collection(db, `reviews/${userId}/bookerReviews`);
  const querySnapshot = query(
    reviewsCollection,
    orderBy('timestamp', 'desc')
  ).withConverter(reviewConverter);

  const queryDocs = await getDocs(querySnapshot);

  return queryDocs.docs.map((doc) => doc.data());
}

export async function getBookingsByRequestee(
  userId: string
): Promise<Booking[]> {
  const bookingsCollection = collection(db, 'bookings');
  const querySnapshot = query(
    bookingsCollection,
    where('requesteeId', '==', userId),
    where('status', '==', 'confirmed'),
    orderBy('timestamp', 'desc')
  ).withConverter(bookingConverter);
  const queryDocs = await getDocs(querySnapshot);

  return queryDocs.docs.map((doc) => doc.data());
}

export async function getBookingsByRequester(
  userId: string
): Promise<Booking[]> {
  const bookingsCollection = collection(db, 'bookings');
  const querySnapshot = query(
    bookingsCollection,
    where('requesterId', '==', userId),
    where('status', '==', 'confirmed'),
    orderBy('timestamp', 'desc')
  ).withConverter(bookingConverter);
  const queryDocs = await getDocs(querySnapshot);

  return queryDocs.docs.map((doc) => doc.data());
}

export async function getBookingById(
  bookingId: string
): Promise<Option<Booking>> {
  const docRef = doc(db, 'bookings', bookingId).withConverter(bookingConverter);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    console.log('No such document!');
    return None;
  }

  const booking = docSnap.data();
  return Some(booking);
}

export async function createCheckoutSession({
  userId,
  priceId,
}: {
  userId: string;
  priceId: string;
}): Promise<void> {
  const sessionsRef = collection(db, `customers/${userId}/checkout_sessions`);
  const docRef = await addDoc(sessionsRef, {
    price: priceId,
    success_url: `${window.location.origin}/signup_complete`,
    cancel_url: window.location.origin,
    allow_promotion_codes: true,
    mode: 'subscription',
  });

  // Wait for the CheckoutSession to get attached by the extension
  onSnapshot(docRef, (snap) => {
    const { error, url } = snap.data() as { error: Error; url: string };
    if (error) {
      // Show an error to your customer and then inspect your function logs.
      alert(`An error occured: ${error.message}`);
      document.querySelectorAll('button').forEach((b) => (b.disabled = false));
    }
    if (url) {
      window.location.assign(url);
    }
  });
}
export async function getActiveProducts(): Promise<
  { product: any; prices: any }[]
  > {
  const productsQuery = query(
    collection(db, 'products'),
    where('active', '==', true)
  );
  const products = await getDocs(productsQuery);

  return await Promise.all(
    products.docs.map(async (product) => {
      const priceRef = collection(db, `products/${product.id}/prices`);
      const pricesQuery = query(
        priceRef,
        where('active', '==', true),
        orderBy('unit_amount')
      );
      const prices = await getDocs(pricesQuery);

      return {
        product: {
          id: product.id,
          ...product.data(),
        },
        prices: prices.docs.map((price) => {
          return {
            id: price.id,
            ...price.data(),
          };
        }),
      };
    })
  );
}
export async function addCustomerSubscriptionListener(userId, callback) {
  const subscriptionsRef = collection(db, `customers/${userId}/subscriptions`);
  const queryRef = query(
    subscriptionsRef,
    where('status', 'in', ['trialing', 'active'])
  );
  return onSnapshot(queryRef, callback);
}
export async function createNewApplicationResponse({
  userId,
  labelApplication,
}: {
  userId: string;
  labelApplication: LabelApplication;
}) {
  const docRef = doc(db, `label_applications/${labelApplication.id}`);
  await setDoc(docRef, {
    userId,
    ...labelApplicationConverter.toFirestore(labelApplication),
  });

  return docRef.id;
}
