import image from "../../assets/community.webp";
import "../../Styles/Community.css";

function CommunityPage() {
  return (
    <div className="community">
      <h1>Community - A Thriving Developer Network</h1>
      <div className="image-container">
        <img src={image} alt="Developer Community" />
      </div>
      <p>
        At DevConnect, you're not just a user—you’re part of a growing network
        of developers. Share your experiences, discuss coding challenges, and
        explore new ideas. From troubleshooting errors to celebrating
        milestones, the community is here to support your journey. Engage,
        learn, and contribute as you connect with developers who share your
        passion.
      </p>
    </div>
  );
}

export default CommunityPage;
