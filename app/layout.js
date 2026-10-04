import "./globals.css";

export const metadata = {
  title: "EcoCycle — E-Waste Recycling",
  description: "Responsible electronic waste collection, reuse and recycling.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}