import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Home_testimonials.css';
import { logo } from '../assets';
const Home_testimonials = () => {
  const profiles = [
    {
      name: 'Adam Smith',
      rating: '4.8/5',
      testimonial: 'Staying at Villa Serenity was a dream come true! The breathtaking views, luxurious amenities, and attentive staff made our vacation unforgettable. Highly recommend!',
      image: logo,
    },
    {
      name: 'Eve Johnson',
      rating: '4.9/5',
      testimonial: 'The experience at Villa Serenity was outstanding. The service was impeccable, and the amenities were top-notch. We will definitely return!',
      image: logo, 
    },
    {
      name: 'John Doe',
      rating: '4.7/5',
      testimonial: 'Villa Serenity exceeded our expectations. The ambiance and comfort provided were simply unmatched. A perfect getaway destination!',
      image: logo,
    },
    {
      name: 'Jane Roe',
      rating: '4.6/5',
      testimonial: 'A delightful stay at Villa Serenity! The facilities were exceptional, and the staff went above and beyond to make our stay memorable.',
      image: logo, 
    },
  ];

  return (
    <Carousel
      showArrows={true}
      infiniteLoop={true}
      showThumbs={false}
      showStatus={false}
      autoPlay={true}
      interval={5000}
    >
      {profiles.map((profile, index) => (
        <div key={index} className="profile-slide">
          <div className="profile-content">
            <div className="profile-image">
              <img src={profile.image} alt={`${profile.name}'s profile`} />
            </div>
            <div className="profile-text">
              <h2>{profile.name}</h2>
              <p>Ratings {profile.rating}</p>
              <p>{profile.testimonial}</p>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default Home_testimonials;
