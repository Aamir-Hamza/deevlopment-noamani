import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessibility, setAccessibility] = useState(false);

  // SheetDB API URL
  const SHEETDB_URL = "https://sheetdb.io/api/v1/awism0edjrs2z";

  const handleSubscribe = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setMessage("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      // 1. Check for duplicate email
      const checkRes = await fetch(`${SHEETDB_URL}/search?email=${encodeURIComponent(email)}`);
      const checkData = await checkRes.json();
      if (Array.isArray(checkData) && checkData.length > 0) {
        setMessage("This email is already subscribed.");
        setLoading(false);
        return;
      }
      // 2. If not duplicate, add to sheet
      const res = await fetch(SHEETDB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [{ email }] }),
      });
      if (res.ok) {
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <footer className="w-full bg-[#f8f6f0] pt-24 pb-20 px-8 min-h-[80vh]">
      <div className="max-w-screen-2xl mx-auto">
        {/* Newsletter Signup Section */}
        <div className="mb-24">
          <form onSubmit={handleSubscribe}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-12 mb-12">
              <h2 className="text-4xl font-medium text-gray-800 tracking-wide">
                SIGN UP FOR EXCLUSIVITY
              </h2>
              <div className="flex items-center gap-6">
                <input
                  type="email"
                  placeholder="Enter an email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="px-6 py-4 border border-gray-300 bg-white text-gray-800 placeholder:text-gray-500 focus:outline-none focus:border-gray-400 min-w-[400px] text-lg"
                  required
                  disabled={loading}
                />
                <button
                  className="px-12 py-4 bg-gray-800 text-white font-medium rounded hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "..." : "Confirm"}
                </button>
              </div>
            </div>
          </form>
          
          {/* Accessibility Toggle */}
          <div className="flex items-center gap-6 mt-8">
            <span className="text-xl text-gray-800 font-medium">Accessibility: Better contrast</span>
            <button
              onClick={() => setAccessibility(!accessibility)}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                accessibility ? 'bg-gray-800' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  accessibility ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {message && (
            <div
              className={`mt-4 px-4 py-2 rounded inline-block text-sm ${
                message.startsWith('Thank')
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Four Column Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* Find a boutique */}
          <div>
            <h3 className="text-2xl font-medium text-gray-800 mb-8">Find a boutique</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/find-a-boutique" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Noamani Perfumes Boutiques
                </Link>
              </li>
              <li>
                <Link href="/find-a-boutique" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Noamani Couture Boutiques
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Services */}
          <div>
            <h3 className="text-2xl font-medium text-gray-800 mb-8">Client Services</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/customer-care/contact" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                  Contact us
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </li>
              <li>
                <Link href="/customer-care/returns" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                  Delivery & Returns
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </li>
              <li>
                <Link href="/customer-care/faqs" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                  FAQ
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Receive My Invoice
                </Link>
              </li>
            </ul>
          </div>

          {/* Maison Noamani */}
          <div>
            <h3 className="text-2xl font-medium text-gray-800 mb-8">Maison Noamani</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/maison-noamani" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                  Noamani Sustainability
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </li>
              <li>
                <Link href="/maison-noamani" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Ethics & Compliance
                </Link>
              </li>
              <li>
                <Link href="/maison-noamani" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-2xl font-medium text-gray-800 mb-8">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/legal/terms" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                  Legal Terms
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                  Privacy Policy
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </li>
              <li>
                <Link href="/legal/general-sales-conditions" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                  General Sales Conditions
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Cookie Management
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                  Sitemap
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Social Media, Brand, Region Selector */}
        <div className="mt-20 pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Section - Social Media Links */}
            <div className="flex flex-wrap items-center gap-3 text-lg text-gray-700">
              <span className="font-medium">Follow us :</span>
              <Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                Tiktok
              </Link>
              <Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                Instagram
              </Link>
              <Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                X
              </Link>
              <Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                Facebook
              </Link>
              <Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                Snapchat
              </Link>
            </div>

            {/* Center Section - Brand Logo */}
            <div className="text-4xl font-serif text-gray-800 tracking-widest">
              NOAMANI
            </div>

            {/* Right Section - Region and Language Selector */}
            <div className="flex flex-col items-end">
              <div className="text-sm text-gray-700 mb-1">
                Choose your Country or Region & Language
              </div>
              <div className="flex items-center gap-2 text-lg text-gray-700">
                <span>International version (English)</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
