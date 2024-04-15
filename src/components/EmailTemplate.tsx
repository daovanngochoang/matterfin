
interface ContactFormEmailProps {
  name: string
  email: string
  message: string
}

const ContactFormEmail: React.FC<Readonly<ContactFormEmailProps>> = ({
  name,
  email,
  message
}) => (
  <div>
    <h1>New payment request from {name}</h1>
    <p>
      Please click to the link below to view the checkout page
    </p>
    <p>Link: {message}</p>
  </div>
)

export default ContactFormEmail;
