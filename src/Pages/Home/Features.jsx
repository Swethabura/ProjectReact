import "../../Styles/Features.css";
import img1 from "../../assets/featureImg-1.jpg";
import img2 from "../../assets/featureImg-2.jpg";
import img3 from "../../assets/featureImg-3.png";
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
            <h2>🤝 Collaborate on Projects</h2>
            <p>
              Connect with developers who share your interests and work together
              on real-world projects. Whether it's open-source contributions or
              personal initiatives, DevConnect helps you find the right team
              members, discuss ideas, and track progress seamlessly.
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
            <h2>💡 Discuss & Solve Coding Errors</h2>
            <p>
              Struggling with a bug? Get quick solutions from the community!
              Post your errors, discuss possible fixes, and learn from
              experienced developers. Engage in meaningful discussions and
              refine your problem-solving skills.
            </p>
          </div>
        </div>

        {/* Third Feature */}
        <div className="feature">
          <div className="feature-content">
            <h2>🚀 Showcase Your GitHub Projects</h2>
            <p>
              Highlight your work by linking your GitHub repositories directly
              to your DevConnect profile. Share your progress, get feedback, and
              attract potential collaborators who are interested in your
              projects.
            </p>
          </div>
          <div className="feature-img">
            <img src={img3} alt="Showcase Your GitHub Projects" />
          </div>
        </div>

        {/* Fourth Feature */}
        <div className="feature feature-reverse">
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
        </div>
      </div>
    </div>
  );
}

export default FeaturesPage;
