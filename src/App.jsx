// import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import HomePage from "./Components/Home/Home";
import FeaturesPage from "./Components/Features/Features";
import { Element } from "react-scroll";
import CommunityPage from "./Components/Community/Community";
import ContactPage from "./Components/Contact/Contact";


function App() {
  return (
    <>
      <Navbar />
      <Element name="home">
        <HomePage />
      </Element>
      <Element name="features">
        <FeaturesPage />
      </Element>
      <Element name="community">
        <CommunityPage />
      </Element>
      <Element name="contact">
        <ContactPage />
      </Element>
    </>
  );
}

export default App;




