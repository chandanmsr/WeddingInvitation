"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { z } from "zod";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  MapPin,
  Maximize2,
  Menu,
  Music2,
  Pause,
  Printer,
  Share2,
  Volume2,
  X,
} from "lucide-react";
import wedding, {
  type RSVPSubmission,
  type WeddingEvent,
} from "@/data/wedding";
import { localRSVPService } from "@/lib/rsvp-service";

const navigation = [
  ["Home", "home"],
  ["Celebrations", "celebrations"],
  ["Our Story", "story"],
  ["Gallery", "gallery"],
  ["Venue", "venue"],
  ["RSVP", "rsvp"],
] as const;

const petalGlyphs = ["✿", "❀", "✾", "❁", "✽", "❋"];
const petalColors = ["234, 190, 190", "216, 184, 106", "245, 214, 204", "205, 140, 150", "255, 240, 214"];
// Deterministic values keep server and client markup identical.
const petals = Array.from({ length: 44 }, (_, i) => ({
  left: (i * 37 + (i % 5) * 7) % 100,
  size: [10, 14, 20, 28, 36, 16, 24, 12][i % 8],
  duration: 14 + ((i * 7) % 13),
  delay: -((i * 5.3) % 24),
  drift: ((i % 7) - 3) * 22,
  spin: 180 + (i % 5) * 90,
  glyph: petalGlyphs[i % petalGlyphs.length],
  color: petalColors[(i * 3) % petalColors.length],
  opacity: 0.32 + (i % 4) * 0.12,
}));

const confettiColors = ["#d8b86a", "#f6e3a1", "#c04a62", "#f2a7b4", "#fff5e4", "#7fb69a", "#e8843c"];

function PartyPoppers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();

    type Piece = { x: number; y: number; vx: number; vy: number; size: number; rot: number; vr: number; color: string; shape: number; life: number; tilt: number };
    const pieces: Piece[] = [];
    const burst = (side: 1 | -1, count: number) => {
      const speedBase = Math.min(Math.max(height, 520) * 0.034, 30);
      for (let i = 0; i < count; i++) {
        // Aim up and towards the centre from each bottom corner.
        const angle = (Math.PI / 180) * (side === 1 ? 292 + Math.random() * 52 : 248 - Math.random() * 52);
        const speed = speedBase * (0.45 + Math.random() * 0.75);
        pieces.push({
          x: side === 1 ? 6 : width - 6,
          y: height - 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 6 + Math.random() * 8,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.4,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          shape: Math.floor(Math.random() * 3),
          life: 0,
          tilt: Math.random() * Math.PI * 2,
        });
      }
    };

    const timers = [0, 380, 760].flatMap((delay, index) => [
      window.setTimeout(() => burst(1, 70 - index * 10), delay),
      window.setTimeout(() => burst(-1, 70 - index * 10), delay),
    ]);

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.42;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.tilt += 0.18;
        p.life += 1;
        if (p.y > height + 30 || p.life > 260) { pieces.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.min(1, (260 - p.life) / 60);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 0) ctx.fillRect(-p.size / 2, (-p.size / 4) * Math.abs(Math.cos(p.tilt)), p.size, (p.size / 2) * Math.abs(Math.cos(p.tilt)) + 1);
        else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2); ctx.fill(); }
        else {
          ctx.beginPath();
          for (let k = 0; k < 10; k++) {
            const r = k % 2 === 0 ? p.size / 2 : p.size / 5;
            const a = (Math.PI / 5) * k;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      timers.forEach(window.clearTimeout);
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="popper-canvas" aria-hidden="true" />;
}

const attendanceLabels = {
  attending: "Joyfully attending",
  maybe: "Still confirming",
  declining: "Regretfully unable to attend",
} as const;

const guestSchema = z.object({
  guestName: z.string().trim().min(2, "Please enter your name.").max(80, "Please keep your name under 80 characters."),
  phone: z.string().trim().min(7, "Please enter a valid phone number.").max(25, "Please enter a valid phone number.").regex(/^[+\d()[\].\-\s]+$/, "Please enter a valid phone number.").refine((value) => {
    const digits = value.replace(/\D/g, "").length;
    return digits >= 7 && digits <= 15;
  }, "Please enter a valid phone number."),
  email: z.union([z.literal(""), z.string().trim().email("Please enter a valid email address.")]).optional(),
  attendeeCount: z.number().int().min(wedding.rsvp.minAttendees).max(wedding.rsvp.maxAttendees),
  attendance: z.enum(["attending", "maybe", "declining"], { required_error: "Please choose your response." }),
  events: z.array(z.string()),
  dietaryPreference: z.string(),
  accommodation: z.boolean(),
  transportation: z.boolean(),
  message: z.string().max(500, "Please keep your message under 500 characters."),
  consent: z.boolean(),
}).superRefine((value, context) => {
  if (value.attendance === "attending" && value.events.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["events"], message: "Please select at least one celebration." });
  }
  if (wedding.rsvp.showConsent && !value.consent) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["consent"], message: "Please confirm before submitting." });
  }
});

type GuestFormValues = z.infer<typeof guestSchema>;
type Wish = { name: string; message: string };

const seedWishes: Wish[] = [
  { name: "With love", message: "Wishing you a lifetime filled with laughter, kindness, and beautiful little moments." },
  { name: "A well-wisher", message: "May your new journey together be surrounded by love and endless happiness." },
];

