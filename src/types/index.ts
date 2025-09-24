export interface Service {
  id: number;
  title: string;
  description: string;
  bgImage: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}
