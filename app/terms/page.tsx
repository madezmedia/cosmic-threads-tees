import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import AppLayout from "@/components/app-layout"

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-white/70 text-lg">Last updated: January 1, 2023</p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
            <p className="text-white/70 mb-4">
              Welcome to Artistry AI. These Terms of Service govern your use of our website, products, and services.
            </p>
            <p className="text-white/70">
              By accessing or using Artistry AI, you agree to be bound by these Terms. If you disagree with any part of
              the terms, you may not access the service.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">2. Use of Service</h2>
            <p className="text-white/70 mb-4">
              Artistry AI provides an AI-powered platform for creating custom wall art and apparel designs. You may use
              our service to create, customize, and purchase designs for personal or commercial use, subject to the
              limitations outlined in these Terms.
            </p>
            <p className="text-white/70">
              You are responsible for maintaining the confidentiality of your account and password and for restricting
              access to your computer. You agree to accept responsibility for all activities that occur under your
              account.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">3. Intellectual Property</h2>
            <p className="text-white/70 mb-4">
              When you create a design using Artistry AI, you retain the rights to use that design for personal or
              commercial purposes. However, Artistry AI retains ownership of the underlying AI technology and algorithms
              used to generate the designs.
            </p>
            <p className="text-white/70">
              By using our service, you grant Artistry AI a non-exclusive, worldwide, royalty-free license to use,
              reproduce, and display your designs for the purpose of providing and improving our services, and for
              marketing purposes unless you opt out.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">4. Prohibited Content</h2>
            <p className="text-white/70 mb-4">
              You agree not to use Artistry AI to create designs that are illegal, harmful, threatening, abusive,
              harassing, defamatory, vulgar, obscene, invasive of another's privacy, hateful, or racially, ethnically,
              or otherwise objectionable.
            </p>
            <p className="text-white/70">
              Artistry AI reserves the right to remove any content that violates these Terms and to terminate or suspend
              accounts that repeatedly violate these Terms.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">5. Limitation of Liability</h2>
            <p className="text-white/70 mb-4">
              Artistry AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting
              from your access to or use of or inability to access or use the service.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">6. Changes to Terms</h2>
            <p className="text-white/70 mb-4">
              Artistry AI reserves the right, at our sole discretion, to modify or replace these Terms at any time. If a
              revision is material, we will try to provide at least 30 days' notice prior to any new terms taking
              effect.
            </p>
            <p className="text-white/70">
              By continuing to access or use our service after those revisions become effective, you agree to be bound
              by the revised terms.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">7. Contact Us</h2>
            <p className="text-white/70">
              If you have any questions about these Terms, please contact us at legal@artistryai.com.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

