import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import AppLayout from "@/components/app-layout"

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-white/70 text-lg">Last updated: January 1, 2023</p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
            <p className="text-white/70 mb-4">
              At Artistry AI, we take your privacy seriously. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our website, products, and services.
            </p>
            <p className="text-white/70">
              Please read this Privacy Policy carefully. By accessing or using Artistry AI, you acknowledge that you
              have read, understood, and agree to be bound by all the terms of this Privacy Policy.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">2. Information We Collect</h2>
            <p className="text-white/70 mb-4">
              We collect several types of information from and about users of our platform, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>
                <strong>Personal Information:</strong> Name, email address, postal address, phone number, and other
                information you provide when creating an account or making a purchase.
              </li>
              <li>
                <strong>Design Information:</strong> The prompts, settings, and designs you create using our platform.
              </li>
              <li>
                <strong>Usage Information:</strong> How you interact with our platform, including the features you use
                and the time spent on the platform.
              </li>
              <li>
                <strong>Device Information:</strong> Information about the device you use to access our platform,
                including IP address, browser type, and operating system.
              </li>
            </ul>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">3. How We Use Your Information</h2>
            <p className="text-white/70 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>Provide, maintain, and improve our platform and services</li>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your account, orders, and our services</li>
              <li>Personalize your experience and provide tailored content and recommendations</li>
              <li>Develop new products and services</li>
              <li>Detect, prevent, and address technical issues and security breaches</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">4. How We Share Your Information</h2>
            <p className="text-white/70 mb-4">
              We may share your information with third parties in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>
                <strong>Service Providers:</strong> We may share your information with third-party service providers who
                perform services on our behalf, such as payment processing, data analysis, email delivery, and hosting
                services.
              </li>
              <li>
                <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a
                portion of our assets, your information may be transferred as part of that transaction.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in
                response to valid requests by public authorities.
              </li>
            </ul>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">5. Your Choices</h2>
            <p className="text-white/70 mb-4">You have several choices regarding the use of your information:</p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>
                <strong>Account Information:</strong> You can review and change your account information by logging into
                your account settings.
              </li>
              <li>
                <strong>Marketing Communications:</strong> You can opt out of receiving marketing emails from us by
                following the unsubscribe instructions in those emails.
              </li>
              <li>
                <strong>Cookies:</strong> You can set your browser to refuse all or some browser cookies, or to alert
                you when cookies are being sent.
              </li>
            </ul>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">6. Data Security</h2>
            <p className="text-white/70 mb-4">
              We have implemented measures designed to secure your personal information from accidental loss and from
              unauthorized access, use, alteration, and disclosure. However, the transmission of information via the
              internet is not completely secure, and we cannot guarantee the security of your information.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">7. Changes to Our Privacy Policy</h2>
            <p className="text-white/70 mb-4">
              We may update our Privacy Policy from time to time. If we make material changes to how we treat our users'
              personal information, we will notify you through a notice on the website.
            </p>
            <p className="text-white/70">
              The date the Privacy Policy was last revised is identified at the top of the page. You are responsible for
              periodically visiting our website and this Privacy Policy to check for any changes.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">8. Contact Us</h2>
            <p className="text-white/70">
              If you have any questions about this Privacy Policy, please contact us at privacy@artistryai.com.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

