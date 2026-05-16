import { siteConfig } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-40 group inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_50px_-10px_rgba(37,211,102,0.55)] hover:scale-110 transition-transform animate-float"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
      <svg viewBox="0 0 24 24" className="relative h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M19.05 4.91A10 10 0 0 0 12 2a10 10 0 0 0-8.49 15.27L2 22l4.86-1.46A10 10 0 0 0 22 12a9.9 9.9 0 0 0-2.95-7.09zM12 20.13a8.13 8.13 0 0 1-4.14-1.13l-.3-.17-2.88.87.86-2.81-.19-.31A8.13 8.13 0 1 1 20.13 12 8.14 8.14 0 0 1 12 20.13zm4.46-6.1c-.25-.13-1.45-.71-1.67-.79s-.39-.13-.55.13-.63.79-.77.95-.28.19-.53.06a6.69 6.69 0 0 1-1.96-1.21 7.42 7.42 0 0 1-1.36-1.7c-.14-.25 0-.38.11-.5s.25-.28.37-.43.16-.25.25-.41.04-.31 0-.43-.55-1.32-.75-1.81-.4-.41-.55-.42h-.47a.9.9 0 0 0-.66.31 2.77 2.77 0 0 0-.85 2.05 4.8 4.8 0 0 0 1 2.54 11 11 0 0 0 4.21 3.71c.59.25 1.05.4 1.41.51a3.4 3.4 0 0 0 1.55.1 2.55 2.55 0 0 0 1.67-1.18 2.07 2.07 0 0 0 .15-1.18c-.07-.1-.23-.16-.48-.29z" />
      </svg>
    </a>
  );
}
