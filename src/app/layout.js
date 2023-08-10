import "./styles/globals.css";

import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "500", "700", "600"],
});

export const metadata = {
  title: "My TO-DO's",
  description: "Simple TO-DO App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
