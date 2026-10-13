export interface Couple {
  brideFirstName: string;
  groomFirstName: string;
  displayName: string;
  hashtag: string;
  heroImage: string | null;
  portraitImage: string | null;
  bridePortraitImage: string | null;
  groomPortraitImage: string | null;
  shortIntroduction: string;
  brideIntroduction: string;
  groomIntroduction: string;
  closingLine: string;
  locationLabel: string;
}

export interface WeddingEvent {
  id: string;
  name: string;
  shortTitle: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  venueName: string | null;
  address: string | null;
  mapUrl: string | null;
  description: string;
  dressCode: string | null;
  icon: string;
  image: string | null;
  accentColor: string;
  enabled: boolean;
  showInRSVP: boolean;
  calendarStart: string | null;
  calendarEnd: string | null;
}

export interface TimelineEntry {
  title: string;
  dateLabel: string;
  description: string;
  image: string | null;
  alignment: "left" | "right";
  enabled: boolean;
}

export interface GalleryImage {
  src: string | null;
  alt: string;
  category: string;
  color: string;
}

export interface Venue {
  eventIds: string[];
  name: string | null;
  address: string | null;
  landmark: string | null;
  mapUrl: string | null;
  mapEmbedUrl: string | null;
  contactName: string | null;
  contactNumber: string | null;
  parkingNote: string | null;
  accessibilityNote: string | null;
}

export interface Contact {
  label: string;
  name: string;
  number: string;
}

export interface RSVPSubmission {
  guestName: string;
  phone: string;
  email?: string;
  attendeeCount: number;
  attendance: "attending" | "maybe" | "declining";
  events: string[];
  dietaryPreference: string;
  accommodation: boolean;
  transportation: boolean;
  message: string;
  consent: boolean;
}

export interface WeddingConfig {
  seo: { title: string; description: string };
  couple: Couple;
  weddingDate: string | null;
  assets: { logo: string };
  invitation: { eyebrow: string; heading: string; message: string };
  families: {
    brideFamilyLabel: string;
    brideFamilyNames: string;
    groomFamilyLabel: string;
    groomFamilyNames: string;
  };
  events: WeddingEvent[];
  story: TimelineEntry[];
  gallery: GalleryImage[];
  venues: Venue[];
  contacts: Contact[];
  social: { whatsappShareText: string };
  rsvpDeadline: string | null;
  rsvp: { minAttendees: number; maxAttendees: number; showConsent: boolean };
  privacy: { showContactNumbers: boolean; hideFullAddresses: boolean };
  theme: {
    showPetals: boolean;
    enableMusic: boolean;
    enableParallax: boolean;
    musicPath: string;
    showWishes: boolean;
  };
}

const mainVenue = {
  name: "Silpanchal Bhawan",
  address: "Ward 5, Mahananda Para, Burdwan Road, Siliguri - 734005",
  mapUrl: "https://maps.app.goo.gl/ZJr6wL1YVcsWAd7d8",
};

