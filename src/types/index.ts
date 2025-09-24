import { StaticImageData } from "next/image";

export interface Service {
  id: number;
  title: string;
  description: string;
  bgImage: StaticImageData;
  url: string;
  icon: StaticImageData;
}