function formatDate(date: string | null) {
  if (!date || Number.isNaN(Date.parse(date))) return "Date to be announced";
  const parts = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (!parts) return "Date to be announced";
  const stableDate = new Date(Date.UTC(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]), 12));
  return new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(stableDate);
}

function formatTime(time: string | null) {
  if (!time) return null;
  const parsed = new Date(`2000-01-01T${time}`);
  return Number.isNaN(parsed.getTime()) ? time : new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(parsed);
}

function safeHttpUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function safeMapEmbedUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !["www.google.com", "maps.google.com"].includes(url.hostname) || !url.pathname.startsWith("/maps")) return null;
    return url.href;
  } catch {
    return null;
  }
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: reduced ? 0 : 0.65, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AssetImage({ src, alt, className, fill, sizes, width, height, priority }: { src: string; alt: string; className?: string; fill?: boolean; sizes?: string; width?: number; height?: number; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  // Images that failed before hydration never fire React's onError, so check the element once mounted.
  const check = (node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth === 0) setFailed(true);
  };
  if (failed) return null;
  return fill
    ? <Image ref={check} src={src} alt={alt} className={className} fill sizes={sizes} priority={priority} onError={() => setFailed(true)} />
    : <Image ref={check} src={src} alt={alt} className={className} width={width} height={height} priority={priority} onError={() => setFailed(true)} />;
}

function Logo({ className = "", size = 48 }: { className?: string; size?: number }) {
  return <AssetImage src={wedding.assets.logo} alt="" className={`logo-mark ${className}`} width={size} height={size} />;
}

