import { useState, useEffect } from 'react';
import UserTile from '../UserTile';
import { UserModel } from '@/domain/types/user_model';
import { Review } from '@/domain/types/review';
import { getUserById } from '@/data/database';

export default function ReviewTile({ review }: {
    review: Review;
}) {
  const [reviewer, setReviewer] = useState<UserModel | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (review === null) {
        return;
      }

      const reviewerId = review.type === 'booker' ?
        review.performerId :
        review.bookerId;

      const reviewer = await getUserById(reviewerId);
      setReviewer(reviewer ?? null);
    };
    fetchUsers();
  }, [review]);

  return (
    <>
      <div className='rounded-xl p-4 bg-gray-900'>
        <UserTile user={reviewer} />
        <div className='h-2' />
        <p>{review.overallReview}</p>
      </div>
    </>
  );
}
