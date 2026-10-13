import Image from "next/image";
import wedding from "@/data/wedding";

export default function Loading() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <Image className="logo-mark loading-logo" src={wedding.assets.logo} alt="" width={96} height={96} priority />
      <span className="sr-only">Loading the invitation</span>
    </div>
  );
}
