/**
 * English contact copy. The address, phone, email, and hours follow the Persian details.
 * Social links and the map pin are examples until the gallery accounts and exact door are supplied.
 */
export const contactPageEn = {
  metaTitle: "Contact Us — Rahil Gallery",
  metaDescription:
    "Rahil Gallery in Isfahan, Naqsh-e Jahan Square, Sheikh Lotfollah Bazaar. Phone, email, and visiting hours.",
  title: "Contact Us",
  lede: "Visit the gallery, or write to us about a commission.",
  addressLabel: "Address",
  address: "Isfahan, Naqsh-e Jahan Square, Sheikh Lotfollah Bazaar, Rahil Gallery",
  phoneLabel: "Phone",
  phone: "0916 200 9540",
  phoneHref: "tel:+989162009540",
  emailLabel: "Email",
  email: "mahdifarahnakian@gmail.com",
  hoursLabel: "Hours",
  hours: "8 AM – 9 PM",
  socialLabel: "Social",
  socialNote: "These links are examples until the gallery accounts are added.",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "WhatsApp", href: "https://wa.me/989162009540" },
    { label: "Telegram", href: "https://t.me/" },
  ],
  storefrontAlt: "The Rahil Gallery storefront",
  entranceAlt: "The entrance of Rahil Gallery",
  mapLabel: "Map",
  mapNote:
    "This map is an example of the Naqsh-e Jahan area. The exact gallery pin will replace it.",
  mapTitle: "Example map of Naqsh-e Jahan Square",
  mapLink: "Open the map",
  form: {
    title: "Write to the gallery",
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    messageLabel: "Message",
    submit: "Send",
    note: "Sending is not connected to email yet. This form is here so you can review the page.",
    success: "Your message stayed on this page. Once sending is connected, this form will deliver it.",
    another: "Write another message",
    errors: {
      name: "Enter your name.",
      email: "Enter a valid email.",
      message: "Enter a message.",
    },
  },
} as const;
