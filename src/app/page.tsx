"use client";

import Image from "next/image";
import Link from "next/link";
import "./page.css";

const terminalBg = "#f7edd9";

import { DisplayTerminal } from "@/components/DisplayTerminal";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";

import { Terminal } from "@/components/Terminal";
import { Logo } from "@/components/Logo";

import { NavBar } from "@/components/NavBar";
import { Pricing } from "@/components/Pricing";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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
      <About></About>
      <section className="flex">
        <div className="top-[30%] m-auto mb-10 left-[10%]" id="terminal">
          <Terminal />
        </div>
      </section>
      <Contact />
    </div>
  );
}

const Hero = () => {
  return (
    <section className="container mx-10 grid lg:grid-cols-2 place-items-around py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold geo">
          <h1 className="">
            Ditch your unmaintainable{" "}
            <span className="inline geo bg-gradient-to-r from-[#f7edd9]  to-[#00ff26] text-transparent bg-clip-text">
              {" "}
              Java
            </span>{" "}
            codebase
          </h1>{" "}
        </main>

        <p className="text-xl text-black bg-transparent md:w-10/12 mx-auto lg:mx-0">
          Lispresso offers fast, hands-on training to help developers transition
          from Java to Clojure in a week.
        </p>
      </div>
      <HeroCards />
    </section>
  );
};

const HeroCards = () => {
  const clojure = `
  class FibonacciGenerator {
    private long prev;
    private long current;

    public long next() {
        long nextValue = prev;
        long newCurrent = prev + current;
        prev = current;
        current = newCurrent;
        return nextValue;
    }
  }

  (defn fib [n]
    (let [next-fib (fn [[a b]] [b (+ a b)])]
      (->> (iterate next-fib [0 1])
         (map first)
         (take n)))) `;
  return (
    <pre>
      <DisplayTerminal code={clojure} />
    </pre>
  );
};

const About = () => {
  return (
    <section id="about" className="mx-10 py-24 sm:py-32">
      <div className="bg-white border rounded-lg py-12  my-10">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12 ">
          <div className="bg-green-0 flex  flex-col justify-between">
            <div className="pb-6  my-10">
              <p className="text-xl text-muted-foreground bg-transparent mt-4">
                We provide a week-long boot camp to bootstrap your developers to
                get productive with Clojure.
              </p>
              <br />

              <h2 className="text-4xl font-bold">Why Clojure?</h2>
              <ul className="list-none my-4">
                <li className="text-xl text-muted-foreground bg-transparent mt-4">
                  Immutability improves concurrency, reduces the bugs by making
                  code easy to reason with
                </li>

                <li className="text-xl text-muted-foreground bg-transparent mt-4">
                  Function Purity makes debugging easier
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Pricing></Pricing>
    </section>
  );
};

const Contact = () => {
  return (
    <section className=" #f7edd9 contact">
      <Card className="mx-10 bg-[#f7edd9]">
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you as soon as
            possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action="https://api.web3forms.com/submit"
            method="POST"
            className="space-y-4"
          >
            <input
              type="hidden"
              name="access_key"
              value="270c97a3-b276-4de8-a511-00983d2484b7"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>

                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                required
                placeholder="How can we help you?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                placeholder="Tell us about your inquiry..."
                className="min-h-[150px]"
              />
            </div>

            <button type="submit">Submit Form</button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
