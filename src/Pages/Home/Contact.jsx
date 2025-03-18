import "../../Styles/Contact.css";

function ContactPage() {
  return (
    <div className="contact">
      <h1>Contact 📩</h1>
      <p>
        Have questions, feedback, or collaboration ideas? We’d love to hear from
        you! Reach out to us through:
      </p>
      <div className="contact-info">
        <p>
          📧 Email: <a href="mailto:email@example.com">swethabura01@gmail.com</a>
        </p>
        <p>
        🔗 LinkedIn: {" "}
          <a
            href="https://www.linkedin.com/in/swetha-bura-866720252"
            target="_blank"
            rel="noopener noreferrer"
          >
            Swetha Bura
          </a>
        </p>
        {/* <p>
          💬 Join Our Community:{" "}
          <a
            href="https://discord.gg/example"
            target="_blank"
            rel="noopener noreferrer"
          >
            DevConnect Forum/Discord
          </a>
        </p> */}
      </div>
      <p>Let’s build and grow together! 🚀</p>
    </div>
  );
}

export default ContactPage;
