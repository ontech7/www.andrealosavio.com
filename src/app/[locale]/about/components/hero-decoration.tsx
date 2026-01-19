import Image from "next/image";

export function AboutHeroDecoration() {
  return (
    <div className="relative h-103.25 w-103.25 transition-transform duration-300 hover:rotate-2">
      {/* Grid lines */}
      <div className="pointer-events-none absolute inset-0">
        {/* Vertical lines */}
        <div className="absolute top-0 left-[11.65px] h-full w-[0.9px] bg-[#BFBFBF]/30" />
        <div className="absolute top-0 right-[11.65px] h-full w-[0.9px] bg-[#BFBFBF]/30" />
        {/* Horizontal lines */}
        <div className="absolute top-[11.65px] left-0 h-[0.9px] w-full bg-[#BFBFBF]/30" />
        <div className="absolute bottom-[11.65px] left-0 h-[0.9px] w-full bg-[#BFBFBF]/30" />
      </div>

      {/* Image container with rounded corners and clipping */}
      <div className="absolute top-[21.5px] left-[21.5px] h-[calc(100%-43px)] w-[calc(100%-43px)] overflow-hidden rounded-[11px]">
        <Image
          src="/images/about/me.png"
          alt="Andrea Losavio"
          width={370 * 3}
          height={370 * 3}
          priority
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}
