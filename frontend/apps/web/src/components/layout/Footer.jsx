import React from "react";
import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 text-xs py-12 border-t border-neutral-800">
      <Container className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <span>🍴</span>
            <span>Servio</span>
          </div>
          <p className="text-neutral-400">
            Real-time restaurant operations, live kitchen queues, and instant dining experiences.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Company</h4>
          <ul className="space-y-1.5">
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">For Restaurants</h4>
          <ul className="space-y-1.5">
            <li><Link href="/partner" className="hover:text-white transition">Partner with Us</Link></li>
            <li><Link href="/kds" className="hover:text-white transition">Kitchen Display System</Link></li>
            <li><Link href="/manager" className="hover:text-white transition">Restaurant Manager</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Legal</h4>
          <ul className="space-y-1.5">
            <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="/security" className="hover:text-white transition">Security</Link></li>
          </ul>
        </div>
      </Container>

      <Container className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>© {new Date().getFullYear()} Servio Inc. All rights reserved.</div>
        <div className="flex gap-4">
          <span>🇮🇳 India</span>
          <span>English</span>
        </div>
      </Container>
    </footer>
  );
}
