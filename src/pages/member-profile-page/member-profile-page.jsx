import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { selectMember } from '../../redux/user/user.selectors';
import {
  setCurrentChannel,
  setPrivateChannel,
} from '../../redux/message/message.actions';
import { firestore } from '../../firebase/firebase.utils';
import posts from '../../assets/activities/posts.svg';
import star from '../../assets/activities/star.svg';
import calender from '../../assets/info/calender.svg';
import location from '../../assets/info/location.svg';
import time from '../../assets/info/time.svg';
import website from '../../assets/info/website.svg';
import Loader from '../../components/loader/loader';
import StarRating from '../../components/rating/rating';
import MemberActivityBox from '../../components/member-activity-box/member-activity-box';
import './member-profile-page.scss';
const MemberProfilePage = ({
  currentUser,
  history,
  member,
  setCurrentChannel,
  setPrivateChannel,
}) => {
  useEffect(() => {}, [currentUser]);

  const getChannelId = (userId) => {
    const currentUserId = currentUser.id;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };
  const toggleAdmin = async (isSetAdmin) => {
    const userRef = await firestore.doc(`users/${member[0].id}`);
    const snapShot = await userRef.get();
    if (snapShot.exists) {
      try {
        await userRef.update({ isAdmin: isSetAdmin ? true : false });
        return userRef;
      } catch (error) {
        console.log('Failed', error.message);
      }
    }
  };
  const upgradeUserToAdmin = async () => {
    toggleAdmin(true);
  };
  const revokeAdmin = async () => {
    toggleAdmin(false);
  };

  const changeChannel = (user) => {
    const channelId = getChannelId(user.id);
    const channelData = {
      id: channelId,
      name: user.displayName,
    };
    setCurrentChannel(channelData);
    setPrivateChannel(true);
    history.push('/messages');
  };

  return member[0] ? (
    <div className="member-profile-page">
      <Helmet>
        <title>We Read African &mdash; Profile</title>
        <meta property="og:title" content="We Read African &mdash; Profile" />
        <meta property="og:type" content="website" />
        <meta name="description" content=" " />
        <meta property="og:site_name" content="We Read African" />
        <meta
          property="og:url"
          content="https://www.wereadafrican.com/user-profile"
        />
      </Helmet>
      <div className="profile-page-header">
        <div className="profile-page-header-image">
          <div className="cover-container">
            {member[0].cover !== '' ? (
              <img className="cover-image" src={member[0].cover} alt="cover" />
            ) : null}
          </div>
        </div>
        <div className="profile-pic_buttons">
          <div className="group_">
            <div
              className="profile-pic"
              style={
                member[0].profile_pic !== ''
                  ? { backgroundImage: `url(${member[0].profile_pic} )` }
                  : {}
              }
            ></div>
            <br />
            <span>{member[0].displayName ? member[0].displayName : ''}</span>
          </div>
          {currentUser ? (
            <div className="buttons">
              {currentUser.isAdmin && currentUser.id !== member[0].id && (
                <span
                  className="make-admin"
                  onClick={
                    currentUser.isGrandAdmin &&
                    member[0].isAdmin &&
                    currentUser.id !== member[0].id
                      ? revokeAdmin
                      : upgradeUserToAdmin
                  }
                >
                  {currentUser.isGrandAdmin &&
                  member[0].isAdmin &&
                  currentUser.id !== member[0].id
                    ? 'Revoke'
                    : 'Make'}{' '}
                  Admin
                </span>
              )}
              {currentUser.id === member[0].id ? (
                <span className="sendMessage">You</span>
              ) : (
                <span
                  className="sendMessage"
                  onClick={() => changeChannel(member[0])}
                >
                  Send Message
                </span>
              )}
            </div>
          ) : null}
        </div>
      </div>
      <div className="user-desc_info">
        <div className="rate">
          <span>Member</span>
          <span className="demacator">|</span>
          <StarRating rating={2} />
        </div>
        <div className="role">{member[0].isAdmin && <span>Admin</span>}</div>
        <div className="desc">
          <span className="bio">{member[0].bio ? member[0].bio : ''}</span>
        </div>
        <div className="info">
          <span className="joined">
            {' '}
            <img src={calender} alt="calender icon" /> Joined:{' '}
            {member[0].createdAt
              ? new Date(member[0].createdAt.seconds * 1000)
                  .toString()
                  .split(' ')
                  .slice(1, 4)
                  .join(' ')
              : 'January 2020'}
          </span>
          <span className="link">
            {' '}
            <img src={website} alt="link icon" />{' '}
            <a href={member[0].website ? member[0].website : ''}>
              {member[0].website ? member[0].website : ''}
            </a>
          </span>
          <span className="location">
            {' '}
            <img src={location} alt="location icon" />
            {member[0].location ? member[0].location : ''}
          </span>
          <span className="timezone">
            {' '}
            <img src={time} alt="time icon" />{' '}
            {member[0].createdAt
              ? new Date(member[0].createdAt.seconds * 1000)
                  .toString()
                  .split(' ')
                  .slice(5, 6)
                  .join(' ')
              : 'GMT +1'}
          </span>
        </div>
        <br />
        <span className="signature">
          {member[0].signature ? member[0].signature : ''}
        </span>
      </div>
      <div className="member-activity">
        <h4>Member Activity</h4>
        <div className="boxes">
          <MemberActivityBox
            data={{
              img: posts,
              num: member[0].posts ? member[0].posts.length : 0,
              text: 'Forum Posts',
            }}
          />
          <MemberActivityBox data={{ img: star, num: 1, text: 'Rating' }} />
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
};
const mapStateToProps = (state, ownProps) => {
  return {
    member: selectMember(
      ownProps.match.params.memberId,
      ownProps.match.url
    )(state),
    currentUser: state.user.currentUser,
  };
};

export default withRouter(
  connect(mapStateToProps, { setCurrentChannel, setPrivateChannel })(
    MemberProfilePage
  )
);
