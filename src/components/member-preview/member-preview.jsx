import React from 'react';
import { Link } from 'react-router-dom'
import './member-preview.scss';
import StarRating from '../rating/rating';
const MemberPreview = ({ data }) => {
  const { displayName, rating, createdAt, posts, id } = data,
    date = new Date(createdAt.seconds * 1000),
    months = [
      'January',
      'Febuary',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    currentMonth = months[date.getMonth()],
    year = date.getFullYear();
  return (
    <div className="member-preview">
      <div className="avat">
        <h3>Image</h3>
      </div>
      <div className="member-info">
        <Link to={`/members/${id}`}>
          <h5>{displayName}</h5>
        </Link>
        <div className="sub-member-info">
          <StarRating rating={rating} />
          <span className="seprator">|</span>
          <span>posts: {posts.length}</span>
        </div>
      </div>
      <div className="regi">
        <span>
          {currentMonth} {year}
        </span>
      </div>
    </div>
  );
};

export default MemberPreview;
