import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styles from './BookRatingForm.module.css';
import { generateStarsInputs, displayStars } from '../../../lib/functions';
import { APP_ROUTES } from '../../../utils/constants';
import { useUser } from '../../../lib/customHooks';
import { rateBook } from '../../../lib/common';

function BookRatingForm({
  rating, setRating, userId, setBook, id, userRated,
}) {
  const { connectedUser, auth } = useUser();
  const navigate = useNavigate();
  const { register, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      rating: 0,
    },
  });

  const [thanked, setThanked] = useState(false); // État pour gérer le message de remerciement

  useEffect(() => {
    if (formState.dirtyFields.rating) {
      const rate = document.querySelector('input[name="rating"]:checked').value;
      setRating(parseInt(rate, 10));
      formState.dirtyFields.rating = false;
    }
  }, [formState, setRating]);

  const onSubmit = async () => {
    if (!connectedUser || !auth) {
      navigate(APP_ROUTES.SIGN_IN);
      return;
    }
    const update = await rateBook(id, userId, rating);
    if (update) {
      // eslint-disable-next-line no-underscore-dangle
      setBook({ ...update, id: update._id });
      setThanked(true);
    } else {
      alert(update);
    }
  };

  return (
    <div className={styles.BookRatingForm}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {thanked ? (
          <div>
            <p className="thank"> Merci!</p>
            <div className={styles.Stars}>
              {!userRated ? generateStarsInputs(rating, register) : displayStars(rating)}
            </div>
          </div>
        ) : (
          <>
            <p>{rating > 0 ? 'Votre Note' : 'Notez cet ouvrage'}</p>
            <div className={styles.Stars}>
              {!userRated ? generateStarsInputs(rating, register) : displayStars(rating)}
            </div>
            {!userRated ? <button type="submit">Valider</button> : null}
          </>
        )}
      </form>
    </div>
  );
}

BookRatingForm.propTypes = {
  rating: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  setBook: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  userRated: PropTypes.bool.isRequired,
};

export default BookRatingForm;
