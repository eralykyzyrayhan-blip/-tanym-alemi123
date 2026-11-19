import Link from "next/link";
import { ArrowLeft, Gamepad2, SearchX } from "lucide-react";
import { Logo } from "@/components/site-chrome";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="surface p-6 text-center sm:p-8">
          <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-grapelight text-grape-deep">
            <SearchX size={30} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-ink sm:text-3xl">Бұл бет табылмады</h1>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-ink-soft">
            Сілтеме ескірген болуы мүмкін. Басты бетке оралып, ойындардың бірін таңда.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
            <Link href="/" className="btn btn-primary px-5 py-3.5 text-base">
              <ArrowLeft size={18} aria-hidden="true" />
              Басты бетке оралу
            </Link>
            <Link href="/#games" className="btn btn-ghost px-5 py-3.5 text-base">
              <Gamepad2 size={18} aria-hidden="true" />
              Ойындарды таңдау
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
