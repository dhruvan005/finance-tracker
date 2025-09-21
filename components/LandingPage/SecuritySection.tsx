// import React from 'react'

// function SecuritySection() {
//   return (
//     <div>SecuritySection</div>
//   )
// }

// export default SecuritySection

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Hero1Props {
  badge?: string;
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image: {
    src: string;
    alt: string;
  };
}

const SecuritySection = ({ heading, description, image }: Hero1Props) => {
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex justify-center">
        <span className="text-muted-foreground font-mono text-xs">
          security=&quot;max&quot;
        </span>
      </div>
      <div className="grid items-center gap-8 lg:grid-cols-2 justify-center">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="my-6 text-pretty text-2xl font-bold lg:text-3xl">
            {heading}
          </h1>
          <p className="text-muted-foreground  max-w-xl lg:text-sm">
            {description}
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-2/4">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full rounded-md object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { SecuritySection };
