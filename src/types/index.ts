import { StaticImageData } from "next/image";

export interface Service {
  id: number;
  title: string;
  description: string;
  bgImage: StaticImageData;
  url: string;
  icon: StaticImageData;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  url: string;
  // Either an image or a background color
  image?: StaticImageData;
  backgroundColor?: string;
}
