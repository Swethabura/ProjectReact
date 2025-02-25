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
          📧 Email: <a href="mailto:email@example.com">email@example.com</a>
        </p>
        <p>
          🐦 Twitter/X:{" "}
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
          >
            @yourhandle
          </a>
        </p>
        <p>
          💬 Join Our Community:{" "}
          <a
            href="https://discord.gg/example"
            target="_blank"
            rel="noopener noreferrer"
          >
            DevConnect Forum/Discord
          </a>
        </p>
      </div>
      <p>Let’s build and grow together! 🚀</p>
    </div>
  );
}

export default ContactPage;
