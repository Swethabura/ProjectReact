import React from "react";
import Slider from "react-slick";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import images
import codeTogether from "../../assets/code-together.jpg";
import collaborateLearn from "../../assets/collaborate-together.png";
import showcaseWork from "../../assets/showcase-work.jpg";

function HomePage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="home">
      {/* Carousel Section - Now at the Top */}
      <div className="carousel-container">
        <Slider {...settings}>
          <div>
            <img src={codeTogether} alt="Code Together" />
          </div>
          <div>
            <img src={collaborateLearn} alt="Collaborate & Learn" />
          </div>
          <div>
            <img src={showcaseWork} alt="Showcase Your Work" />
          </div>
        </Slider>
      </div>

      {/* Intro Section */}
      <div className="intro-section">
        <h1>DevConnect – Code. Connect. Collaborate.</h1>
        <p>
          Join a thriving community of developers, learners, and innovators.
          Share your knowledge, showcase your projects, and engage in meaningful
          discussions. Whether you're a beginner or a seasoned coder, DevConnect
          is your space to grow, learn, and build together.
        </p>

        {/* Sign Up & Login Buttons */}
        <div className="btns">
          <button>Sign Up</button>
          <button>Login</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
