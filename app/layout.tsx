import "./globals.css"
import Navbar from "./components/Navbar"

export const metadata = {
  title: "Vault Admin",
  description: "Admin panel with secure Neon/Postgres authentication"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div
          style={{
            paddingTop: 85,
            minHeight: "100vh",
            maxWidth: 480,
            margin: "0 auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  )
}