import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#151311] px-5 pb-12 pt-28 text-[#f7f1e7] sm:px-8 sm:pt-32">
      {/* Quiet decorative light keeps the page dimensional without competing with the message. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 20%, rgba(166,130,79,0.13), transparent 30%), radial-gradient(circle at 82% 76%, rgba(130,99,62,0.10), transparent 32%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-[#aa8b60]/35 to-transparent sm:top-28"
      />

      <section className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#bfa77f] sm:text-xs">
          Maison Noamani
        </p>

        <div className="relative mx-auto mb-6 flex h-24 w-44 items-center justify-center sm:h-28 sm:w-56">
          <span
            aria-hidden="true"
            className="absolute font-serif text-[7rem] font-medium leading-none tracking-[-0.08em] text-[#f3e8d6]/[0.06] sm:text-[9rem]"
          >
            404
          </span>
          <span className="relative text-sm font-medium uppercase tracking-[0.28em] text-[#d6c19f]">
            Page not found
          </span>
        </div>

        <h1
          className="font-serif text-4xl font-normal leading-[1.12] tracking-[-0.025em] text-[#fffaf2] sm:text-5xl md:text-6xl"
          style={{ fontFamily: "'Playfair Display', Didot, Georgia, serif" }}
        >
          This destination has
          <span className="block italic text-[#c9ad82]">drifted out of reach.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#c4bbb0] sm:text-base sm:leading-8">
          The page may have moved or no longer exists. Return to the Maison, or continue exploring our fragrance collection.
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f4ede3] px-8 text-sm font-semibold tracking-wide text-[#211c17] transition duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a574] focus-visible:ring-offset-4 focus-visible:ring-offset-[#151311]"
          >
            Return home
          </Link>
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#8f7656] px-8 text-sm font-semibold tracking-wide text-[#eadfce] transition duration-200 hover:border-[#c3a57b] hover:bg-[#c3a57b]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a574] focus-visible:ring-offset-4 focus-visible:ring-offset-[#151311]"
          >
            Explore fragrances
          </Link>
        </div>

        <div className="mx-auto mt-12 flex w-full max-w-xs items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#8c7352]/60" />
          <span className="h-1.5 w-1.5 rotate-45 border border-[#b29469]" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#8c7352]/60" />
        </div>
      </section>
    </main>
  );
}