const wedding: WeddingConfig = {
  seo: {
    title: "Sakshi & Vivek | Wedding Invitation",
    description: "Join Sakshi and Vivek as they celebrate love, family, and the beginning of their new journey.",
  },
  couple: {
    brideFirstName: "Sakshi",
    groomFirstName: "Vivek",
    displayName: "Sakshi & Vivek",
    hashtag: "#ViSaApproved",
    heroImage: "/images/Hero.png",
    portraitImage: "/images/story/Couple.jpeg",
    bridePortraitImage: "/images/story/Bride.jpeg",
    groomPortraitImage: "/images/story/Groom.jpeg",
    shortIntroduction: "Two hearts, one beautiful beginning.",
    brideIntroduction: "Warm, graceful, and full of joy, she brings love and light into every room. Bothra family welcomes her with open arms.",
    groomIntroduction: "With kindness in his heart and sincerity in all he does, he is lovingly welcomed and deeply cherished by the Mishra family.",
    closingLine: "Your presence, love, and blessings will make our celebration complete.",
    locationLabel: "Siliguri",
  },
  weddingDate: "2026-11-21T00:00:00+05:30",
  assets: { logo: "/images/logo.png" },
  invitation: {
    eyebrow: "Together with our families",
    heading: "We joyfully invite you",
    message:
      "Together with our families, we invite you to share in the joy of our wedding celebrations. Your presence, blessings, and love will make the beginning of our new journey truly special.",
  },
  families: {
    brideFamilyLabel: "Bride’s Family",
    brideFamilyNames: "Santosh Mishra & Suroo Mishra",
    groomFamilyLabel: "Groom’s Family",
    groomFamilyNames: "Sushila Bothra & Lt. Ranjeet Kumar Bothra",
  },
  events: ([
    {
      id: "mehendi",
      name: "Mehendi",
      shortTitle: "Mehendi",
      date: "2026-11-20T00:00:00+05:30",
      startTime: "11:00:00",
      endTime: null,
      venueName: null,
      address: null,
      mapUrl: null,
      description:
        "Intricate henna, festive laughter, and a little bit of love hidden in every design. Come celebrate as the colours of tradition begin to bloom.",
      dressCode: null,
      icon: "❦",
      image: null,
      accentColor: "emerald",
      enabled: true,
      showInRSVP: true,
      calendarStart: null,
      calendarEnd: null,
    },
    {
      id: "sangeet",
      name: "Sangeet Night",
      shortTitle: "Sangeet",
      date: "2026-11-20T00:00:00+05:30",
      startTime: "19:00:00",
      endTime: null,
      venueName: null,
      address: null,
      mapUrl: null,
      description:
        "An evening of rhythm, revelry, and enthusiastic dance moves. Come cheer, sing, and celebrate as the two families take over the dance floor.",
      dressCode: null,
      icon: "♫",
      image: null,
      accentColor: "plum",
      enabled: true,
      showInRSVP: true,
      calendarStart: null,
      calendarEnd: null,
    },
    {
      id: "mayera",
      name: "Mayera",
      shortTitle: "Mayera",
      date: "2026-11-21T00:00:00+05:30",
      startTime: "11:00:00",
      endTime: null,
      venueName: null,
      address: null,
      mapUrl: null,
      description:
        "A celebration wrapped in family love, cheerful traditions, heartfelt blessings, and just the right amount of joyful chaos.",
      dressCode: null,
      icon: "✿",
      image: null,
      accentColor: "rose",
      enabled: true,
      showInRSVP: true,
      calendarStart: null,
      calendarEnd: null,
    },
    {
      id: "haldi",
      name: "Haldi",
      shortTitle: "Haldi",
      date: "2026-11-21T00:00:00+05:30",
      startTime: "14:00:00",
      endTime: null,
      venueName: null,
      address: null,
      mapUrl: null,
      description:
        "Sunshine, laughter, and a generous splash of haldi. Wear your brightest smile and be ready for the glow-up before the big day.",
      dressCode: null,
      icon: "☼",
      image: null,
      accentColor: "saffron",
      enabled: true,
      showInRSVP: true,
      calendarStart: null,
      calendarEnd: null,
    },
    {
      id: "baraat",
      name: "Baraat",
      shortTitle: "Baraat",
      date: "2026-11-21T00:00:00+05:30",
      startTime: "18:00:00",
      endTime: null,
      venueName: null,
      address: null,
      mapUrl: null,
      description:
        "The music gets louder, the dancing gets bolder, and the celebration makes its grand entrance. Join the baraat and bring your best moves.",
      dressCode: null,
      icon: "❋",
      image: null,
      accentColor: "vermilion",
      enabled: true,
      showInRSVP: true,
      calendarStart: null,
      calendarEnd: null,
    },
    {
      id: "wedding",
      name: "Wedding & Seven Pheras",
      shortTitle: "The Wedding",
      date: "2026-11-21T00:00:00+05:30",
      startTime: "21:00:00",
      endTime: null,
      venueName: null,
      address: null,
      mapUrl: null,
      description:
        "Amid sacred vows, loving families, and seven meaningful pheras, Sakshi and Vivek begin their forever. Your blessings will make the moment complete.",
      dressCode: null,
      icon: "❀",
      image: null,
      accentColor: "gold",
      enabled: true,
      showInRSVP: true,
      calendarStart: null,
      calendarEnd: null,
    },
    {
      id: "reception",
      name: "Reception",
      shortTitle: "Reception",
      date: null,
      startTime: null,
      endTime: null,
      venueName: null,
      address: null,
      mapUrl: null,
      description: "An evening to gather, celebrate, and make a few more memories together.",
      dressCode: null,
      icon: "✧",
      image: null,
      accentColor: "champagne",
      enabled: false,
      showInRSVP: true,
      calendarStart: null,
      calendarEnd: null,
    },
  ]).map((event) => (event.enabled ? { ...event, venueName: mainVenue.name, address: mainVenue.address, mapUrl: mainVenue.mapUrl } : event)),
  story: [
    { title: "First Meeting", dateLabel: "[Add date or season]", description: "[Add a short memory from your first meeting.]", image: "/images/story/OurStory1.jpeg", alignment: "left", enabled: true },
    { title: "Friendship", dateLabel: "[Add date or season]", description: "[Share a favorite moment from your friendship.]", image: "/images/story/OurStory2.jpeg", alignment: "right", enabled: true },
    { title: "The Moment We Knew", dateLabel: "[Add date or season]", description: "[Describe the moment you knew you wanted a future together.]", image: "/images/story/OurStory3.jpeg", alignment: "left", enabled: true },
    { title: "The Proposal", dateLabel: "[Add date or season]", description: "[Add a few words about the proposal.]", image: null, alignment: "right", enabled: false },
    { title: "Seven Pheras", dateLabel: "[Add date or season]", description: "[Add a note about the beginning of your married life.]", image: null, alignment: "left", enabled: false },
  ],
  gallery: [
    { src: "/images/gallery/OurGallery1.jpeg", alt: "A warm, sunlit moment together", category: "Moments", color: "blush" },
    { src: "/images/gallery/OurGallery2.jpeg", alt: "A celebration in soft evening light", category: "Celebrations", color: "sage" },
    { src: "/images/gallery/OurGallery3.jpeg", alt: "A quiet moment shared together", category: "Moments", color: "ochre" },
    { src: "/images/gallery/OurGallery4.jpeg", alt: "A joyful memory with family", category: "Celebrations", color: "rose" },
    { src: "/images/gallery/OurGallery5.jpeg", alt: "A glimpse of the journey so far", category: "Moments", color: "plum" },
    { src: "/images/gallery/OurGallery6.jpeg", alt: "A little joy, saved for always", category: "Celebrations", color: "cream" },
  ],
  venues: [
    {
      eventIds: ["mehendi", "sangeet", "mayera", "haldi", "baraat", "wedding"],
      name: mainVenue.name,
      address: mainVenue.address,
      landmark: null,
      mapUrl: mainVenue.mapUrl,
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7128.418427587506!2d88.4160469!3d26.7057625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e44144aa389719%3A0x71b51356be4a02c7!2sSilpanchal%20Bhawan!5e0!3m2!1sen!2sin!4v1791887837995!5m2!1sen!2sin",
      contactName: null,
      contactNumber: null,
      parkingNote: null,
      accessibilityNote: null,
    },
  ],
  contacts: [],
  social: {
    whatsappShareText:
      "We would love for you to join us as Sakshi and Vivek celebrate the beginning of their new journey.",
  },
  rsvpDeadline: null,
  rsvp: { minAttendees: 1, maxAttendees: 10, showConsent: false },
  privacy: { showContactNumbers: false, hideFullAddresses: false },
  theme: {
    showPetals: true,
    enableMusic: true,
    enableParallax: true,
    musicPath: "/audio/wedding-theme-placeholder.mp3",
    showWishes: true,
  },
};

export default wedding;
