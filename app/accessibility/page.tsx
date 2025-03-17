import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import AppLayout from "@/components/app-layout"

export default function AccessibilityPage() {
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
              Accessibility Statement
            </h1>
            <p className="text-white/70 text-lg">Last updated: January 1, 2023</p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Our Commitment</h2>
            <p className="text-white/70 mb-4">
              Artistry AI is committed to ensuring digital accessibility for people with disabilities. We are
              continually improving the user experience for everyone, and applying the relevant accessibility standards.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Conformance Status</h2>
            <p className="text-white/70 mb-4">
              The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to
              improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level
              AA, and Level AAA.
            </p>
            <p className="text-white/70">
              Artistry AI is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of
              the content do not fully conform to the accessibility standard.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Accessibility Features</h2>
            <p className="text-white/70 mb-4">Artistry AI includes the following accessibility features:</p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>Semantic HTML structure for better screen reader navigation</li>
              <li>Keyboard navigation support for all interactive elements</li>
              <li>Sufficient color contrast for text and important graphics</li>
              <li>Text alternatives for non-text content</li>
              <li>Resizable text without loss of functionality</li>
              <li>ARIA landmarks and roles to enhance navigation</li>
            </ul>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Known Limitations</h2>
            <p className="text-white/70 mb-4">
              Despite our best efforts to ensure accessibility of Artistry AI, there may be some limitations. Below is a
              description of known limitations:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>Some of our interactive design tools may be difficult to use with keyboard-only navigation</li>
              <li>Some generated images may not have adequate alternative text descriptions</li>
              <li>Some dynamic content may not be fully accessible to screen readers</li>
            </ul>
            <p className="text-white/70 mt-4">
              We are working to address these issues and improve the accessibility of our platform.
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Feedback</h2>
            <p className="text-white/70 mb-4">
              We welcome your feedback on the accessibility of Artistry AI. Please let us know if you encounter
              accessibility barriers:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>Email: accessibility@artistryai.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Postal address: 123 Art Street, Creative District, San Francisco, CA 94103</li>
            </ul>
            <p className="text-white/70 mt-4">We try to respond to feedback within 3 business days.</p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Assessment Approach</h2>
            <p className="text-white/70 mb-4">
              Artistry AI assessed the accessibility of our platform using the following approaches:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>Self-evaluation</li>
              <li>External evaluation by accessibility experts</li>
              <li>User testing with assistive technologies</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

