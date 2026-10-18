'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  ShieldCheck,
  Globe,
  PieChart,
  Calendar,
  CheckCircle2,
  DollarSign,
  Users,
  Building,
  Target,
  Sparkles,
  X,
  ExternalLink,
  Lock,
  ArrowUpRight,
} from 'lucide-react';

interface InvestorDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InvestorDeckModal({ isOpen, onClose }: InvestorDeckModalProps) {
  const [activeTab, setActiveTab] = useState<'budget' | 'roadmap' | 'economics' | 'impact'>('budget');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl max-w-4xl w-full text-zinc-100 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-1/4 w-96 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-zinc-800/80 flex items-start justify-between relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-medium mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GRANT PROPOSAL & UNIT ECONOMICS DECK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              £8,000 GBP Seed Grant Allocation
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Global Student Assistance Platform (GSAP) — 3-6 Month Scaling Strategy & Moat
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 px-6 sm:px-8 bg-zinc-950/40 overflow-x-auto text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('budget')}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'budget'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Spend Breakdown (£8,000)</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>3-6 Month Roadmap</span>
          </button>
          <button
            onClick={() => setActiveTab('economics')}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'economics'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Unit Economics & Moat</span>
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'impact'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Social Impact & 18+ Safeguards</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-6">
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                    <span>Escrow Reserve</span>
                    <span className="font-mono text-amber-400 font-bold">35%</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white">£2,800</div>
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Neutral milestone escrow backing & multi-currency FX liquidity guarantee.
                  </p>
                </div>

                <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                    <span>Campus Network</span>
                    <span className="font-mono text-emerald-400 font-bold">25%</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white">£2,000</div>
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Student ambassador rollout across UK Russell Group & Bangalore tech universities.
                  </p>
                </div>

                <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                    <span>18+ OCR & KYC</span>
                    <span className="font-mono text-blue-400 font-bold">25%</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white">£2,000</div>
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Automated age verification, institutional credentials API, and fraud detection.
                  </p>
                </div>

                <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                    <span>Legal & Cross-Border</span>
                    <span className="font-mono text-purple-400 font-bold">15%</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white">£1,200</div>
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Diaspora corridor terms of service, consumer rights, and GDPR compliance.
                  </p>
                </div>
              </div>

              {/* Spend Execution Plan */}
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  Detailed Spend Governance & Output Deliverables
                </h4>
                <div className="space-y-3 text-xs sm:text-sm text-zinc-300">
                  <div className="flex items-start gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                    <span className="font-mono font-bold text-amber-400 text-sm">01</span>
                    <div>
                      <strong className="text-white block font-medium">Milestone Escrow Vault Hardening (£2,800)</strong>
                      <span className="text-zinc-400 text-xs">
                        Zero-chargeback buffer, cross-border multi-currency FX bridge (GBP, USD, EUR, INR), and automated escrow release triggers.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                    <span className="font-mono font-bold text-emerald-400 text-sm">02</span>
                    <div>
                      <strong className="text-white block font-medium">UK-India University Student Network (£2,000)</strong>
                      <span className="text-zinc-400 text-xs">
                        Recruiting 50 verified bilingual student leaders across Imperial, UCL, Manchester, IISc Bangalore, and IITs to seed initial task execution.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                    <span className="font-mono font-bold text-blue-400 text-sm">03</span>
                    <div>
                      <strong className="text-white block font-medium">Automated 18+ Trust & Safety Pipeline (£2,000)</strong>
                      <span className="text-zinc-400 text-xs">
                        Cryptographic verification certificates, institutional .edu email sync, and automated government ID age gates to guarantee zero underage risk.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                    <span className="font-mono font-bold text-purple-400 text-sm">04</span>
                    <div>
                      <strong className="text-white block font-medium">Cross-Border Consumer & Escrow Legal Review (£1,200)</strong>
                      <span className="text-zinc-400 text-xs">
                        Dual-jurisdiction consumer contracts for London expats hiring verified students in Bangalore and Delhi for elderly family escort and digital services.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="relative border-l-2 border-zinc-800 ml-3 sm:ml-4 pl-6 space-y-8">
                {/* Milestone 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-amber-500 border-4 border-zinc-900 flex items-center justify-center" />
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-semibold mb-1">
                    Months 1 — 2: Platform Hardening & Beta Corridor Pilot
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">London ➔ Bangalore & London ➔ Hyderabad Beta</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-zinc-400 list-disc list-inside">
                    <li>Launch verified 18+ student onboarding across 5 partner universities.</li>
                    <li>Conduct 100 closed-beta cross-border concierge tasks (hospital escorts & paperwork).</li>
                    <li>Zero-dispute milestone escrow stress testing under GBP-INR exchange volatility.</li>
                  </ul>
                </div>

                {/* Milestone 2 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-blue-500 border-4 border-zinc-900 flex items-center justify-center" />
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-semibold mb-1">
                    Months 3 — 4: Campus Expansion & Growth Flywheel
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">1,000 Verified Students & UK Diaspora Community Outreach</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-zinc-400 list-disc list-inside">
                    <li>Partner with UK Indian & South Asian diaspora associations and NHS expat staff groups.</li>
                    <li>Scale from 2 to 6 key task categories (Tech, Design, Tutoring, Concierge, Research, Translation).</li>
                    <li>Integrate Garry Tan gstack AI task matching engine for instant 10-second candidate matching.</li>
                  </ul>
                </div>

                {/* Milestone 3 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-zinc-900 flex items-center justify-center" />
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold mb-1">
                    Months 5 — 6: Institutional Partnerships & B2B Pilot
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">Institutional Accreditation & Seed Round Readiness</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-zinc-400 list-disc list-inside">
                    <li>Sign career center accreditation MOUs with universities for official academic work credits.</li>
                    <li>B2B pilot: Startups hiring student developers and designers on paid hourly retainers.</li>
                    <li>Target metrics: £35,000 Monthly GMV, 99.4% satisfaction score, prep for £250K Seed Round.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'economics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4">
                  <div className="text-xs text-zinc-400">Marketplace Take Rate</div>
                  <div className="text-2xl font-black font-mono text-amber-400 mt-1">5.0%</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">Escrow guarantee fee</div>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4">
                  <div className="text-xs text-zinc-400">Avg Task Basket</div>
                  <div className="text-2xl font-black font-mono text-emerald-400 mt-1">£65.00</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">~₹6,800 INR / $82 USD</div>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4">
                  <div className="text-xs text-zinc-400">Customer CAC</div>
                  <div className="text-2xl font-black font-mono text-blue-400 mt-1">£18.00</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">Word of mouth + chapters</div>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4">
                  <div className="text-xs text-zinc-400">LTV:CAC Ratio</div>
                  <div className="text-2xl font-black font-mono text-purple-400 mt-1">23.3x</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">High repeat usage</div>
                </div>
              </div>

              <div className="bg-zinc-800/40 border border-zinc-700/60 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-white">Why GSAP Wins: The Unfair Competitive Moat</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300">
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                    <strong className="text-amber-400 block mb-1">1. Hyper-Local Regional Language & Culture</strong>
                    <span>Generic freelancing platforms (Fiverr, Upwork) cannot provide a student in Bangalore who speaks Kannada to take an elderly parent to a clinic. GSAP solves real human connection.</span>
                  </div>
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                    <strong className="text-emerald-400 block mb-1">2. Strictly 18+ Verified University Trust</strong>
                    <span>Every student possesses verified academic enrollment, age authentication, and background validation, eliminating client risk and student exploitation.</span>
                  </div>
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                    <strong className="text-blue-400 block mb-1">3. Cross-Border Escrow & Instant Local Payout</strong>
                    <span>Expats pay in GBP, EUR, or USD with zero foreign exchange headache; students receive direct UPI or bank transfer in local INR with zero risk.</span>
                  </div>
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                    <strong className="text-purple-400 block mb-1">4. Zero-Friction 1-Minute Matching</strong>
                    <span>Algorithmic skill matching pairs client needs directly to student majors (e.g. computer science students for coding, premed students for health assistance).</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="space-y-5">
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>UN Sustainable Development Goals (SDG) Alignment</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  GSAP directly supports <strong>SDG 8 (Decent Work & Economic Growth)</strong> and <strong>SDG 10 (Reduced Inequalities)</strong> by empowering university students to fund their higher education through dignity-based, hourly skilled micro-work rather than predatory student loans.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-800/40 border border-zinc-700/60 rounded-2xl p-4">
                  <div className="text-amber-400 font-bold text-base mb-1">Tuition Relief</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Students earn £8 - £25/hr, which is 2.5x to 4x standard hospitality or retail wages, allowing 10-15 hours/week to cover full living costs.
                  </p>
                </div>

                <div className="bg-zinc-800/40 border border-zinc-700/60 rounded-2xl p-4">
                  <div className="text-emerald-400 font-bold text-base mb-1">Elder Care Bridge</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Eliminating loneliness and digital isolation for elderly parents whose children work overseas in the UK, US, or Europe.
                  </p>
                </div>

                <div className="bg-zinc-800/40 border border-zinc-700/60 rounded-2xl p-4">
                  <div className="text-blue-400 font-bold text-base mb-1">Strict 18+ Safeguard</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Zero tolerance for underage gig work. Cryptographic certificates ensure only consenting adults participate with legal escrow protection.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-zinc-950/80 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-400">
            Official Grant Submission Document • <span className="font-mono text-zinc-300">REF: GSAP-GRANT-2026-UK</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
            >
              Close
            </button>
            <a
              href="mailto:grants@gsap.network?subject=GSAP%20Grant%20Inquiry%20%C2%A38,000"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition shadow-glow-amber flex items-center gap-1.5"
            >
              <span>Contact Pitch Committee</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
