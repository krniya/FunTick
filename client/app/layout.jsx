import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata = {
    title: "FunTick",
    description: "Event management",
    icons: {
        icon: "/assets/images/logo.svg",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className={poppins.variable}>{children}</body>
        </html>
    );
}
