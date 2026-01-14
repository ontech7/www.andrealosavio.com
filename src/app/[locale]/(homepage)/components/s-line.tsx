import { cn } from "@/utils/cn";

export function SLine({
  inverted,
  className,
}: {
  inverted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-20 items-center justify-center md:h-25",
        inverted && "scale-y-[-1]",
        className
      )}
    >
      <SLineCurve position="bottom" className="self-start" />
      <div
        className="hidden h-0.5 w-full md:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, #333333 0, #333333 8px, transparent 8px, transparent 16px)",
        }}
      />
      <div
        className="block h-full w-0.5 md:hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to top, #333333 0, #333333 8px, transparent 8px, transparent 16px)",
        }}
      />
      <SLineCurve position="top" className="self-end" />
    </div>
  );
}

function SLineCurve({
  position,
  className,
}: {
  position: "top" | "bottom";
  className?: string;
}) {
  return (
    <svg
      width="33"
      height="51"
      viewBox="0 0 33 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "hidden shrink-0 md:block",
        position === "top" ? "-ml-1.5" : "-mr-1.5 rotate-180",
        className
      )}
    >
      <rect
        x="31.5"
        y="16.5"
        width="1"
        height="34"
        stroke="#333333"
        strokeDasharray="8 8"
      />
      <mask id="path-2-inside-1_324_1181" fill="white">
        <path d="M16.1952 0.00281672C18.3617 -0.0372073 20.5148 0.349877 22.5316 1.14196C24.5485 1.93405 26.3896 3.11562 27.9498 4.61923C29.51 6.12284 30.7587 7.91902 31.6248 9.90524C32.4908 11.8915 32.9572 14.0288 32.9972 16.1952L30.9955 16.2322C30.9603 14.3286 30.5506 12.4506 29.7896 10.7054C29.0287 8.96019 27.9314 7.38195 26.5605 6.06078C25.1896 4.73961 23.5719 3.7014 21.7998 3.00542C20.0277 2.30945 18.1358 1.96933 16.2322 2.0045L16.1952 0.00281672Z" />
      </mask>
      <path
        d="M16.1952 0.00281672C18.3617 -0.0372073 20.5148 0.349877 22.5316 1.14196C24.5485 1.93405 26.3896 3.11562 27.9498 4.61923C29.51 6.12284 30.7587 7.91902 31.6248 9.90524C32.4908 11.8915 32.9572 14.0288 32.9972 16.1952L30.9955 16.2322C30.9603 14.3286 30.5506 12.4506 29.7896 10.7054C29.0287 8.96019 27.9314 7.38195 26.5605 6.06078C25.1896 4.73961 23.5719 3.7014 21.7998 3.00542C20.0277 2.30945 18.1358 1.96933 16.2322 2.0045L16.1952 0.00281672Z"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="8 8"
        mask="url(#path-2-inside-1_324_1181)"
      />
    </svg>
  );
}
