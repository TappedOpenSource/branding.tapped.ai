'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserModel } from '@/domain/models/user_model';
import BookingHistoryPreview from '@/components/profile/BookingHistoryPreview';
import { getUserByUsername } from '@/data/database';
import ReviewsPreview from '@/components/profile/ReviewsPreview';
import InstagramButton from '@/components/profile/InstagramButton';
import TwitterButton from '@/components/profile/TwitterButton';
import TiktokButton from '@/components/profile/TiktokButton';
import SpotifyButton from '@/components/profile/SpotifyButton';
import Head from 'next/head';

export default function Page() {
  const router = useRouter();
  const username = router.query.username;
  const [user, setUser] = useState<UserModel | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof username !== 'string') {
        return;
      }

      // get user by username
      const user = await getUserByUsername(username);
      user.match({
        some: (user) => {
          // set user
          setUser(user);
        },
        none: () => {
          console.log('user not found');
          router.push('/404');
        },
      });
    };
    fetchUser();
  }, [router, username]);

  if (user === null) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <p>fetching {username}... </p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <meta
          name="description"
          content="my live performance page"
        />
        <meta property="og:site_name" content="tapped.ai" />
        <meta
          property="og:description"
          content="my live performance page"
        />
        <meta
          property="og:title"
          content="Tapped Ai : world's first Ai label"
        />
        <meta property="og:image" content="https://tapped.ai/download_og.png"></meta>
        <meta property="og:url" content="https://tapped.ai"></meta>
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Tapped Ai : world's first Ai label"
        />
        <meta
          name="twitter:description"
          content="we want to sign you to our label. apply for free"
        />
        <meta property="twitter:image" content="https://tapped.ai/download_og.png"></meta>
      </Head>
      <div className='relative h-[256px] w-screen overflow-hidden'>
        <Image
          src={user.profilePicture ?? '/images/default_avatar.png'}
          alt={`${user.artistName} profile picture`}
          objectFit='cover'
          objectPosition='center'
          fill
        />
      </div>
      <div className='md:flex md:justify-center'>
        <div className='py-4 px-6 md:w-1/2'>
          <div>
            <h1 className='text-4xl font-extrabold'>{user.artistName}</h1>
            <p className='text-sm text-gray-500'>@{user.username}</p>
          </div>
          <div className='h-4' />
          {/* <div>
            <h2 className='text-2xl font-bold'>Pricings</h2>
            <p>the prices</p>
          </div>
          <div className='h-4' /> */}
          <div className='flex flex-row items-center justify-around'>
            <div className='flex flex-col justify-center items-center'>
              <h3 className='text-2xl font-bold'>{user.followerCount ?? 0}</h3>
              <p className='text-xs text-font text-gray-500'>followers</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <h3 className='text-2xl font-bold'>{user.reviewCount ?? 0}</h3>
              <p className='text-xs text-font text-gray-500'>reviews</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <h3 className='text-2xl font-bold'>{user.overallRating ? `${user.overallRating}/5` : 'N/A'}</h3>
              <p className='text-sm text-gray-400'>rating</p>
            </div>
          </div>
          <div className='h-4' />
          <div className='flex flex-row items-center justify-around'>
            {user.instagramHandle && <InstagramButton instagramHandle={user.instagramHandle} />}
            {user.twitterHandle && <TwitterButton twitterHandle={user.twitterHandle} />}
            {user.tiktokHandle && <TiktokButton tiktokHandle={user.tiktokHandle} />}
            {user.spotifyId && <SpotifyButton spotifyId={user.spotifyId} />}
          </div>
          <div className='h-4' />
          <div>
            <div className='flex flex-row items-center'>
              <h2 className='text-2xl font-bold'>Reviews</h2>
              <div className='w-2' />
              <Link
                href={`/reviews/${user.id}`}
                className='text-sm text-blue-500'
              >
                see all
              </Link>
            </div>
            <div className="h-2" />
            <ReviewsPreview user={user} />
          </div>
          <div className='h-4' />
          <div>
            <div className='flex flex-row items-center'>
              <h2 className='text-2xl font-bold'>Booking History</h2>
              <div className='w-2' />
              <Link
                href={`/history/${user.id}`}
                className='text-sm text-blue-500'
              >
                see all
              </Link>
            </div>
            <div className="h-2" />
            <BookingHistoryPreview user={user} />
          </div>
          <div className='h-4' />
          <div>
            <h2 className='text-2xl font-bold'>More Info</h2>
            <div className="h-2" />
            <p>{user.bio}</p>
          </div>
        </div>
      </div>
    </>
  );
}
