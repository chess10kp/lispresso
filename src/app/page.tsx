"use client";

import Image from "next/image";
import Link from "next/link";
import "./page.css";

const terminalBg = "#f7edd9";

import {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";

import { Terminal } from "@/components/Terminal";
import { Logo } from "@/components/Logo";

const NavBar = () => {
  return (
    <NavigationMenu className={`min-w-full bg-[${terminalBg}]`}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink>Link</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default function Home() {
  return (
    <div className="">
      <NavBar />
      <Terminal></Terminal>
      <section className="top">
        <div className="robot"></div>
      </section>

      <section className="about">
        <p> About Lispresso</p>
        <div className="about_us">
          <p>fix this</p>
        </div>
        <div className="rocket"></div>
      </section>
    </div>
  );
}

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
