import React from "react";

interface Footer2Props {
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const FooterSection = ({
  copyright = "© 2025 FinanceTracker All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "/" },
    { text: "Privacy Policy", url: "/" },
  ],
}: Footer2Props) => {
  return (
    <section className="">
      <div className="container mx-auto">
        <footer>
          <div className="flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center p-8">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline hover:text-primary">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { FooterSection };
