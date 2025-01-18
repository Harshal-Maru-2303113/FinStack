// Importing the Metadata type from Next.js for type checking
import type { Metadata } from "next";
// Importing global CSS styles for the application
import "./globals.css";

// Defining the metadata for the page, such as title and description
export const metadata: Metadata = {
  title: "FinStack", // The title of the website or web page
  description: "A Financial Management Website", // The description that provides information about the website
};

// RootLayout component that wraps around the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Type definition for the children prop, which will be passed into the layout
}>) {
  return (
    <html lang="en"> {/* Setting the language attribute to "en" (English) for the HTML document */}
      <body>
        {children} {/* Rendering the children components inside the body of the page */}
      </body>
    </html>
  );
}
