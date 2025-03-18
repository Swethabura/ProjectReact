import "../../Styles/Features.css";
import img1 from "../../assets/featureImg-1.webp";
import img2 from "../../assets/featureImg-2.jpg";
import img3 from "../../assets/featureImg-3.jpg";
import img4 from "../../assets/featureImg-4.webp";

function FeaturesPage() {
  return (
    <div className="features">
      {/* Heading Section */}
      <div className="features-heading">
        <h1>Our Features</h1>
        <p>Explore the features that make DevConnect unique.</p>
      </div>

      {/* Features List */}
      <div className="feature-container">
        {/* First Feature */}
        <div className="feature">
          <div className="feature-content">
            <h2>🌍 Engage with the Developer Community</h2>
            <p>
            Share your thoughts, updates, and insights with the community. Like, 
              comment, and interact with posts from fellow developers, making learning 
              a collaborative experience.
            </p>
          </div>
          <div className="feature-img">
            <img src={img1} alt="Collaborate on Projects" />
          </div>
        </div>

        {/* Second Feature */}
        <div className="feature feature-reverse">
          <div className="feature-img">
            <img src={img2} alt="Discuss & Solve Coding Errors" />
          </div>
          <div className="feature-content">
            <h2>💡 Ask & Answer Coding Questions</h2>
            <p>
            Facing a coding challenge? Post your questions and get insights from 
              experienced developers. Help others by sharing your knowledge, and grow 
              your problem-solving skills in the process.
            </p>
          </div>
        </div>

        {/* Third Feature */}
        <div className="feature">
          <div className="feature-content">
            <h2>📢 Share Your Projects & Insights</h2>
            <p>
            Showcase your work by sharing project updates, coding experiences, and 
              key learnings through posts. Get feedback, inspire others, and build your 
              presence in the developer space.
            </p>
          </div>
          <div className="feature-img">
            <img src={img3} alt="Showcase Your GitHub Projects" />
          </div>
        </div>

        {/* Fourth Feature */}
        {/* <div className="feature feature-reverse">
          <div className="feature-img">
            <img src={img4} alt="AI-Powered Learning" />
          </div>
          <div className="feature-content">
            <h2>🧠 AI-Powered Learning</h2>
            <p>
              Leverage AI-driven insights to improve your coding skills. Get
              personalized suggestions for learning resources, code
              improvements, and career growth based on your activity and
              interests. DevConnect’s AI assistant helps you stay on track and
              make the most of your learning journey.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default FeaturesPage;
