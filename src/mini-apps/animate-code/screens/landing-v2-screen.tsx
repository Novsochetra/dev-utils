import { motion } from "framer-motion";
import { Button } from "@/vendor/shadcn/components/ui/button";
import { Input } from "@/vendor/shadcn/components/ui/input";
import { useState } from "react";
import { useSetAtom } from "jotai";

export default function LandingV2Screen() {
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbwL3Fa_tY1QiJhAwhlOxI5BXqSjeh0Jbb5ZryT-ig0Gi9meRDAAqZOwR3aZF55tfx7j/exec",
        {
          method: "POST",
          body: new URLSearchParams({ email }),
        },
      );
      if (res.ok) {
        setSuccess(true);
        setEmail("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* Background */}
      <img
        src="/animate-code/background.svg"
        className="w-full h-full object-cover absolute top-0 left-0 -z-10"
      />

      {/* Navbar */}
      <div className="h-20 w-full flex items-center p-4 md:p-8">
        <img
          src="/animate-code/logo.png"
          className="w-8 md:w-10 aspect-square border-2 border-white rounded-md overflow-hidden mr-2 md:mr-4"
        />
        <span className="visible sm:hidden text-xl md:text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] cursor-pointer">
          Motion Code
        </span>

        <motion.p
          className="px-3 py-1 text-xs font-bold text-white bg-indigo-500 rounded-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Beta
        </motion.p>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] p-4 md:p-8 text-white text-center">
        <motion.h1
          className="hidden sm:block text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-[0_0_12px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{
            scale: 1.1,
            rotateZ: [0, 5, -5, 3, -3, 0], // shakes back and forth
          }}
        >
          Motion Code
        </motion.h1>

        {/* Animated Paragraph */}
        <motion.p
          className="text-sm sm:text-base md:text-lg mb-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          Bring your code presentations to life.
          <br />
          <span className="font-extrabold italic">Animate line by line</span>,
          syntax highlight, and make tutorials easy to follow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 mb-4 border-2 border-white"
            asChild
          >
            <a href="#" target="_blank" rel="noopener noreferrer">
              Demo
            </a>
          </Button>
        </motion.div>

        {/* Demo Video */}
        <div className="mb-6 w-full max-w-4xl aspect-video md:h-2/5 h-[30vh] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <video
            src="/demo.mp4"
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* Email Signup */}
        <section id="signup" className="w-full max-w-xl">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 justify-center"
          >
            <Input
              type="email"
              placeholder="Enter your email for early access"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Join Beta
            </Button>
          </form>
          {success && (
            <p className="text-green-400 mt-4 text-center font-medium">
              🎉 Thanks! You're signed up for updates.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
