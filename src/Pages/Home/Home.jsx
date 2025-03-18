import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "../../Styles/Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import images
import codeTogether from "../../assets/code-together.webp";
import collaborateLearn from "../../assets/collaborate-together.png";
import showcaseWork from "../../assets/showcase-work.jpg";

function HomePage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <div className="home">
      {/* Carousel Section */}
      <div className="carousel-container">
        <Slider {...settings}>
          <div className="slide">
            <img src={codeTogether} alt="Code Together" />
          </div>
          <div className="slide">
            <img src={collaborateLearn} alt="Collaborate & Learn" />
          </div>
          <div className="slide">
            <img src={showcaseWork} alt="Showcase Your Work" />
          </div>
        </Slider>
      </div>

      {/* Intro Section */}
      <div className="intro-section">
        <h1>DevConnect – Code. Connect. Collaborate.</h1>
        <p>
          Join a growing network of developers and learners. Share your
          knowledge, ask and answer questions, and showcase your expertise.
          Whether you're a beginner or an experienced coder, DevConnect is your
          space to learn and collaborate.
        </p>

        {/* Sign Up & Login Buttons */}
        <div className="btns">
          <button className="signup-btn">
            <Link to="/signup" className="sign-up">
              Get Started
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
