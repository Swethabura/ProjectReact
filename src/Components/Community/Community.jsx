import image from "../../assets/community.webp";
import './Community.css'

function CommunityPage() {
  return (
    <>
      <div className="community">
        <h1>Community - A Thriving Developer Network</h1>
        <img src={image} alt="" />
        <p>
          DevConnect is more than just a platform—it's a community-driven space
          where developers of all levels come together to share knowledge,
          collaborate, and grow. Whether you're a beginner or an expert, you'll
          find like-minded individuals who are passionate about coding.
        </p>
      </div>
    </>
  );
}

export default CommunityPage;
