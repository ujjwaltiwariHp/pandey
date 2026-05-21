import { Baloo_2 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const baloo = Baloo_2({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
});

export const metadata = {
  title: "पाण्डेय ट्रेडर्स — प्रीमियम खाद एवं बीज",
  description:
    "पाण्डेय ट्रेडर्स — गोपालगंज, बिहार | उत्कृष्ट कृषि उत्पाद, प्रमाणित बीज एवं खाद।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi" data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={baloo.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
