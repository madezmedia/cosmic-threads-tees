import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import AppLayout from "@/components/app-layout"

export default function CookiesPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Cookie Policy
            </h1>
            <p className="text-white/70 text-lg">Last updated: January 1, 2023</p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
            <p className="text-white/70 mb-4">
              This Cookie Policy explains how Artistry AI uses cookies and similar technologies to recognize you when
              you visit our website. It explains what these technologies are and why we use them, as well as your rights
              to control our use of them.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">2. What Are Cookies?</h2>
            <p className="text-white/70 mb-4">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website.
              Cookies are widely used by website owners in order to make their websites work, or to work more
              efficiently, as well as to provide reporting information.
            </p>
            <p className="text-white/70">
              Cookies set by the website owner (in this case, Artistry AI) are called "first-party cookies". Cookies set
              by parties other than the website owner are called "third-party cookies". Third-party cookies enable
              third-party features or functionality to be provided on or through the website (e.g., advertising,
              interactive content, and analytics).
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">3. Why Do We Use Cookies?</h2>
            <p className="text-white/70 mb-4">We use first-party and third-party cookies for several reasons.</p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>
                <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly and
                cannot be switche cookies are necessary for the website to function properly and cannot be switched off
                in our systems. They are usually only set in response to actions made by you which amount to a request
                for services, such as setting your privacy preferences, logging in, or filling in forms.
              </li>
              <li>
                <strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we
                can measure and improve the performance of our site. They help us to know which pages are the most and
                least popular and see how visitors move around the site.
              </li>
              <li>
                <strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced
                functionality and personalization. They may be set by us or by third-party providers whose services we
                have added to our pages.
              </li>
              <li>
                <strong>Targeting Cookies:</strong> These cookies may be set through our site by our advertising
                partners. They may be used by those companies to build a profile of your interests and show you relevant
                advertisements on other sites.
              </li>
            </ul>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">4. How Can You Control Cookies?</h2>
            <p className="text-white/70 mb-4">
              You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject
              cookies, you may still use our website though your access to some functionality and areas of our website
              may be restricted.
            </p>
            <p className="text-white/70">
              Most web browsers allow some control of most cookies through the browser settings. To find out more about
              cookies, including how to see what cookies have been set, visit www.aboutcookies.org or
              www.allaboutcookies.org.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">5. Changes to Our Cookie Policy</h2>
            <p className="text-white/70 mb-4">
              We may update our Cookie Policy from time to time. If we make material changes to how we treat our users'
              cookies, we will notify you through a notice on the website.
            </p>
            <p className="text-white/70">
              The date the Cookie Policy was last revised is identified at the top of the page. You are responsible for
              periodically visiting our website and this Cookie Policy to check for any changes.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">6. Contact Us</h2>
            <p className="text-white/70">
              If you have any questions about this Cookie Policy, please contact us at privacy@artistryai.com.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

