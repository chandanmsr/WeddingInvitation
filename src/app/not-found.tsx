import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">A little detour</p>
      <h1>This page could not be found.</h1>
      <Link className="button button-primary" href="/">Return to the invitation</Link>
    </main>
  );
}
