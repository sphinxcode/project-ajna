"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, BookOpen, GraduationCap, Sparkles, Heart, Users, Target, Check, X, Quote, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PlacesAutocomplete from "@/components/ui/places-autocomplete";
import { createClient } from "@/lib/supabase/client";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthLocation: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [unknownTime, setUnknownTime] = useState(false);
  const [wantsSignup, setWantsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check for stored chart data after login and calculate chart
  useEffect(() => {
    async function processStoredChartData() {
      const chartDataStr = sessionStorage.getItem("chartFormData");
      if (!chartDataStr) return;

      try {
        // Check if user is authenticated
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return; // User not logged in yet

        // Clear the stored data
        sessionStorage.removeItem("chartFormData");
        sessionStorage.removeItem("signupEmail");
        sessionStorage.removeItem("signupPassword");

        // Parse the stored chart data
        const chartData = JSON.parse(chartDataStr);

        // Convert to API format
        const birthDate = `${chartData.birthYear}-${chartData.birthMonth}-${chartData.birthDay}`;

        // Convert 12-hour time to 24-hour format
        let hour24 = parseInt(chartData.birthHour);
        if (chartData.birthPeriod === 'PM' && hour24 !== 12) {
          hour24 += 12;
        } else if (chartData.birthPeriod === 'AM' && hour24 === 12) {
          hour24 = 0;
        }
        const birthTime = `${hour24.toString().padStart(2, '0')}:${chartData.birthMinute}`;

        // Call calculate API
        setIsLoading(true);
        const response = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            birthDate,
            birthTime,
            birthLocation: chartData.birthLocation
          })
        });

        const result = await response.json();

        if (response.ok && result.chartId) {
          // Redirect to chart page
          window.location.href = `/chart/${result.chartId}`;
        } else {
          alert(result.error || 'Failed to calculate chart. Please try again.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error processing chart:', error);
        alert('An error occurred. Please try generating your chart again.');
        setIsLoading(false);
      }
    }

    processStoredChartData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert date and time to the format expected by the API
      const [year, month, day] = formData.birthDate.split('-');
      const [hour24, minute] = formData.birthTime.split(':');
      const hourNum = parseInt(hour24);
      const period = hourNum >= 12 ? 'PM' : 'AM';
      const hour12 = hourNum > 12 ? (hourNum - 12).toString() : hourNum === 0 ? '12' : hourNum.toString();

      const chartData = {
        name: formData.name,
        email: formData.email,
        birthMonth: month,
        birthDay: day,
        birthYear: year,
        birthHour: hour12,
        birthMinute: minute,
        birthPeriod: period,
        birthLocation: formData.birthLocation,
      };

      if (wantsSignup) {
        // Validate password fields
        if (!formData.password || formData.password.length < 8) {
          alert("Password must be at least 8 characters");
          setIsLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          setIsLoading(false);
          return;
        }

        // Store chart data and redirect to signup with query param
        sessionStorage.setItem("chartFormData", JSON.stringify(chartData));
        sessionStorage.setItem("signupEmail", formData.email);
        sessionStorage.setItem("signupPassword", formData.password);
        window.location.href = "/signup";
      } else {
        // Just generate the chart (user must be logged in)
        // Store form data and redirect to login
        sessionStorage.setItem("chartFormData", JSON.stringify(chartData));
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-gradient-to-r from-orange-50 to-amber-50/80 backdrop-blur-sm border-b border-amber-200/50">
        <div className="container mx-auto flex h-14 items-center justify-center px-4">
          <div className="flex items-center gap-6 text-sm font-medium text-primary/80">
            <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
            <span className="text-amber-300">|</span>
            <Link href="/mission" className="hover:text-primary transition-colors">MISSION</Link>
            <span className="text-amber-300">|</span>
            <Link href="/courses" className="hover:text-primary transition-colors">ENROLLMENT</Link>
            <span className="text-amber-300">|</span>
            <Link href="/free-classes" className="hover:text-primary transition-colors">CLASSES</Link>
            <span className="text-amber-300">|</span>
            <Link href="/about" className="hover:text-primary transition-colors">TOTALHD</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Form First */}
      <section className="relative min-h-[85vh] pt-14 overflow-hidden">
        {/* Hero Background - stretch to fill */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.png"
            alt="Hero Background"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center gap-6">
          {/* Main Form - Generate Chart */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full max-w-2xl"
          >
            <Card className="bg-white/30 backdrop-blur-md border-amber-200 shadow-2xl">
              <CardHeader className="space-y-2 text-center bg-white/0">
                <CardTitle className="text-3xl font-bold text-primary drop-shadow-sm">
                  GENERATE YOUR CHART
                </CardTitle>
                <CardDescription className="text-base leading-relaxed drop-shadow-sm">
                  Enter your birth information to discover your unique Human Design blueprint.
                  Accuracy matters—try to get your exact birth time if possible.
                </CardDescription>
              </CardHeader>

              <CardContent className="bg-white/0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground drop-shadow-sm">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/100 border-amber-200 focus:border-primary"
                      required
                    />
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-sm font-medium text-foreground flex items-center gap-2 drop-shadow-sm">
                      <Calendar className="w-4 h-4 text-accent" />
                      Birth Date
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="bg-white/100 border-amber-200 focus:border-primary"
                      required
                    />
                  </div>

                  {/* Birth Time */}
                  <div className="space-y-2">
                    <Label htmlFor="birthTime" className="text-sm font-medium text-foreground flex items-center gap-2 drop-shadow-sm">
                      <Clock className="w-4 h-4 text-accent" />
                      Birth Time
                    </Label>
                    <Input
                      id="birthTime"
                      type="time"
                      value={formData.birthTime}
                      onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                      disabled={unknownTime}
                      className="bg-white/100 border-amber-200 focus:border-primary disabled:opacity-60"
                      required={!unknownTime}
                    />

                    {/* Unknown Time Checkbox */}
                    <div className="flex items-start gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="unknownTime"
                        checked={unknownTime}
                        onChange={(e) => {
                          setUnknownTime(e.target.checked);
                          if (e.target.checked) {
                            setFormData({ ...formData, birthTime: '12:00' });
                          }
                        }}
                        className="mt-1 rounded border-amber-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="unknownTime" className="text-sm text-white cursor-pointer drop-shadow-sm">
                        I don't know my exact birth time (we'll use 12:00 noon as default)
                      </label>
                    </div>

                    {unknownTime && (
                      <Alert className="mt-2 border-amber-300 bg-amber-50/80 backdrop-blur-sm">
                        <Info className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-sm text-amber-800">
                          Without an exact birth time, your Authority and some other aspects may be less accurate.
                          Your Type and Profile will still be correct. Try to find your birth certificate or hospital records if possible.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Birth Location */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-2 drop-shadow-sm">
                      <MapPin className="w-4 h-4 text-accent" />
                      Birth Location
                    </Label>
                    <PlacesAutocomplete
                      value={formData.birthLocation}
                      onChange={(value) => setFormData({ ...formData, birthLocation: value })}
                      placeholder="City, Country (e.g., Manila, Philippines)"
                      error={false}
                    />
                    <p className="text-xs text-white drop-shadow-sm">
                      Start typing your birth city and select from the dropdown
                    </p>
                  </div>

                  {/* Sign-up Checkbox */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="wantsSignup"
                        checked={wantsSignup}
                        onChange={(e) => setWantsSignup(e.target.checked)}
                        className="mt-1 rounded border-amber-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="wantsSignup" className="text-sm font-medium text-white cursor-pointer drop-shadow-sm">
                        Sign-up for FREE resources
                      </label>
                    </div>

                    {/* Conditional Email/Password Fields */}
                    {wantsSignup && (
                      <div className="space-y-4 pl-6 border-l-2 border-amber-300/50">
                        {/* Email Field */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-foreground drop-shadow-sm">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-white/100 border-amber-200 focus:border-primary"
                            required={wantsSignup}
                          />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium text-foreground drop-shadow-sm">
                            Password
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="At least 8 characters"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="bg-white/100 border-amber-200 focus:border-primary"
                            required={wantsSignup}
                            minLength={8}
                          />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground drop-shadow-sm">
                            Confirm Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="bg-white/100 border-amber-200 focus:border-primary"
                            required={wantsSignup}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Processing...
                      </>
                    ) : (
                      "View My Chart"
                    )}
                  </Button>

                  {/* Sign-in Link */}
                  <p className="text-sm text-center text-foreground/70">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Logo + Mission Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        {/* hd-bg-transparent.png Background - transparent PNG over white */}
        <div className="absolute inset-0">
          <Image
            src="/hd-bg-transparent.png"
            alt="Background"
            fill
            className="object-cover md:object-contain"
            priority
            sizes="100vw"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col items-center gap-8 max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp}>
              <Image
                src="/school-logo.png"
                alt="School of Total Human Design"
                width={400}
                height={400}
                className="mx-auto"
              />
            </motion.div>

            <motion.p variants={fadeInUp} className="text-lg text-foreground/80 leading-relaxed">
              Making <span className="font-accent italic text-primary">Human Design</span> accessible, practical, and culturally relevant
              for Filipinos navigating family pressures, work demands, money wounds, and the collective conditioning
              that success has a template.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-8">
                <BookOpen className="mr-2 h-5 w-5" />
                BOOK A CONSULTATION
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary/10">
                <GraduationCap className="mr-2 h-5 w-5" />
                APPLY FOR SCHOLARSHIP
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Today's Gate - Daily Transit */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <span className="text-accent font-medium uppercase tracking-wide">Daily Transit</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
                Today's Gate
              </h2>
              <p className="text-foreground/70">
                The cosmic weather changes daily. Here's what's activating the collective consciousness right now.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-accent/20">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Hexagram Visual */}
                    <div className="w-48 h-48 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="text-6xl font-bold text-primary">☰</div>
                    </div>

                    {/* Gate Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">
                          Gate 1 - The Creative
                        </h3>
                        <p className="text-accent font-medium">Sun Transit • December 5, 2025</p>
                      </div>
                      <p className="text-foreground/80 leading-relaxed">
                        The power of self-expression and creativity. This is the energy of being yourself,
                        expressing your unique truth, and having the courage to be different. When the sun
                        transits this gate, we all feel the collective invitation to step into our authentic power.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <Calendar className="w-4 h-4" />
                        <span>Updates daily at midnight</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Filipinos Need This */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                Why Filipinos Need to Learn This 2026?
              </h2>
              <p className="text-2xl font-accent italic text-accent">Human Design</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6 text-lg text-foreground/80 leading-relaxed">
              <p>
                Most Filipinos spent their whole life trying to prove they're <span className="font-accent italic text-primary">worthy</span>—working overtime, saying yes to everyone, sacrificing your rest for their approval. But <span className="font-accent italic text-primary">'sipag at tiyaga'</span> was never our problem. Our Filipino <span className="font-accent italic text-primary">resilience</span> became our cage. And we've been running the wrong race. Human Design shows you the game you were actually meant to play, where your energy finally makes sense and exhaustion isn't the price of success.
              </p>

              <p className="font-bold text-foreground mt-8">
                One path: Keep doing what you've been doing. Keep forcing. Keep exhausting yourself. Keep wondering why you can't just be like everyone else. Keep sacrificing your truth for approval. Keep waiting for "someday" to finally rest.
              </p>

              <p className="font-bold text-foreground">
                The other path: Trust that there's another way. Commit to one year of guided deconditioning. Learn the complete system in the correct sequence with a proper support system and guidance. Heal your cultural wounds. Prepare for the shift ahead.
              </p>

              <p className="text-xl font-bold text-primary text-center my-8">
                Both paths are hard.
              </p>

              <p className="text-center">
                One is the hard of <span className="font-accent italic text-primary">slow suffocation</span>. The other is the hard of <span className="font-accent italic text-primary">sacred transformation</span>.
              </p>

              <p className="text-center font-bold text-foreground text-xl mt-8">
                Which hard do you choose?
              </p>

              <p className="text-center text-accent font-medium text-lg mt-6">
                You're standing at a crossroads right now.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HD vs Personality Tests */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <span className="text-accent font-medium uppercase tracking-wide">The Difference</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
                Human Design vs Personality Tests
              </h2>
              <p className="text-foreground/70">
                Why Human Design goes deeper than Myers-Briggs, Enneagram, or any other typing system.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-card">
                <CardContent className="p-6 md:p-8">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4 font-semibold text-foreground/80">Feature</th>
                          <th className="text-center p-4 font-semibold text-foreground/80">Personality Tests</th>
                          <th className="text-center p-4 font-semibold text-primary">Human Design</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { feature: "Based on", personality: "Self-reported answers", hd: "Birth data (time, date, location)" },
                          { feature: "Accuracy", personality: "Changes with mood/age", hd: "Fixed at birth, unchanging" },
                          { feature: "Decision Making", personality: "Thinking/Feeling preference", hd: "Body-based Authority system" },
                          { feature: "Purpose", personality: "Categorizes who you are", hd: "Maps your unique mechanics" },
                          { feature: "Cultural Context", personality: "Western psychology", hd: "Ancient wisdom + modern science" },
                          { feature: "Transformation", personality: "Self-improvement tips", hd: "7-year deconditioning process" },
                        ].map((row, index) => (
                          <tr key={index} className="border-b border-border/50">
                            <td className="p-4 font-medium text-foreground">{row.feature}</td>
                            <td className="p-4 text-center text-foreground/60">
                              <div className="flex items-center justify-center gap-2">
                                <X className="w-4 h-4 text-red-500" />
                                <span className="text-sm">{row.personality}</span>
                              </div>
                            </td>
                            <td className="p-4 text-center text-primary">
                              <div className="flex items-center justify-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium">{row.hd}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Visual Journey Preview */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <span className="text-accent font-medium uppercase tracking-wide">Your Transformation</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
                The 44-Week Deconditioning Journey
              </h2>
              <p className="text-foreground/70">
                Ra Uru Hu's original sequence: form first, then function. We start with the body, not the mind.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="space-y-4">
              {[
                { phase: "Weeks 1-6", title: "Ancient Foundations", description: "I-Ching, Hexagrams, and the roots of the system" },
                { phase: "Weeks 7-18", title: "Nourishing Your Vehicle", description: "Determination (Diet) & Environment alignment" },
                { phase: "Weeks 19-26", title: "Clearing Your Vision", description: "Perspective & Motivation discovery" },
                { phase: "Weeks 27-36", title: "Learning Your Mechanics", description: "Type, Strategy & Authority mastery" },
                { phase: "Weeks 37-40", title: "Cultural Healing", description: "Deconditioning Filipino patterns" },
                { phase: "Weeks 41-44", title: "Integration & 2027", description: "Living your design in the modern world" },
              ].map((item, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="bg-card hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                          <span className="font-bold text-accent">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-medium text-accent">{item.phase}</span>
                            <span className="text-lg font-bold text-primary">{item.title}</span>
                          </div>
                          <p className="text-sm text-foreground/70">{item.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-foreground/30 group-hover:text-accent transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <span className="text-accent font-medium uppercase tracking-wide">Transformations</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
                Real Filipino Stories
              </h2>
            </motion.div>

            <motion.div variants={stagger} className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: "Maria Santos",
                  type: "Emotional Projector 4/6",
                  quote: "Learning my Authority saved my relationships. I stopped making decisions when I was upset and started waiting for emotional clarity. My family finally understands why I need time.",
                  location: "Manila",
                },
                {
                  name: "Juan Dela Cruz",
                  type: "Sacral Generator 5/1",
                  quote: "I thought I was lazy because I couldn't force myself to do things. Turns out I'm designed to respond, not initiate. Now I wait for the right invitations and my business is thriving.",
                  location: "Cebu",
                },
              ].map((testimonial, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full bg-card">
                    <CardContent className="p-6">
                      <Quote className="w-8 h-8 text-accent/30 mb-4" />
                      <p className="text-foreground/80 italic mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-accent">{testimonial.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-primary">{testimonial.name}</p>
                          <p className="text-sm text-foreground/60">{testimonial.type} • {testimonial.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA - Gene Keys Style */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Begin Your Human Design Journey
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-foreground/70 mb-8 leading-relaxed">
              Prepare yourself for a journey full of surprises, adventures, and weekly inspiration.
              Together with your Human Design chart, our 44-week program is a means of unlocking
              the enormous potential of your life.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-8">
                <BookOpen className="mr-2 h-5 w-5" />
                Learn More
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary/10">
                Register Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-background/70 text-sm">
                <li><Link href="/chart">Free Chart</Link></li>
                <li><Link href="/courses">Courses</Link></li>
                <li><Link href="/booking">Book a Reading</Link></li>
                <li><Link href="/about">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-background/70 text-sm">
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Stay Connected</h4>
              <p className="text-background/70 text-sm mb-4">
                Get weekly insights on Human Design and Filipino deconditioning.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button variant="secondary" size="sm">Join</Button>
              </div>
            </div>
          </div>
          <Separator className="bg-background/20 mb-6" />
          <div className="text-center text-background/50 text-sm">
            <p>&copy; {new Date().getFullYear()} Total Human Design. All rights reserved.</p>
            <p className="mt-2">Founded by Audrey, Mental Projector 1/3 • Guided by Ra Uru Hu's original teachings</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
