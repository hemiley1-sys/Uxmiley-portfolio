import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground flex-col gap-6 p-6 text-center">
      <div className="relative">
        <h1 className="text-8xl md:text-9xl font-display font-bold text-primary opacity-20">404</h1>
        <h2 className="text-2xl md:text-3xl font-display font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
          Page not found
        </h2>
      </div>
      
      <p className="text-muted-foreground max-w-md">
        The page you're looking for doesn't exist or has been moved to another coordinate.
      </p>

      <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
        <ArrowLeft size={18} />
        Return Home
      </Link>
    </div>
  );
}
