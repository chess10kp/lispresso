"use client";

import Image from "next/image";
import Link from "next/link";
import "./page.css";

const terminalBg = "#f7edd9";

import { Button, buttonVariants } from "@/components/ui/button";
import { DisplayTerminal } from "@/components/DisplayTerminal";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";

import { Terminal } from "@/components/Terminal";
import { Logo } from "@/components/Logo";

import { NavBar } from "@/components/NavBar";

// #26292a
// #00ff26
// #85ba38
// #f59b14
// #2d0230
// #f7edd9

export default function Home() {
  return (
    <div className="body flex flex-col min-w-full min-h-screen">
      <NavBar />
      <Hero></Hero>
      <section className="relative">
        <div className="absolute top-[30%] left-[10%]" id="terminal">
          <Terminal />
        </div>
      </section>
      <section>
        <About></About>
      </section>
    </div>
  );
}

const Hero = () => {
  return (
    <section className="container mx-10 grid lg:grid-cols-2 place-items-around py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold geo">
          <h1 className="">
            Leverage the{" "}
            <span className="inline geo bg-gradient-to-r from-[#f7edd9]  to-[#00ff26] text-transparent bg-clip-text">
              JVM
            </span>{" "}
            to write clean, maintainable code
          </h1>{" "}
        </main>

        <p className="text-xl text-muted-foreground bg-transparent md:w-10/12 mx-auto lg:mx-0">
          Clojure lessons so you get productive with Clojure in just 3 days
        </p>
      </div>
      <HeroCards />
    </section>
  );
};

const HeroCards = () => {
  const clojure = `
(defn fib [n]
  (let [next-fib (fn [[a b]] [b (+ a b)])]
    (->> (iterate next-fib [0 1])
         (map first)
         (take n))))
`;
  return (
    <pre>
      <DisplayTerminal code={clojure} />
    </pre>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img alt="" className="w-[300px] object-contain rounded-lg" />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Company
              </h2>
              <p className="text-xl text-muted-foreground bg-transparent mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <>
      <section className="contact">
        <div className="contact_us">
          <p>Contact us</p>
          <div className="one">
            <p>Name</p>
          </div>
          <div className="two">
            <p>email or phone</p>
          </div>
          <div className="three">
            <p>Message</p>
          </div>
          <form action="https://api.web3forms.com/submit" method="POST">
            <Input
              type="hidden"
              name="access_key"
              value="YOUR_ACCESS_KEY_HERE"
            />

            <Input type="text" name="name" required />
            <Input type="email" name="email" required />
            <textarea name="message" required></textarea>

            <Input
              type="checkbox"
              name="botcheck"
              className="hidden"
              // style="display: none"
            />

            <button type="submit">Submit Form</button>
          </form>
          <form method="POST" id="form">
            <Input
              type="hidden"
              name="access_key"
              value="270c97a3-b276-4de8-a511-00983d2484b7"
            />

            <Input type="text" name="name" required />
            <Input type="email" name="email" required />
            <Textarea name="message" required></Textarea>
            <Input
              type="checkbox"
              name="botcheck"
              className="hidden"
              // style="display: none"
            />

            <button type="submit">Submit Form</button>

            <div id="result"></div>
          </form>
        </div>
      </section>
      <section>
        <Meetus />
      </section>
    </>
  );
};

const Meetus = () => {
  return (
    <div className="team">
      <p>Meet our team</p>
      <div className="nitin">
        <p>Nitin Madhu</p>
        <img src="/nitin-min.jpg" />
        <p>Lispresso, Co-founder</p>
      </div>
      <div className="maria">
        <p>Maria Endrasik</p>
        <img src="/maria.png" />
        <p>Lispresso, Co-founder</p>
      </div>
    </div>
  );
};