function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className={`section-heading ${light ? "section-heading-light" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <span className="ornament" aria-hidden="true"><i />✦<i /></span>
    </div>
  );
}

function EventCalendarActions({ event }: { event: WeddingEvent }) {
  const start = event.calendarStart ? Date.parse(event.calendarStart) : Number.NaN;
  const end = event.calendarEnd ? Date.parse(event.calendarEnd) : Number.NaN;
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
  const address = wedding.privacy.hideFullAddresses ? null : event.address;
  const details = [event.venueName, address, event.description].filter(Boolean).join("\n");
  const google = new URL("https://calendar.google.com/calendar/render");
  google.searchParams.set("action", "TEMPLATE");
  google.searchParams.set("text", event.name);
  google.searchParams.set("dates", `${new Date(start).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}/${new Date(end).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`);
  if (event.venueName || address) google.searchParams.set("location", [event.venueName, address].filter(Boolean).join(", "));
  google.searchParams.set("details", details);

  function downloadICS() {
    const stamp = (date: number) => new Date(date).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const escapeICS = (value: string) => value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    const body = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN", "BEGIN:VEVENT",
      `UID:${event.id}-${start}@wedding-invitation`,
      `DTSTAMP:${stamp(Date.now())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
      `SUMMARY:${escapeICS(event.name)}`, `DESCRIPTION:${escapeICS(details)}`,
      ...(event.venueName || address ? [`LOCATION:${escapeICS([event.venueName, address].filter(Boolean).join(", "))}`] : []),
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
    link.download = `${event.id}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="calendar-actions">
      <button className="text-action" type="button" onClick={downloadICS}><CalendarDays size={15} /> Add to calendar</button>
      <a className="text-action" href={google.href} target="_blank" rel="noreferrer"><ArrowRight size={15} /> Google Calendar</a>
    </div>
  );
}

export default function WeddingInvitation() {
  const [coverOpen, setCoverOpen] = useState(true);
  const [doorsOpening, setDoorsOpening] = useState(false);
  const [poppersActive, setPoppersActive] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicUnavailable, setMusicUnavailable] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [rsvpSaved, setRsvpSaved] = useState<RSVPSubmission | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [rsvpBusy, setRsvpBusy] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>(seedWishes);
  const [wishStatus, setWishStatus] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const wishFormRef = useRef<HTMLFormElement>(null);
  const openInvitationRef = useRef<HTMLButtonElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const sceneOffset = useTransform(scrollY, [0, 800], [0, 55]);

  const enabledEvents = useMemo(() => wedding.events.filter((event) => event.enabled), []);
  const gallery = wedding.gallery;
  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      guestName: "",
      phone: "",
      email: "",
      attendeeCount: wedding.rsvp.minAttendees,
      attendance: undefined,
      events: [],
      dietaryPreference: "",
      accommodation: false,
      transportation: false,
      message: "",
      consent: false,
    },
  });

  useEffect(() => {
    try {
      setCoverOpen(sessionStorage.getItem("sakshi-vivek-invitation-opened") !== "true");
      const storedWishes = localStorage.getItem("sakshi-vivek-wishes-demo");
      if (storedWishes) setWishes(JSON.parse(storedWishes) as Wish[]);
    } catch {
      setCoverOpen(true);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.25, 0.5] });
    navigation.forEach(([, id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!wedding.weddingDate || Number.isNaN(Date.parse(wedding.weddingDate))) return;
    const update = () => setCountdown(Math.max(0, Date.parse(wedding.weddingDate!) - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const track = galleryTrackRef.current;
    if (!track) return;
    const update = () => {
      setCanScrollPrev(track.scrollLeft > 4);
      setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scrollGallery(direction: 1 | -1) {
    const track = galleryTrackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: reducedMotion ? "auto" : "smooth" });
  }

  useEffect(() => {
    if (lightboxIndex === null) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lightboxCloseRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") setLightboxIndex((index) => index === null ? 0 : (index + 1) % gallery.length);
      if (event.key === "ArrowLeft") setLightboxIndex((index) => index === null ? 0 : (index - 1 + gallery.length) % gallery.length);
      if (event.key === "Tab") {
        const controls = document.querySelectorAll<HTMLElement>(".lightbox button");
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [lightboxIndex, gallery.length]);

  useEffect(() => {
    if (!coverOpen) {
      heroTitleRef.current?.focus();
      return;
    }
    openInvitationRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        openInvitationRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [coverOpen]);

  const openInvitation = () => {
    if (doorsOpening) return;
    try { sessionStorage.setItem("sakshi-vivek-invitation-opened", "true"); } catch { /* Session storage can be disabled. */ }
    setDoorsOpening(true);
    if (!reducedMotion) {
      window.setTimeout(() => setPoppersActive(true), 500);
      window.setTimeout(() => setPoppersActive(false), 6500);
    }
    window.setTimeout(() => setCoverOpen(false), reducedMotion ? 0 : 1900);
    try {
      if (localStorage.getItem("sakshi-vivek-music-opt-in") === "true") void toggleMusic();
    } catch { /* Music remains optional when storage is disabled. */ }
  };

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio || !wedding.theme.enableMusic) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
      try { localStorage.setItem("sakshi-vivek-music-opt-in", "false"); } catch { /* Preference storage is optional. */ }
      return;
    }
    try {
      await audio.play();
      setMusicPlaying(true);
      setMusicUnavailable(false);
      try { localStorage.setItem("sakshi-vivek-music-opt-in", "true"); } catch { /* Preference storage is optional. */ }
    } catch {
      setMusicUnavailable(true);
      setMusicPlaying(false);
    }
  }

  async function submitRSVP(values: GuestFormValues) {
    setRsvpBusy(true);
    setRsvpStatus("");
    try {
      const submission: RSVPSubmission = { ...values, email: values.email || undefined };
      await localRSVPService.save(submission);
      setRsvpSaved(submission);
      setRsvpStatus("Thank you. Your response has been saved in this browser.");
      form.reset();
    } catch {
      setRsvpStatus("We couldn’t save your response in this browser. Your entries are still here—please try again.");
    } finally {
      setRsvpBusy(false);
    }
  }

  function editRSVP() {
    if (!rsvpSaved) return;
    form.reset({ ...rsvpSaved, email: rsvpSaved.email ?? "" });
    setRsvpSaved(null);
    setRsvpStatus("");
  }

  function submitWish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = wishFormRef.current;
    if (!formElement) return;
    const data = new FormData(formElement);
    const name = String(data.get("wish-name") ?? "").trim();
    const message = String(data.get("wish-message") ?? "").trim();
    if (name.length < 2 || message.length < 3 || message.length > 240) {
      setWishStatus("Please add your name and a message of up to 240 characters.");
      return;
    }
    // Demo wishes are local-only; production moderation must happen on a backend.
    const updated = [{ name, message }, ...wishes];
    setWishes(updated);
    setWishStatus("Your wish has been added on this device.");
    formElement.reset();
    try { localStorage.setItem("sakshi-vivek-wishes-demo", JSON.stringify(updated)); } catch {
      setWishStatus("Your wish is visible for now, but could not be saved on this device.");
    }
  }

  async function shareInvitation() {
    const url = window.location.href;
    const text = wedding.social.whatsappShareText;
    try {
      if (navigator.share) await navigator.share({ title: `${wedding.couple.displayName} | Wedding Invitation`, text, url });
      else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setShareStatus("Invitation link copied.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setShareStatus("Sharing is unavailable here. You can copy the page address from your browser.");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("Invitation link copied.");
    } catch {
      setShareStatus("Copy is unavailable here. You can copy the page address from your browser.");
    }
  }

  function saveWeddingDate() {
    if (!wedding.weddingDate || Number.isNaN(Date.parse(wedding.weddingDate))) return;
    const dateParts = /^(\d{4})-(\d{2})-(\d{2})/.exec(wedding.weddingDate);
    if (!dateParts) return;
    const start = new Date(Date.UTC(Number(dateParts[1]), Number(dateParts[2]) - 1, Number(dateParts[3])));
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    const toICSDate = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, "");
    const escapeICS = (value: string) => value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    const body = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN", "BEGIN:VEVENT",
      `UID:wedding-${toICSDate(start)}@wedding-invitation`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
      `DTSTART;VALUE=DATE:${toICSDate(start)}`, `DTEND;VALUE=DATE:${toICSDate(end)}`,
      `SUMMARY:${escapeICS(`${wedding.couple.displayName} — Wedding`)}`,
      `DESCRIPTION:${escapeICS(wedding.social.whatsappShareText)}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const objectUrl = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "wedding.ics";
    link.click();
    URL.revokeObjectURL(objectUrl);
  }

  const dateLabel = wedding.weddingDate ? formatDate(wedding.weddingDate) : "Wedding date to be announced";
  const countdownParts = countdown !== null && countdown > 0 ? {
    days: Math.floor(countdown / 86_400_000),
    hours: Math.floor((countdown / 3_600_000) % 24),
    minutes: Math.floor((countdown / 60_000) % 60),
    seconds: Math.floor((countdown / 1_000) % 60),
  } : null;

  return (
    <>
      <a className="skip-link" href="#main">Skip to invitation</a>
      {wedding.theme.showPetals && (
        <div className="petal-overlay" aria-hidden="true">
          {petals.map((petal, index) => (
            <span
              key={index}
              style={{
                left: `${petal.left}%`,
                fontSize: `${petal.size}px`,
                color: `rgba(${petal.color}, ${petal.opacity})`,
                animationDuration: `${petal.duration}s`,
                animationDelay: `${petal.delay}s`,
                ["--drift" as string]: `${petal.drift}px`,
                ["--spin" as string]: `${petal.spin}deg`,
              }}
            >{petal.glyph}</span>
          ))}
        </div>
      )}
      {wedding.theme.enableMusic && (
        <>
          <audio ref={audioRef} src={wedding.theme.musicPath} loop preload="none" onError={() => setMusicUnavailable(true)} />
          {!coverOpen && (
            <button
              className={`music-control ${musicPlaying ? "is-playing" : ""}`}
              type="button"
              onClick={() => void toggleMusic()}
              aria-label={musicPlaying ? "Pause background music" : "Play background music"}
              title={musicUnavailable ? "Add a licensed audio file to enable music" : musicPlaying ? "Pause music" : "Play music"}
            >
              {musicPlaying ? <Pause size={17} /> : musicUnavailable ? <Volume2 size={17} /> : <Music2 size={17} />}
              <span className="sr-only">{musicPlaying ? "Music playing" : musicUnavailable ? "Music unavailable" : "Music paused"}</span>
              {musicPlaying && <span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>}
            </button>
          )}
        </>
      )}

      <header className={`site-header ${scrolled || coverOpen ? "header-solid" : ""}`}>
        <a className="brand" href="#home" onClick={() => setIsNavOpen(false)} aria-label={`${wedding.couple.displayName} home`}>
          <Logo className="brand-logo" size={44} />
          <span className="brand-name">{wedding.couple.displayName}</span>
        </a>
        <button className="mobile-menu-toggle" type="button" aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isNavOpen} onClick={() => setIsNavOpen(!isNavOpen)}>
          {isNavOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav ${isNavOpen ? "nav-open" : ""}`} aria-label="Main navigation">
          {navigation.map(([label, id]) => (
            <a key={id} className={activeSection === id ? "nav-active" : ""} href={`#${id}`} onClick={() => setIsNavOpen(false)}>{label}</a>
          ))}
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          {wedding.couple.heroImage && <AssetImage className="hero-photo" src={wedding.couple.heroImage} alt="" fill priority sizes="100vw" />}
          <motion.div className="hero-scene" style={{ y: wedding.theme.enableParallax && !reducedMotion ? sceneOffset : 0 }} aria-hidden="true">
            <div className="sun-disc" />
            <div className="arch arch-back" />
            <div className="arch arch-front" />
            <div className="garden-hill hill-left" />
            <div className="garden-hill hill-right" />
            <span className="hero-flower flower-a">✿</span>
            <span className="hero-flower flower-b">✽</span>
            <span className="hero-flower flower-c">✿</span>
            <span className="hero-leaf leaf-a">❧</span>
            <span className="hero-leaf leaf-b">❧</span>
          </motion.div>
          <div className="hero-shade" />
          <div className="hero-copy">
            <Logo className="hero-logo" size={96} />
            <span className="eyebrow hero-eyebrow">{wedding.invitation.eyebrow}</span>
            <span className="hero-rule" aria-hidden="true"><i />✦<i /></span>
            <motion.h1 ref={heroTitleRef} tabIndex={-1} id="hero-title" initial={reducedMotion ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 1 }}>
              {wedding.couple.brideFirstName}<span className="ampersand"> &amp; </span>{wedding.couple.groomFirstName}
            </motion.h1>
            <p className="hero-tagline">{wedding.couple.shortIntroduction}</p>
            <p className="hero-date">{dateLabel}<span>{wedding.couple.locationLabel}</span></p>
            <div className="hero-buttons">
              {wedding.weddingDate && <button className="button button-outline-light" type="button" onClick={saveWeddingDate}><CalendarDays size={16} /> Save the date</button>}
              <a className="button button-light" href="#celebrations"><CalendarDays size={16} /> View celebrations</a>
              <a className="button button-outline-light" href="#rsvp">Kindly reply</a>
            </div>
          </div>
          <a className="scroll-cue" href="#invitation" aria-label="Scroll to invitation message"><span>Scroll to discover</span><ArrowDown size={17} /></a>
          <div className="hero-frame" aria-hidden="true" />
        </section>

        <section className="invitation section-pad" id="invitation">
          <Reveal className="invitation-inner">
            <span className="eyebrow">{wedding.invitation.eyebrow}</span>
            <h2>{wedding.invitation.heading}</h2>
            <span className="lotus-mark" aria-hidden="true">❋</span>
            <p className="invitation-message">{wedding.invitation.message}</p>
            <div className="family-grid">
              <div><span>{wedding.families.brideFamilyLabel}</span><strong>{wedding.families.brideFamilyNames}</strong></div>
              <span className="family-divider" aria-hidden="true">✦</span>
              <div><span>{wedding.families.groomFamilyLabel}</span><strong>{wedding.families.groomFamilyNames}</strong></div>
            </div>
          </Reveal>
        </section>

        <section className="couple section-pad" aria-labelledby="couple-title">
          <div className="couple-layout">
            <Reveal className="couple-art">
              <div className="portrait-frame">
                {wedding.couple.portraitImage && <AssetImage src={wedding.couple.portraitImage} alt={`Portrait of ${wedding.couple.displayName}`} fill sizes="(max-width: 760px) 90vw, 440px" className="portrait-image" />}
                <div className="portrait-sun" />
                <div className="portrait-arch" />
                <div className="portrait-shade" aria-hidden="true" />
                <Logo className="portrait-logo" size={72} />
                <span className="portrait-caption">A story written together</span>
              </div>
              <span className="couple-stamp" aria-hidden="true">FOREVER<br />BEGINS</span>
            </Reveal>
            <Reveal className="couple-text">
              <span className="eyebrow">The two of us</span>
              <h2 id="couple-title">A little about<br /><em>our hearts</em></h2>
              <p>{wedding.couple.shortIntroduction}</p>
              <div className="bio-row">{wedding.couple.bridePortraitImage ? <Image className="bio-portrait" src={wedding.couple.bridePortraitImage} alt={`${wedding.couple.brideFirstName} portrait`} width={56} height={56} /> : <span className="bio-initial">{wedding.couple.brideFirstName[0]}</span>}<div><h3>{wedding.couple.brideFirstName}</h3><p>{wedding.couple.brideIntroduction}</p></div></div>
              <div className="bio-row">{wedding.couple.groomPortraitImage ? <Image className="bio-portrait" src={wedding.couple.groomPortraitImage} alt={`${wedding.couple.groomFirstName} portrait`} width={56} height={56} /> : <span className="bio-initial">{wedding.couple.groomFirstName[0]}</span>}<div><h3>{wedding.couple.groomFirstName}</h3><p>{wedding.couple.groomIntroduction}</p></div></div>
              <p className="couple-closing">Together, we can’t wait to begin our next chapter.</p>
            </Reveal>
          </div>
        </section>

        <section className="countdown section-pad">
          <div className="countdown-glow" aria-hidden="true" />
          <Reveal>
            <span className="eyebrow">The beginning of forever</span>
            <h2>Counting the moments</h2>
            {countdown === null ? (
              <p className="countdown-placeholder">The date will be shared soon</p>
            ) : countdownParts ? (
              <div className="countdown-grid" aria-label="Time remaining until the wedding">
                {Object.entries(countdownParts).map(([unit, value]) => (
                  <div className="countdown-unit" key={unit}><strong>{String(value).padStart(2, "0")}</strong><span>{unit}</span></div>
                ))}
              </div>
            ) : <p className="countdown-placeholder">The celebration has begun</p>}
            {wedding.weddingDate && <p className="countdown-date">{formatDate(wedding.weddingDate)}</p>}
          </Reveal>
        </section>

        <section className="events section-pad" id="celebrations">
          <div className="section-wrap">
            <SectionHeading eyebrow="A gathering of hearts" title="Wedding Celebrations" />
            <div className="event-grid">
              {enabledEvents.map((event, index) => (
                <Reveal key={event.id} className={`event-card event-${event.accentColor}`}>
                  <span className="event-number">0{index + 1}</span>
                  {event.image && <Image className="event-card-image" src={event.image} alt="" width={84} height={84} />}
                  <span className="event-symbol" aria-hidden="true">{event.icon}</span>
                  <span className="event-kicker">The celebration</span>
                  <h3>{event.name}</h3>
                  <p className="event-date"><CalendarDays size={15} />{formatDate(event.date)}</p>
                  {event.startTime && <p className="event-detail"><Clock3 size={15} />{formatTime(event.startTime)}{event.endTime ? ` – ${formatTime(event.endTime)}` : ""}</p>}
                  {event.venueName && <p className="event-detail"><MapPin size={15} />{event.venueName}</p>}
                  <p className="event-description">{event.description}</p>
                  {event.dressCode && <p className="dress-code"><span>Dress with</span>{event.dressCode}</p>}
                  <div className="event-actions">
                    {!wedding.privacy.hideFullAddresses && safeHttpUrl(event.mapUrl) && <a className="text-action" href={safeHttpUrl(event.mapUrl)!} target="_blank" rel="noreferrer"><MapPin size={15} /> View map</a>}
                    <EventCalendarActions event={event} />
                    {event.showInRSVP && <a className="text-action" href="#rsvp"><ArrowRight size={15} /> RSVP for this event</a>}
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="setup-note">Event dates and times will be added here once confirmed.</p>
          </div>
        </section>

        <section className="story section-pad" id="story">
          <div className="section-wrap">
            <SectionHeading eyebrow="A journey, made sweeter together" title="Our Story" />
            <ol className="story-timeline">
              {wedding.story.filter((entry) => entry.enabled).map((entry, index) => (
                <motion.li
                  key={entry.title}
                  className={`story-item ${index % 2 === 0 ? "story-left" : "story-right"}`}
                  initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.14 }}
                  transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <article className="story-card">
                    <span className="story-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <span className="eyebrow">{entry.dateLabel}</span>
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                  </article>
                  <div className="story-media">
                    {entry.image && <AssetImage className="story-image" src={entry.image} alt={`${entry.title} memory`} fill sizes="(max-width: 760px) 92vw, 460px" />}
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section className="gallery-section section-pad" id="gallery">
          <div className="section-wrap">
            <SectionHeading eyebrow="Little moments, held close" title="A Gallery of Us" />
            <div className="gallery-carousel">
              <button className="carousel-arrow carousel-prev" type="button" aria-label="Previous photographs" onClick={() => scrollGallery(-1)} disabled={!canScrollPrev}><ArrowLeft size={20} /></button>
              <motion.div
                className="gallery-track"
                ref={galleryTrackRef}
                role="region"
                aria-roledescription="carousel"
                aria-label="Photo gallery. Swipe or use the arrows to browse."
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: reducedMotion ? 0 : 0.09 } } }}
              >
                {gallery.map((image, index) => (
                  <motion.div
                    className="gallery-slide"
                    key={`${image.alt}-${index}`}
                    variants={{ hidden: { opacity: 0, x: reducedMotion ? 0 : 48, scale: reducedMotion ? 1 : 0.96 }, show: { opacity: 1, x: 0, scale: 1, transition: { duration: reducedMotion ? 0 : 0.6, ease: [0.2, 0.7, 0.2, 1] } } }}
                  >
                    <button className={`gallery-tile gallery-${image.color}`} type="button" onClick={() => setLightboxIndex(index)} aria-label={`Open photograph ${index + 1} of ${gallery.length}: ${image.alt}`}>
                      {image.src ? <AssetImage src={image.src} alt="" fill sizes="(max-width: 760px) 72vw, 320px" className="gallery-photo" /> : <span className="gallery-art" aria-hidden="true"><span>✿</span><i /><b /></span>}
                      <span className="gallery-index">0{index + 1}</span>
                      <span className="gallery-preview" aria-hidden="true">
                        <span className="gallery-category">{image.category}</span>
                        <span className="gallery-label">{image.src ? image.alt : "A photograph will bloom here"}</span>
                        <span className="gallery-view"><Maximize2 size={14} /> View</span>
                      </span>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
              <button className="carousel-arrow carousel-next" type="button" aria-label="Next photographs" onClick={() => scrollGallery(1)} disabled={!canScrollNext}><ArrowRight size={20} /></button>
            </div>
            <p className="gallery-caption">Our favorite memories, with a few more to come.</p>
          </div>
        </section>

        <section className="venue section-pad" id="venue">
          <div className="venue-ornament" aria-hidden="true">✦</div>
          <div className="section-wrap">
            <SectionHeading eyebrow="We’ll save you a place" title="Find Your Way" />
            {wedding.venues.length > 0 ? (
              <div className="venue-grid">
                {wedding.venues.map((venue, index) => (
                  <article className="venue-card" key={`${venue.name}-${index}`}>
                    <span className="eyebrow">{venue.eventIds.map((id) => wedding.events.find((event) => event.id === id)?.shortTitle).filter(Boolean).join(" · ")}</span>
                    <h3>{venue.name ?? "Venue details to follow"}</h3>
                    {venue.address && <p>{wedding.privacy.hideFullAddresses ? "Full address will be shared closer to the celebration." : venue.address}</p>}
                    {venue.landmark && <p className="venue-landmark">{venue.landmark}</p>}
                    {venue.parkingNote && <p className="venue-note"><strong>Parking</strong>{venue.parkingNote}</p>}
                    {venue.accessibilityNote && <p className="venue-note"><strong>Accessibility</strong>{venue.accessibilityNote}</p>}
                    <div className="venue-actions">
                      {!wedding.privacy.hideFullAddresses && safeHttpUrl(venue.mapUrl) && <a className="button button-primary" href={safeHttpUrl(venue.mapUrl)!} target="_blank" rel="noreferrer"><MapPin size={16} /> Open in Maps</a>}
                      {wedding.privacy.showContactNumbers && venue.contactNumber && <a className="text-action" href={`tel:${venue.contactNumber}`}><Volume2 size={15} />{venue.contactName ?? "Call venue"}</a>}
                    </div>
                    {!wedding.privacy.hideFullAddresses && safeMapEmbedUrl(venue.mapEmbedUrl) && <iframe className="venue-map" src={safeMapEmbedUrl(venue.mapEmbedUrl)!} title={`Map for ${venue.name ?? "wedding venue"}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
                  </article>
                ))}
              </div>
            ) : (
              <div className="venue-placeholder">
                <span className="venue-pin" aria-hidden="true"><MapPin size={23} /></span>
                <h3>A beautiful place awaits</h3>
                <p>Venue and travel details will be shared as soon as they are confirmed.</p>
                <span className="venue-placeholder-line">Location details to follow</span>
              </div>
            )}
            {wedding.privacy.showContactNumbers && wedding.contacts.length > 0 && (
              <div className="venue-contacts">{wedding.contacts.map((contact) => <p key={`${contact.label}-${contact.number}`}><span>{contact.label}</span><a href={`tel:${contact.number}`}>{contact.name} · {contact.number}</a></p>)}</div>
            )}
          </div>
        </section>

        <section className="rsvp section-pad" id="rsvp">
          <div className="section-wrap">
            <SectionHeading eyebrow="Your presence means the world" title="Will You Join Us?" />
            <div className="rsvp-shell">
              {rsvpSaved ? (
                <div className="rsvp-success" aria-live="polite">
                  <Logo className="success-logo" size={72} />
                  <span className="success-mark"><Check size={25} /></span>
                  <span className="eyebrow">Response received</span>
                  <h3>Thank you, {rsvpSaved.guestName}.</h3>
                  <p>We’re grateful you took a moment to let us know. Your response is saved on this device.</p>
                  <div className="confirmation-summary">
                    <span><strong>Your reply</strong>{attendanceLabels[rsvpSaved.attendance]}</span>
                    <span><strong>Guests</strong>{rsvpSaved.attendeeCount}</span>
                    {rsvpSaved.events.length > 0 && <span><strong>Celebrations</strong>{rsvpSaved.events.map((id) => wedding.events.find((event) => event.id === id)?.shortTitle).filter(Boolean).join(", ")}</span>}
                  </div>
                  <div className="success-actions"><button className="button button-primary" type="button" onClick={() => window.print()}><Printer size={16} /> Print confirmation</button><button className="text-action" type="button" onClick={editRSVP}>Change my response</button></div>
                </div>
              ) : (
                <form className="rsvp-form" onSubmit={form.handleSubmit(submitRSVP)} noValidate>
                  <p className="form-intro">A little note will help us welcome you well. Kindly share your response below.</p>
                  {wedding.rsvpDeadline && <p className="rsvp-deadline">Kindly reply by {formatDate(wedding.rsvpDeadline)}.</p>}
                  <div className="form-grid">
                    <label className="field"><span>Your name <i>*</i></span><input autoComplete="name" {...form.register("guestName")} aria-invalid={Boolean(form.formState.errors.guestName)} aria-describedby="guestName-error" placeholder="Name as we know you" />{form.formState.errors.guestName && <small id="guestName-error" className="field-error">{form.formState.errors.guestName.message}</small>}</label>
                    <label className="field"><span>Phone number <i>*</i></span><input type="tel" autoComplete="tel" {...form.register("phone")} aria-invalid={Boolean(form.formState.errors.phone)} aria-describedby="phone-error" placeholder="Your preferred number" />{form.formState.errors.phone && <small id="phone-error" className="field-error">{form.formState.errors.phone.message}</small>}</label>
                    <label className="field"><span>Email address <small>(optional)</small></span><input type="email" autoComplete="email" {...form.register("email")} aria-invalid={Boolean(form.formState.errors.email)} aria-describedby="email-error" placeholder="you@example.com" />{form.formState.errors.email && <small id="email-error" className="field-error">{form.formState.errors.email.message}</small>}</label>
                    <label className="field"><span>Number of attendees <i>*</i></span><select {...form.register("attendeeCount", { valueAsNumber: true })} aria-label="Number of attendees" aria-invalid={Boolean(form.formState.errors.attendeeCount)} aria-describedby="attendeeCount-error">{Array.from({ length: wedding.rsvp.maxAttendees - wedding.rsvp.minAttendees + 1 }, (_, index) => wedding.rsvp.minAttendees + index).map((number) => <option value={number} key={number}>{number}</option>)}</select>{form.formState.errors.attendeeCount && <small id="attendeeCount-error" className="field-error">Choose between {wedding.rsvp.minAttendees} and {wedding.rsvp.maxAttendees} attendees.</small>}</label>
                  </div>
                  <fieldset className="choice-fieldset" aria-describedby="attendance-error">
                    <legend>Your response <i>*</i></legend>
                    <div className="radio-row">
                      {Object.entries(attendanceLabels).map(([value, label]) => <label className="choice-pill" key={value}><input type="radio" value={value} {...form.register("attendance")} /><span>{label}</span></label>)}
                    </div>
                    {form.formState.errors.attendance && <small id="attendance-error" className="field-error">{form.formState.errors.attendance.message}</small>}
                  </fieldset>
                  <fieldset className="choice-fieldset" aria-describedby="events-error">
                    <legend>Which celebrations will you join?</legend>
                    <div className="checkbox-row">
                      {enabledEvents.filter((event) => event.showInRSVP).map((event) => <label className="choice-check" key={event.id}><input type="checkbox" value={event.id} {...form.register("events")} /><span>{event.shortTitle}</span></label>)}
                    </div>
                    {form.formState.errors.events && <small id="events-error" className="field-error">{form.formState.errors.events.message}</small>}
                  </fieldset>
                  <div className="form-grid">
                    <label className="field"><span>Dietary preference</span><select {...form.register("dietaryPreference")}><option value="">Select if you wish</option><option>Vegetarian</option><option>Jain</option><option>Vegan</option><option>Other</option></select></label>
                    <div className="field"><span>A little help with</span><div className="checkbox-row compact"><label className="choice-check"><input type="checkbox" {...form.register("accommodation")} /><span>Accommodation</span></label><label className="choice-check"><input type="checkbox" {...form.register("transportation")} /><span>Transportation</span></label></div></div>
                  </div>
                  <label className="field"><span>A message for us <small>(optional)</small></span><textarea rows={3} maxLength={500} {...form.register("message")} aria-invalid={Boolean(form.formState.errors.message)} aria-describedby="message-error" placeholder="Share a note or a wish..." />{form.formState.errors.message && <small id="message-error" className="field-error">{form.formState.errors.message.message}</small>}</label>
                  {wedding.rsvp.showConsent && <label className="consent-field"><input type="checkbox" {...form.register("consent")} /><span>I understand this demo saves my response only in this browser.</span></label>}
                  {form.formState.errors.consent && <small className="field-error">{form.formState.errors.consent.message}</small>}
                  <div className="form-bottom"><button className="button button-primary" type="submit" disabled={rsvpBusy}>{rsvpBusy ? "Sending…" : "Send my response"}<ArrowRight size={16} /></button><span>We’ll be so glad to hear from you.</span></div>
                  <p className="privacy-note">Demo note: your response is stored only in this browser, not sent to the couple.</p>
                </form>
              )}
              {rsvpStatus && !rsvpSaved && <p className="status-message" role="status">{rsvpStatus}</p>}
            </div>
          </div>
        </section>

        {wedding.theme.showWishes && (
          <section className="wishes section-pad">
            <div className="section-wrap wishes-wrap">
              <SectionHeading eyebrow="A note to keep close" title="Send a Little Love" />
              <div className="wishes-layout">
                <div className="wish-list">
                  {wishes.map((wish, index) => <article className="wish-card" key={`${wish.name}-${index}`}><span aria-hidden="true">“</span><p>{wish.message}</p><strong>{wish.name}</strong></article>)}
                </div>
                <form className="wish-form" ref={wishFormRef} onSubmit={submitWish}>
                  <p>Leave a wish for our new beginning.</p>
                  <label className="field"><span>Your name</span><input name="wish-name" required minLength={2} maxLength={60} placeholder="Your name" /></label>
                  <label className="field"><span>Your message</span><textarea name="wish-message" required minLength={3} maxLength={240} rows={3} placeholder="Write something from the heart..." /></label>
                  <div className="wish-submit"><button className="button button-primary" type="submit">Share your wish <ArrowRight size={16} /></button><small aria-live="polite">{wishStatus || "Your wish is shown only on this device."}</small></div>
                </form>
              </div>
            </div>
          </section>
        )}

        <section className="share-section section-pad" aria-labelledby="share-title">
          <Reveal className="share-inner">
            <Logo className="share-logo" size={64} />
            <span className="eyebrow">Pass the joy along</span>
            <h2 id="share-title">Share the invitation</h2>
            <p>{wedding.social.whatsappShareText}</p>
            <div className="share-actions">
              <button className="button button-primary" type="button" onClick={() => void shareInvitation()}><Share2 size={16} /> Share invitation</button>
              <a className="button button-outline-dark" href="https://wa.me/" target="_blank" rel="noreferrer" onClick={(event) => { event.preventDefault(); window.open(`https://wa.me/?text=${encodeURIComponent(`${wedding.social.whatsappShareText} ${window.location.href}`)}`, "_blank", "noopener,noreferrer"); }}>WhatsApp</a>
              <button className="button button-outline-dark" type="button" onClick={() => void copyLink()}><Copy size={15} /> Copy link</button>
            </div>
            <p className="share-status" aria-live="polite">{shareStatus}</p>
          </Reveal>
        </section>

        <footer className="closing">
          <a className="back-top" href="#home" aria-label="Back to top"><ArrowUp size={17} /></a>
          <Logo className="closing-logo" size={80} />
          <span className="eyebrow">With love,</span>
          <h2>{wedding.couple.displayName}</h2>
          <p>{wedding.couple.closingLine}</p>
          <span className="closing-hashtag">{wedding.couple.hashtag}</span>
          <span className="closing-ornament" aria-hidden="true">✦　❋　✦</span>
          <small>Made with love, for a day to remember</small>
        </footer>
      </main>

      {poppersActive && <PartyPoppers />}

      <AnimatePresence>
        {coverOpen && (
          <motion.div className="cover" role="dialog" aria-modal="true" aria-label="Palace doors. Open the wedding invitation" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.4 } }}>
            <motion.div className="cover-glow" initial={{ opacity: 1 }} animate={{ opacity: doorsOpening ? 0 : 1 }} transition={{ duration: reducedMotion ? 0 : 1.8, delay: reducedMotion ? 0 : 0.4 }} aria-hidden="true" />
            <motion.div className="palace-door palace-door-left" initial={{ rotateY: 0 }} animate={{ rotateY: doorsOpening ? -112 : 0 }} transition={{ duration: reducedMotion ? 0 : 1.7, ease: [0.65, 0, 0.25, 1] }} aria-hidden="true">
              <span className="palace-door-panel">❋</span>
            </motion.div>
            <motion.div className="palace-door palace-door-right" initial={{ rotateY: 0 }} animate={{ rotateY: doorsOpening ? 112 : 0 }} transition={{ duration: reducedMotion ? 0 : 1.7, ease: [0.65, 0, 0.25, 1] }} aria-hidden="true">
              <span className="palace-door-panel">❋</span>
            </motion.div>
            <motion.div className="cover-plaque" initial={{ opacity: 1 }} animate={{ opacity: doorsOpening ? 0 : 1 }} transition={{ duration: reducedMotion ? 0 : 0.35 }}>
              <Logo className="cover-logo" size={88} />
              <p className="cover-title">You are invited</p>
              {/* <h2 className="cover-names">{wedding.couple.displayName}</h2> */}
              <button className="button button-primary cover-button" ref={openInvitationRef} type="button" onClick={openInvitation} disabled={doorsOpening}>Open invitation <ArrowRight size={16} /></button>
              <span className="cover-tap">Step through the palace doors</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxIndex !== null && gallery[lightboxIndex] && (
          <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setLightboxIndex(null); }}>
            <button className="lightbox-close" ref={lightboxCloseRef} type="button" onClick={() => setLightboxIndex(null)} aria-label="Close gallery"><X /></button>
            <button className="lightbox-arrow lightbox-left" type="button" aria-label="Previous photograph" onClick={() => setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length)}><ArrowLeft /></button>
            <motion.div
              className={`lightbox-art gallery-${gallery[lightboxIndex].color}`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) setLightboxIndex((lightboxIndex + 1) % gallery.length);
                else if (info.offset.x > 60) setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
              }}
            >
              {gallery[lightboxIndex].src ? <AssetImage src={gallery[lightboxIndex].src!} alt={gallery[lightboxIndex].alt} fill sizes="(max-width: 760px) 82vw, 640px" /> : <span aria-hidden="true">✿</span>}
              {!gallery[lightboxIndex].src && <p>A photograph will bloom here</p>}
            </motion.div>
            <div className="lightbox-caption"><span>{gallery[lightboxIndex].alt}</span><span>{lightboxIndex + 1} / {gallery.length}</span></div>
            <button className="lightbox-arrow lightbox-right" type="button" aria-label="Next photograph" onClick={() => setLightboxIndex((lightboxIndex + 1) % gallery.length)}><ArrowRight /></button>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
