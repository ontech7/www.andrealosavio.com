export interface HowIWorkStep {
  id: string;
  image: string;
  width: number;
  height: number;
  frameClassName: string;
  imageClassName: string;
}

export const HOW_I_WORK_STEPS: HowIWorkStep[] = [
  {
    id: "listen",
    image: "/images/about/working-with-quido.jpeg",
    width: 1280,
    height: 1706,
    frameClassName: "aspect-4/3",
    imageClassName: "size-full object-cover object-[50%_32%]",
  },
  {
    id: "team",
    image: "/images/about/working-with-quido-team.jpeg",
    width: 800,
    height: 600,
    frameClassName: "aspect-4/3",
    imageClassName: "size-full object-cover object-center",
  },
  {
    id: "beyond",
    image: "/images/about/interview-with-storytime.jpg",
    width: 1280,
    height: 720,
    frameClassName: "aspect-4/3",
    imageClassName: "size-full object-cover object-center",
  },
];
