"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Lenis from "lenis";
// import emailjs from "@emailjs/browser";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Code2,
  Droplets,
  Gamepad2,
  Gauge,
  Globe,
  Layers3,
  Mail,
  MapPin,
  PenTool,
  Phone,
  Scan,
  Send,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";

import { Hero } from "./Hero";
import { Navbar } from "./Navbar";

// EmailJS type declaration
declare global {
  interface Window {
    emailjs?: {
      send: (serviceID: string, templateID: string, templateParams: Record<string, string>, publicKey: string) => Promise<{ status: number; text: string }>;
      init: (publicKey: string) => void;
    };
  }
}

type Stage = "landing" | "transition" | "main";

type Project = {
  title: string;
  category: string;
  description: string;
  stack: string[];
  outcome: string;
  icon: typeof Code2;
  color: string;
  gradient: string;
};

const projects: Project[] = [
  {
    title: "Student Information System",
    category: "Web Platform",
    description: "Website for managing student records, grades, and academic data with an intuitive dashboard for teachers and students.",
    stack: ["React", "JavaScript", "Node.js", "MongoDB"],
    outcome: "Streamlined academic record management",
    icon: BookOpen,
    color: "#8b5cf6",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
  {
    title: "Automatic Egg Crack Detection and Sorting System",
    category: "Automation",
    description: "Automated system using sensors and machine vision for detecting egg quality and sorting based on crack detection.",
    stack: ["Arduino", "Python", "Computer Vision", "Machine Learning"],
    outcome: "Automated quality control system",
    icon: Scan,
    color: "#f59e0b",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    title: "Early Flood Detection System",
    category: "Environmental Tech",
    description: "Real-time flood monitoring system using water level sensors and alerts to prevent disasters.",
    stack: ["Arduino", "IoT", "Sensors", "GSM Module"],
    outcome: "Early warning disaster prevention",
    icon: Droplets,
    color: "#06b6d4",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
  },
  {
    title: "Smart Trashbin",
    category: "IoT Project",
    description: "Intelligent waste management system with auto-opening lid, fill-level detection, and waste type classification.",
    stack: ["Arduino", "Ultrasonic Sensors", "Servo Motors"],
    outcome: "Smart waste management solution",
    icon: Trash2,
    color: "#10b981",
    gradient: "from-emerald-500/20 via-green-500/10 to-transparent",
  },
  {
    title: "Ph Level Water Monitoring System with Fish Feeder",
    category: "Environmental Tech",
    description: "Monitors water quality and pH levels in aquaculture systems with automatic fish feeding mechanism.",
    stack: ["Arduino", "pH Sensors", "IoT", "Automation"],
    outcome: "Aquaculture health monitoring",
    icon: Gauge,
    color: "#3b82f6",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
  },
];

const socialLinks = [
  {
    label: "Website",
    href: "https://example.com/",
    icon: Globe,
  },
  {
    label: "Email",
    href: "mailto:hello@example.com",
    icon: Mail,
  },
  {
    label: "Connect",
    href: "https://www.linkedin.com/",
    icon: Send,
  },
] as const;

type TechItem = {
  name: string;
  logoSrc: string;
  logoAlt: string;
};

type TechCategory = {
  title: string;
  description: string;
  items: TechItem[];
};

const reactLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100">
  <g clip-path="url(#a)">
    <path fill="#61dafb" d="M50.307 58.816a8.816 8.816 0 1 0 0-17.632 8.816 8.816 0 0 0 0 17.632"/>
    <path stroke="#61dafb" stroke-width="5" d="M50.307 68.063c26.126 0 47.306-8.087 47.306-18.063s-21.18-18.062-47.306-18.062C24.18 31.938 3 40.024 3 50s21.18 18.063 47.307 18.063Z"/>
    <path stroke="#61dafb" stroke-width="5" d="M34.664 59.031C47.727 81.658 65.321 95.957 73.96 90.97c8.64-4.988 5.053-27.374-8.01-50C52.885 18.342 35.291 4.043 26.652 9.03s-5.052 27.374 8.011 50Z"/>
    <path stroke="#61dafb" stroke-width="5" d="M34.664 40.969c-13.063 22.626-16.65 45.012-8.01 50 8.638 4.988 26.232-9.311 39.295-31.938s16.65-45.012 8.01-50c-8.638-4.988-26.232 9.311-39.295 31.938Z"/>
  </g>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M0 0h100v100H0z"/>
    </clipPath>
  </defs>
</svg>
`)}`;

const html5LogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100">
  <path fill="#e44d26" d="M14.021 90.034 6 0h88.187l-8.022 89.985L50.02 100"/>
  <path fill="#f16529" d="M50.093 92.344V7.39h36.048l-6.88 76.811"/>
  <path fill="#ebebeb" d="M22.383 18.4h27.71v11.036H34.488L35.51 40.74h14.584v11.01H25.397zm3.5 38.893h11.084l.778 8.823 12.348 3.306v11.521l-22.654-6.32"/>
  <path fill="#fff" d="M77.706 18.4H50.044v11.036h26.64zm-2.018 22.34H50.044v11.035h13.612l-1.288 14.341-12.324 3.306v11.473l22.606-6.271"/>
</svg>
`)}`;

const javascriptLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100">
  <g clip-path="url(#a)">
    <path fill="#f7df1e" d="M100 0H0v100h100z"/>
    <path fill="#000" d="M67.175 78.125c2.014 3.29 4.634 5.707 9.27 5.707 3.893 0 6.38-1.946 6.38-4.635 0-3.222-2.555-4.364-6.84-6.238l-2.35-1.008c-6.781-2.89-11.286-6.508-11.286-14.159 0-7.047 5.37-12.413 13.762-12.413 5.975 0 10.27 2.08 13.365 7.524l-7.317 4.699c-1.612-2.89-3.35-4.027-6.048-4.027-2.752 0-4.497 1.746-4.497 4.027 0 2.819 1.746 3.96 5.778 5.706l2.35 1.006c7.983 3.424 12.491 6.915 12.491 14.762 0 8.46-6.646 13.096-15.571 13.096-8.727 0-14.365-4.16-17.124-9.61zm-33.196.815c1.477 2.619 2.82 4.833 6.048 4.833 3.087 0 5.035-1.208 5.035-5.905V45.916h9.397v32.08c0 9.73-5.705 14.158-14.032 14.158-7.524 0-11.881-3.894-14.097-8.583z"/>
  </g>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M0 0h100v100H0z"/>
    </clipPath>
  </defs>
</svg>
`)}`;

const css3LogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100">
  <path fill="#264de4" d="m94.175 0-8.033 89.99L50.034 100l-36.01-9.996L6 0z"/>
  <path fill="#2965f1" d="m79.265 84.26 6.865-76.9H50.088v84.988z"/>
  <path fill="#ebebeb" d="m24.396 40.74.99 11.039h24.702V40.74zm25.692-22.342h-27.68l1.003 11.038h26.676zm0 62.495V69.408l-.049.013-12.294-3.32-.786-8.803H25.878l1.547 17.332 22.612 6.277z"/>
  <path fill="#fff" d="m63.642 51.779-1.281 14.316-12.312 3.323v11.484l22.63-6.272.166-1.865 2.594-29.06.27-2.965L77.7 18.398H50.05v11.038h15.555L64.599 40.74H50.05v11.04z"/>
</svg>
`)}`;

const nextjsLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><g fill="#000" clip-path="url(#a)"><path d="M66.477 40.008h17.418v3.215h-6.91v16.914h-3.454V43.223h-7.054zm-28.647 0v3.215H23.87v5.172h11.228v3.215H23.869v5.312H37.83v3.215H20.414V43.223h-.002v-3.215zm8.698.009h-4.521L58.2 60.145h4.535l-8.099-10.057 8.086-10.056-4.522.007-5.827 7.238zm4.64 14.378-2.265-2.816-6.91 8.581h4.535z"/><path fill-rule="evenodd" d="M20.535 60.137 4.319 40H0v20.128h3.455V44.302l12.74 15.835z" clip-rule="evenodd"/><path d="M84.672 60.014a.9.9 0 0 1-.649-.263.85.85 0 0 1-.267-.639.84.84 0 0 1 .267-.63.9.9 0 0 1 .649-.263q.365 0 .636.263a.854.854 0 0 1 .148 1.084.93.93 0 0 1-.335.326.86.86 0 0 1-.45.122m5.898-8.48h1.53v5.899q-.004.812-.348 1.395-.347.584-.965.898-.616.312-1.435.313-.746-.001-1.343-.265a2.16 2.16 0 0 1-.946-.784q-.35-.52-.349-1.294h1.534q.004.34.151.586a1 1 0 0 0 .408.376q.263.13.604.131.37.001.627-.154a1 1 0 0 0 .393-.457q.135-.301.138-.745zm7.83 2.307a1.11 1.11 0 0 0-.487-.835q-.432-.3-1.117-.3-.481.001-.826.143-.345.145-.53.39a.95.95 0 0 0-.186.56q0 .264.124.455.122.195.334.325.211.135.469.224.26.09.52.152l.797.196q.483.11.93.3.447.188.803.475.354.287.562.692t.208.95q.001.738-.382 1.297-.381.557-1.105.872-.719.313-1.744.314c-.66 0-1.236-.102-1.72-.305a2.54 2.54 0 0 1-1.14-.883q-.41-.582-.443-1.416h1.518c.02.29.114.532.273.728q.243.29.63.434.39.143.87.143.503 0 .886-.15.379-.148.594-.417a.98.98 0 0 0 .22-.628.8.8 0 0 0-.194-.544 1.5 1.5 0 0 0-.534-.36 5.5 5.5 0 0 0-.8-.26l-.97-.245q-1.05-.267-1.66-.81-.608-.542-.608-1.444 0-.74.41-1.298.408-.558 1.114-.865.71-.311 1.601-.31.905-.001 1.59.31.685.307 1.074.855.391.547.403 1.255z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 40h100v20.305H0z"/></clipPath></defs></svg>
`)}`;

const nextjsLogoSvgDark = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><g fill="#fff" clip-path="url(#a)"><path d="M66.477 40.008h17.418v3.215h-6.91v16.914h-3.454V43.223h-7.054zm-28.647 0v3.215H23.87v5.172h11.228v3.215H23.869v5.312H37.83v3.215H20.414V43.223h-.002v-3.215zm8.698.009h-4.521L58.2 60.145h4.535l-8.099-10.057 8.086-10.056-4.522.007-5.827 7.238zm4.64 14.378-2.265-2.816-6.91 8.581h4.535z"/><path fill-rule="evenodd" d="M20.535 60.137 4.319 40H0v20.128h3.455V44.302l12.74 15.835z" clip-rule="evenodd"/><path d="M84.672 60.014a.9.9 0 0 1-.649-.263.85.85 0 0 1-.267-.639.84.84 0 0 1 .267-.63.9.9 0 0 1 .649-.263q.365 0 .636.263a.854.854 0 0 1 .148 1.084.93.93 0 0 1-.335.326.86.86 0 0 1-.45.122m5.898-8.48h1.53v5.899q-.004.812-.348 1.395-.347.584-.965.898-.616.312-1.435.313-.746-.001-1.343-.265a2.16 2.16 0 0 1-.946-.784q-.35-.52-.349-1.294h1.534q.004.34.151.586a1 1 0 0 0 .408.376q.263.13.604.131.37.001.627-.154a1 1 0 0 0 .393-.457q.135-.301.138-.745zm7.83 2.307a1.11 1.11 0 0 0-.487-.835q-.432-.3-1.117-.3-.481.001-.826.143-.345.145-.53.39a.95.95 0 0 0-.186.56q0 .264.124.455.122.195.334.325.211.135.469.224.26.09.52.152l.797.196q.483.11.93.3.447.188.803.475.354.287.562.692t.208.95q.001.738-.382 1.297-.381.557-1.105.872-.719.313-1.744.314c-.66 0-1.236-.102-1.72-.305a2.54 2.54 0 0 1-1.14-.883q-.41-.582-.443-1.416h1.518c.02.29.114.532.273.728q.243.29.63.434.39.143.87.143.503 0 .886-.15.379-.148.594-.417a.98.98 0 0 0 .22-.628.8.8 0 0 0-.194-.544 1.5 1.5 0 0 0-.534-.36 5.5 5.5 0 0 0-.8-.26l-.97-.245q-1.05-.267-1.66-.81-.608-.542-.608-1.444 0-.74.41-1.298.408-.558 1.114-.865.71-.311 1.601-.31.905-.001 1.59.31.685.307 1.074.855.391.547.403 1.255z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 40h100v20.305H0z"/></clipPath></defs></svg>
`)}`;

const typescriptLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100">
  <g clip-path="url(#a)">
    <path fill="#017acb" d="M0 0h100v100H0z"/>
    <path fill="#fff" d="M48.016 37.031h4.797v8.282h-12.97v36.843l-.343.094c-.469.125-6.64.125-7.969-.016l-1.062-.093V45.312H17.5v-8.28l4.11-.048c2.25-.03 8.03-.03 12.843 0 4.813.032 10.906.047 13.563.047m36.61 41.219c-1.907 2.016-3.954 3.14-7.36 4.063-1.485.406-1.735.421-5.078.406-3.344-.016-3.61-.016-5.235-.438-4.203-1.078-7.594-3.187-9.906-6.172-.656-.843-1.734-2.593-1.734-2.812 0-.063.156-.203.359-.297s.625-.36.969-.562c.343-.204.968-.579 1.39-.797.422-.22 1.64-.938 2.703-1.579 1.063-.64 2.032-1.156 2.141-1.156.11 0 .313.219.469.485.937 1.578 3.125 3.593 4.672 4.28.953.407 3.062.86 4.078.86.937 0 2.656-.406 3.578-.828.984-.453 1.484-.906 2.078-1.812.406-.641.453-.813.438-2.032 0-1.125-.063-1.437-.375-1.953-.875-1.437-2.063-2.187-6.875-4.312-4.97-2.203-7.204-3.516-9.016-5.282-1.344-1.312-1.61-1.67-2.453-3.312-1.094-2.11-1.235-2.797-1.25-5.937-.016-2.204.031-2.922.265-3.672.329-1.125 1.391-3.297 1.875-3.844 1-1.172 1.36-1.531 2.063-2.11 2.125-1.75 5.438-2.906 8.61-3.015.359 0 1.546.062 2.656.14 3.187.266 5.359 1.047 7.453 2.72 1.578 1.25 3.968 4.187 3.734 4.577-.156.235-6.39 4.391-6.797 4.516-.25.078-.422-.016-.765-.422-2.125-2.547-2.985-3.094-5.047-3.219-1.469-.093-2.25.078-3.235.735-1.03.687-1.53 1.734-1.53 3.187.015 2.125.827 3.125 3.827 4.61 1.938.953 3.594 1.734 3.719 1.734.188 0 4.203 2 5.25 2.625 4.875 2.86 6.86 5.797 7.375 10.86.375 3.812-.703 7.296-3.047 9.765"/>
  </g>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M0 0h100v100H0z"/>
    </clipPath>
  </defs>
</svg>
`)}`;

const vscodeLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100">
  <path fill="#2489ca" d="M.951 35.498s-2.435-1.756.488-4.1l6.81-6.089s1.948-2.05 4.008-.264l62.839 47.576v22.814s-.03 3.582-4.628 3.186z"/>
  <path fill="#1070b3" d="M17.148 50.204.951 64.929s-1.664 1.238 0 3.45l7.52 6.84s1.787 1.919 4.425-.263l17.171-13.02z"/>
  <path fill="#0877b9" d="M45.584 50.325 75.29 27.643l-.193-22.692S73.827 0 69.596 2.577L30.067 38.553z"/>
  <path fill="#3c99d4" d="M70.469 98.652c1.725 1.766 3.815 1.188 3.815 1.188l23.149-11.407c2.963-2.02 2.547-4.526 2.547-4.526V15.79c0-2.994-3.065-4.029-3.065-4.029L76.852 2.09c-4.384-2.71-7.256.487-7.256.487s3.694-2.659 5.5 2.375v90.067c0 .62-.132 1.228-.396 1.776-.527 1.066-1.674 2.06-4.424 1.644z"/>
</svg>
`)}`;

const windsurfLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><g clip-path="url(#a)"><path fill="#000" fill-rule="evenodd" d="M99.051 21.156h-.953a9.07 9.07 0 0 0-9.085 9.07V50.51c0 4.05-3.348 7.332-7.332 7.332-2.367 0-4.73-1.191-6.132-3.191L54.83 25.06a9.18 9.18 0 0 0-7.542-3.92c-4.723 0-8.972 4.015-8.972 8.972v20.401c0 4.05-3.32 7.332-7.332 7.332-2.375 0-4.735-1.192-6.137-3.191L1.664 21.545c-.523-.746-1.699-.378-1.699.535v17.691c0 .895.274 1.762.785 2.496L23.562 74.85c1.348 1.926 3.336 3.355 5.629 3.875 5.738 1.305 11.019-3.113 11.019-8.742v-20.39a7.33 7.33 0 0 1 7.331-7.332h.013a7.49 7.49 0 0 1 6.132 3.192l20.718 29.585c1.722 2.46 4.375 3.921 7.539 3.921 4.828 0 8.964-4.02 8.964-8.972V49.588a7.33 7.33 0 0 1 7.332-7.331h.808c.508 0 .918-.41.918-.918v-19.27a.917.917 0 0 0-.918-.917z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h100v100H0z"/></clipPath></defs></svg>
`)}`;

const windsurfLogoSvgDark = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><g clip-path="url(#a)"><path fill="#fff" fill-rule="evenodd" d="M99.051 21.156h-.953a9.07 9.07 0 0 0-9.085 9.07V50.51c0 4.05-3.348 7.332-7.332 7.332-2.367 0-4.73-1.191-6.132-3.191L54.83 25.06a9.18 9.18 0 0 0-7.542-3.92c-4.723 0-8.972 4.015-8.972 8.972v20.401c0 4.05-3.32 7.332-7.332 7.332-2.375 0-4.735-1.192-6.137-3.191L1.664 21.545c-.523-.746-1.699-.378-1.699.535v17.691c0 .895.274 1.762.785 2.496L23.562 74.85c1.348 1.926 3.336 3.355 5.629 3.875 5.738 1.305 11.019-3.113 11.019-8.742v-20.39a7.33 7.33 0 0 1 7.331-7.332h.013a7.49 7.49 0 0 1 6.132 3.192l20.718 29.585c1.722 2.46 4.375 3.921 7.539 3.921 4.828 0 8.964-4.02 8.964-8.972V49.588a7.33 7.33 0 0 1 7.332-7.331h.808c.508 0 .918-.41.918-.918v-19.27a.917.917 0 0 0-.918-.917z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h100v100H0z"/></clipPath></defs></svg>
`)}`;

const androidStudioLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100">
  <path fill="#3ddb85" d="M73.013 64.093a4.17 4.17 0 0 1-4.164-4.166 4.17 4.17 0 0 1 4.164-4.163 4.17 4.17 0 0 1 4.164 4.163 4.17 4.17 0 0 1-4.164 4.166m-46.026 0a4.17 4.17 0 0 1-4.163-4.166 4.17 4.17 0 0 1 4.163-4.163 4.17 4.17 0 0 1 4.164 4.163 4.17 4.17 0 0 1-4.164 4.166m47.52-25.083 8.321-14.414a1.733 1.733 0 0 0-1.947-2.537 1.73 1.73 0 0 0-1.052.806L71.404 37.46C64.96 34.52 57.723 32.88 50 32.88s-14.96 1.639-21.403 4.58l-8.426-14.596a1.733 1.733 0 0 0-3.172.418c-.119.443-.057.915.173 1.313l8.322 14.414C11.204 46.782 1.43 61.249 0 78.34h100c-1.431-17.09-11.205-31.559-25.494-39.33"/>
</svg>
`)}`;

const arduinoLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg fill="#00878F" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Arduino</title><path d="M18.087 6.146c-.3 0-.607.017-.907.069-2.532.367-4.23 2.239-5.18 3.674-.95-1.435-2.648-3.307-5.18-3.674a6.49 6.49 0 0 0-.907-.069C2.648 6.146 0 8.77 0 12s2.656 5.854 5.913 5.854c.3 0 .607-.017.916-.069 2.531-.376 4.23-2.247 5.18-3.683.949 1.436 2.647 3.307 5.18 3.683.299.043.607.069.915.069C21.344 17.854 24 15.23 24 12s-2.656-5.854-5.913-5.854zM6.53 15.734a3.837 3.837 0 0 1-.625.043c-2.148 0-3.889-1.7-3.889-3.777 0-2.085 1.749-3.777 3.898-3.777.208 0 .416.017.624.043 2.39.35 3.847 2.768 4.347 3.734-.508.974-1.974 3.384-4.355 3.734zm11.558.043c-.208 0-.416-.017-.624-.043-2.39-.35-3.856-2.768-4.347-3.734.491-.966 1.957-3.384 4.347-3.734.208-.026.416-.043.624-.043 2.149 0 3.89 1.7 3.89 3.777 0 2.085-1.75 3.777-3.89 3.777zm1.65-4.404v1.134h-1.205v1.182h-1.156v-1.182H16.17v-1.134h1.206V10.19h1.156v1.183h1.206zM4.246 12.498H7.82v-1.125H4.245v1.125z"/></svg>`)}`;

const tensorflowLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg fill="#FF6F00" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>TensorFlow</title><path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168 3.564.015-5.31zm21.43 5.311l-.014-5.31L12.46 0v24l4.095-2.378V14.87l3.092 1.788-.018-4.618-3.074-1.756V7.603l6.168 3.564z"/></svg>`)}`;

const reactNativeLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#61dafb" d="M29.66 5.418c-1.656.056-3.234.46-4.66 1.281-2.85 1.645-4.552 4.664-5.316 8.237s-.684 7.822.078 12.578c.293 1.834.723 3.762 1.22 5.733-1.955.554-3.84 1.148-5.575 1.81-4.5 1.72-8.219 3.774-10.931 6.223C1.763 43.73 0 46.71 0 50s1.763 6.274 4.476 8.722c2.712 2.45 6.43 4.505 10.93 6.224 1.735.662 3.62 1.255 5.575 1.81-.497 1.971-.926 3.9-1.22 5.732-.762 4.758-.84 9.006-.077 12.578.766 3.574 2.465 6.592 5.315 8.238s6.313 1.61 9.79.484c3.477-1.125 7.117-3.318 10.856-6.356 1.44-1.17 2.896-2.505 4.355-3.922 1.458 1.417 2.914 2.751 4.355 3.922 3.737 3.039 7.376 5.232 10.854 6.357 3.476 1.125 6.941 1.16 9.791-.484 2.85-1.647 4.552-4.665 5.316-8.238s.682-7.822-.08-12.578c-.293-1.834-.721-3.762-1.218-5.733 1.955-.555 3.84-1.148 5.575-1.81 4.5-1.718 8.219-3.773 10.931-6.223 2.713-2.449 4.476-5.432 4.476-8.722 0-3.291-1.763-6.272-4.476-8.72-2.712-2.45-6.431-4.505-10.931-6.223-1.734-.662-3.618-1.257-5.574-1.811.497-1.971.925-3.9 1.22-5.733.761-4.756.84-9.005.076-12.578C79.55 11.362 77.85 8.344 75 6.699s-6.312-1.61-9.79-.484c-3.476 1.125-7.117 3.318-10.855 6.356-1.44 1.172-2.899 2.506-4.357 3.923-1.459-1.416-2.914-2.752-4.355-3.923-3.737-3.038-7.374-5.233-10.85-6.358-1.74-.562-3.476-.851-5.134-.797zm.2 4.332c1.04-.03 2.23.162 3.594.601 2.727.883 5.996 2.79 9.448 5.594 1.33 1.08 2.69 2.33 4.06 3.664-2.863 3.094-5.702 6.612-8.449 10.496-4.736.437-9.203 1.137-13.315 2.07-.468-1.855-.871-3.656-1.143-5.35-.703-4.39-.718-8.175-.118-10.978.599-2.803 1.72-4.506 3.237-5.382.759-.437 1.647-.687 2.686-.715m40.28 0c1.04.029 1.928.277 2.687.715 1.517.875 2.638 2.579 3.237 5.38.6 2.803.586 6.59-.117 10.982-.271 1.692-.674 3.496-1.143 5.349-4.111-.932-8.578-1.633-13.317-2.07-2.746-3.882-5.587-7.401-8.45-10.496 1.37-1.333 2.733-2.584 4.062-3.664 3.452-2.806 6.721-4.709 9.449-5.592 1.363-.44 2.554-.631 3.593-.601zM50 22.73...[truncated for brevity]..."/></svg>`)}`;

const javaLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><g clip-path="url(#a)"><path fill="#5382a1" d="M36.753 77.336s-3.822 2.222 2.72 2.974c7.924.904 11.973.774 20.706-.879 0 0 2.296 1.44 5.502 2.687-19.576 8.39-44.304-.486-28.928-4.782M34.36 66.387s-4.286 3.173 2.26 3.85c8.464.873 15.15.945 26.717-1.283 0 0 1.6 1.622 4.115 2.51-23.668 6.92-50.03.545-33.092-5.077"/><path fill="#e76f00" d="M54.527 47.815c4.823 5.554-1.267 10.551-1.267 10.551s12.247-6.322 6.622-14.24C54.63 36.743 50.6 33.074 72.41 20.425c0 0-34.234 8.55-17.883 27.39"/><path fill="#5382a1" d="M80.418 85.434s2.827 2.33-3.115 4.133c-11.3 3.423-47.03 4.456-56.956.136-3.568-1.552 3.124-3.706 5.228-4.159 2.195-.475 3.45-.387 3.45-.387-3.968-2.795-25.648 5.49-11.012 7.861 39.913 6.473 72.757-2.914 62.405-7.584M38.59 55.044s-18.174 4.317-6.436 5.884c4.956.664 14.837.514 24.04-.258 7.522-.634 15.075-1.983 15.075-1.983s-2.653 1.136-4.571 2.446c-18.457 4.854-54.11 2.596-43.846-2.37 8.68-4.195 15.738-3.72 15.738-3.72m32.603 18.224c18.762-9.75 10.088-19.118 4.033-17.856-1.484.309-2.146.576-2.146.576s.551-.863 1.603-1.236c11.978-4.212 21.19 12.42-3.867 19.007 0 0 .29-.26.377-.491"/><path fill="#e76f00" d="M59.882 0s10.39 10.395-9.855 26.377C33.793 39.2 46.325 46.51 50.02 54.861c-9.476-8.55-16.43-16.077-11.765-23.082C45.103 21.496 64.075 16.51 59.882 0"/><path fill="#5382a1" d="M40.434 99.686c18.009 1.153 45.663-.64 46.318-9.161 0 0-1.26 3.23-14.883 5.796-15.371 2.892-34.329 2.555-45.573.7 0 0 2.302 1.906 14.138 2.665"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h100v100H0z"/></clipPath></defs></svg>`)}`;

const flutterLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#42a5f5" fill-opacity=".8" d="M25.399 65.395 10 49.996 60 0h30.794zm65.395-19.259H60L48.465 57.671l15.399 15.4"/><path fill="#0d47a1" d="M48.465 88.465 60 100h30.794l-26.93-26.93"/><path fill="#42a5f5" d="M33.103 73.078 48.477 57.7l15.375 15.375-15.375 15.379z"/><path fill="url(#a)" d="m48.477 88.453 15.375-15.375 2.146 2.146L50.623 90.6z"/><path fill="url(#b)" d="m48.465 88.465 22.848-7.894-7.449-7.505"/><defs><linearGradient id="a" x1="56.167" x2="58.314" y1="80.763" y2="82.909" gradientUnits="userSpaceOnUse"><stop offset=".2" stop-opacity=".15"/><stop offset=".85" stop-color="#616161" stop-opacity=".01"/></linearGradient><linearGradient id="b" x1="48.471" x2="71.318" y1="80.766" y2="80.766" gradientUnits="userSpaceOnUse"><stop offset=".2" stop-opacity=".55"/><stop offset=".85" stop-color="#616161" stop-opacity=".01"/></linearGradient></defs></svg>`)}`;

const pythonLogoSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100">
  <g clip-path="url(#a)">
    <path fill="url(#b)" d="M49.866 0c-4.08.02-7.973.367-11.4.974C28.368 2.757 26.537 6.49 26.537 13.376v9.092h23.856v3.03h-32.81c-6.934 0-13.005 4.168-14.904 12.098-2.191 9.086-2.288 14.758 0 24.246 1.695 7.063 5.745 12.095 12.68 12.095h8.203v-10.9c0-7.875 6.812-14.82 14.903-14.82h23.83c6.633 0 11.928-5.463 11.928-12.123V13.377c0-6.466-5.455-11.323-11.928-12.402-4.1-.682-8.352-.993-12.43-.974M36.964 7.314c2.464 0 4.477 2.046 4.477 4.562 0 2.505-2.013 4.53-4.477 4.53-2.473 0-4.476-2.025-4.476-4.53-.001-2.516 2.003-4.562 4.476-4.562"/>
    <path fill="url(#c)" d="M77.198 25.498v10.594c0 8.212-6.964 15.125-14.903 15.125h-23.83c-6.527 0-11.928 5.587-11.928 12.124V86.06c0 6.464 5.621 10.268 11.928 12.122 7.551 2.219 14.793 2.621 23.83 0 6.005-1.74 11.927-5.24 11.927-12.122v-9.094H50.394v-3.031h35.758c6.933 0 9.519-4.836 11.93-12.095 2.491-7.473 2.383-14.66 0-24.246-1.714-6.903-4.986-12.097-11.93-12.097zm-13.403 57.53c2.474 0 4.477 2.026 4.477 4.533 0 2.514-2.004 4.56-4.477 4.56-2.464 0-4.476-2.046-4.476-4.56 0-2.507 2.012-4.533 4.476-4.533"/>
  </g>
  <defs>
    <linearGradient id="b" x1="-1.392" x2="53.633" y1="2.844" y2="49.769" gradientUnits="userSpaceOnUse">
      <stop stop-color="#5a9fd4"/>
      <stop offset="1" stop-color="#306998"/>
    </linearGradient>
    <linearGradient id="c" x1="74.335" x2="54.603" y1="78.937" y2="51.265" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffd43b"/>
      <stop offset="1" stop-color="#ffe873"/>
    </linearGradient>
    <clipPath id="a">
      <path fill="#fff" d="M0 0h100v100H0z"/>
    </clipPath>
  </defs>
</svg>
`)}`;

const techStackCategories: TechCategory[] = [
  {
    title: "Web Development",
    description: "Core languages and frameworks I use to build polished web interfaces.",
    items: [
      { name: "HTML5", logoSrc: html5LogoSvg, logoAlt: "HTML5 logo" },
      { name: "CSS3", logoSrc: css3LogoSvg, logoAlt: "CSS3 logo" },
      { name: "JavaScript", logoSrc: javascriptLogoSvg, logoAlt: "JavaScript logo" },
      { name: "React", logoSrc: reactLogoSvg, logoAlt: "React logo" },
      { name: "Next.js", logoSrc: nextjsLogoSvg, logoAlt: "Next.js logo" },
      { name: "TypeScript", logoSrc: typescriptLogoSvg, logoAlt: "TypeScript logo" },
    ],
  },
  {
    title: "Electronics & Robotics",
    description: "Tools and languages I use for embedded systems and intelligent projects.",
    items: [
      { name: "Arduino", logoSrc: arduinoLogoSvg, logoAlt: "Arduino logo" },
      { name: "Machine Learning", logoSrc: tensorflowLogoSvg, logoAlt: "TensorFlow logo for machine learning" },
      { name: "Python", logoSrc: pythonLogoSvg, logoAlt: "Python logo" },
    ],
  },
  {
    title: "IDE",
    description: "The editors and development tools I rely on every day.",
    items: [
      { name: "VS Code", logoSrc: vscodeLogoSvg, logoAlt: "Visual Studio Code logo" },
      { name: "Windsurf", logoSrc: windsurfLogoSvg, logoAlt: "Windsurf logo" },
      { name: "Arduino IDE", logoSrc: arduinoLogoSvg, logoAlt: "Arduino IDE logo" },
      { name: "Android Studio", logoSrc: androidStudioLogoSvg, logoAlt: "Android Studio logo" },
    ],
  },
  {
    title: "Mobile Development",
    description: "Frameworks and languages I use when building mobile experiences.",
    items: [
      { name: "React Native", logoSrc: reactNativeLogoSvg, logoAlt: "React Native logo" },
      { name: "Java", logoSrc: javaLogoSvg, logoAlt: "Java logo" },
      { name: "Flutter", logoSrc: flutterLogoSvg, logoAlt: "Flutter logo" },
    ],
  },
];

const loadingAnimationDuration = 2300;
const loadingHoldDuration = 1000;
const loadingTransitionDuration = loadingAnimationDuration + loadingHoldDuration;

export function PortfolioExperience() {
  const [stage, setStage] = useState<Stage>("landing");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const loadingAnimationRef = useRef<number | null>(null);
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  // Scroll progress bar scale
  const scrollProgressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Navbar hide/show on scroll - only hides when scrolling down, shows immediately when scrolling up
  useEffect(() => {
    let prevScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - prevScrollY;

      // Scrolling UP - always show immediately
      if (scrollDelta < -3) {
        setIsNavbarVisible(true);
      }
      // Scrolling DOWN - hide if past 50px from top
      else if (scrollDelta > 3 && currentScrollY > 50) {
        setIsNavbarVisible(false);
      }

      prevScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const floatSlow = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -96]);
  const floatFast = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 140]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 0.95,
    });

    lenisRef.current = lenis;

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = stage === "main" ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [stage]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      if (loadingAnimationRef.current) {
        window.cancelAnimationFrame(loadingAnimationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (stage !== "transition") {
      return;
    }

    const startedAt = performance.now();

    const animateProgress = (time: number) => {
      const elapsed = time - startedAt;
      const nextProgress = Math.min(100, (elapsed / loadingAnimationDuration) * 100);

      setLoadingProgress(nextProgress);

      if (nextProgress < 100) {
        loadingAnimationRef.current = window.requestAnimationFrame(animateProgress);
      }
    };

    loadingAnimationRef.current = window.requestAnimationFrame(animateProgress);

    return () => {
      if (loadingAnimationRef.current) {
        window.cancelAnimationFrame(loadingAnimationRef.current);
      }
    };
  }, [stage]);

  const handleExplore = () => {
    if (stage !== "landing") {
      return;
    }

    setLoadingProgress(0);
    setStage("transition");

    transitionTimeoutRef.current = window.setTimeout(() => {
      setStage("main");
      window.requestAnimationFrame(() => {
        lenisRef.current?.scrollTo(0, { immediate: true });
      });
    }, loadingTransitionDuration);
  };

  const handleReturnHome = () => {
    window.location.href = "/";
  };

  const scrollToSection = (id: string) => {
    const lenis = lenisRef.current;
    const target = document.getElementById(id);

    if (id === "home") {
      lenis?.scrollTo(0, {
        immediate: false,
      });
      return;
    }

    if (lenis && target) {
      // Calculate center position
      const targetRect = target.getBoundingClientRect();
      const targetCenter = targetRect.top + targetRect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const offset = targetCenter - viewportCenter;
      const currentScroll = window.scrollY;
      const scrollTo = currentScroll + offset - 80; // -80 for navbar space

      lenis.scrollTo(scrollTo > 0 ? scrollTo : targetRect.top + window.scrollY - 104, {
        duration: 1.2,
      });
      return;
    }

    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [contactError, setContactError] = useState<string>("");

  // Helper to load EmailJS SDK from CDN
  const loadEmailJS = (): Promise<NonNullable<typeof window.emailjs>> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Window not available"));
        return;
      }
      
      if (window.emailjs) {
        resolve(window.emailjs);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
      script.async = true;
      script.onload = () => {
        if (window.emailjs) {
          resolve(window.emailjs);
        } else {
          reject(new Error("EmailJS failed to load"));
        }
      };
      script.onerror = () => reject(new Error("Failed to load EmailJS"));
      document.head.appendChild(script);
    });
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus("loading");
    setContactError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    // Validate
    if (!name || !email || !message) {
      setContactStatus("error");
      setContactError("Please fill in all fields.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setContactStatus("error");
      setContactError("Please enter a valid email address.");
      return;
    }

    // Store form reference before async operations
    const form = event.currentTarget;

    try {
      // EmailJS configuration - using the provided service ID
      // You'll need to set up a template in EmailJS dashboard
      const serviceID = "service_vbj2e3b";
      const templateID = "template_contact_form"; // You'll create this in EmailJS
      const publicKey = "17_4cYrourxBvKEeh"; // Get this from EmailJS dashboard

      const templateParams = {
        user_name: name,
        user_email: email,
        message: message,
      };

      // Use EmailJS SDK via CDN
      const emailjs = await loadEmailJS();
      
      const response = await emailjs.send(serviceID, templateID, templateParams, publicKey);
      
      if (response.status !== 200) {
        throw new Error("Failed to send message");
      }

      setContactStatus("success");
      // Reset form
      form.reset();
    } catch (error) {
      setContactStatus("error");
      setContactError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {stage !== "main" ? (
        <motion.div key="landing" className="relative min-h-screen overflow-hidden">
          <Hero
            onExplore={handleExplore}
            isTransitioning={stage === "transition"}
          />

          <AnimatePresence>
            {stage === "transition" ? (
              <motion.div
                key="transition"
                className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#081423_0%,#06111f_55%,#040b14_100%)] px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="w-full max-w-5xl">
                  <div className="relative h-7 overflow-visible rounded-full border border-white/10 bg-white/10 shadow-[0_0_50px_rgba(79,140,255,0.28)] backdrop-blur-sm">
                    <motion.div
                      className="h-full origin-left rounded-full bg-gradient-to-r from-[#2d65ff] via-[#5f92ff] to-[#9fb8ff]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 2.3, ease: "easeInOut" }}
                    />

                    <motion.div
                      className="pointer-events-none absolute -top-16 -translate-x-1/2 rounded-full border border-white/15 bg-[rgba(6,17,31,0.72)] px-5 py-2.5 text-2xl font-semibold tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl md:text-3xl"
                      style={{ left: `clamp(1.75rem, ${loadingProgress}%, calc(100% - 1.75rem))` }}
                      animate={
                        loadingProgress >= 100
                          ? { scale: [1, 1.14, 1], y: [0, -10, 0] }
                          : { scale: 1, y: 0 }
                      }
                      transition={
                        loadingProgress >= 100
                          ? {
                            duration: 0.7,
                            ease: [0.2, 1, 0.3, 1],
                            repeat: Math.max(1, Math.floor(loadingHoldDuration / 700)),
                            repeatType: "mirror",
                          }
                          : { duration: 0.2, ease: "easeOut" }
                      }
                    >
                      {Math.round(loadingProgress)}%
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          key="main"
          className="relative min-h-screen overflow-x-hidden"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Scroll Progress Bar */}
          <motion.div
            className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-violet-500 via-accent to-cyan-500"
            style={{ scaleX: scrollProgressScale }}
          />

          <Navbar
            onNavigate={scrollToSection}
            onReturnHome={handleReturnHome}
            isVisible={isNavbarVisible}
            activeSection=""
          />

          <main className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
            {/* Global ambient background gradients */}
            <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
              {/* Top-left violet glow */}
              <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
              {/* Top-right cyan glow */}
              <div className="absolute -right-32 top-[200px] h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px]" />
              {/* Middle amber glow */}
              <div className="absolute left-1/3 top-[600px] h-[350px] w-[350px] rounded-full bg-amber-500/10 blur-[90px]" />
              {/* Bottom-right emerald glow */}
              <div className="absolute bottom-[400px] -right-20 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[100px]" />
              {/* Bottom-left blue glow */}
              <div className="absolute bottom-[200px] -left-20 h-[350px] w-[350px] rounded-full bg-blue-600/10 blur-[90px]" />
            </div>

            <motion.div
              className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
              style={{ y: floatSlow }}
            />
            <motion.div
              className="pointer-events-none absolute right-0 top-48 -z-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"
              style={{ y: floatFast }}
            />

            <section id="about" className="scroll-mt-20 sm:scroll-mt-28">
              <motion.div
                className="grid gap-8 overflow-hidden rounded-[2.5rem] border border-border bg-surface/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr] lg:p-8"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="flex flex-col gap-8 lg:pr-2">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 text-xs uppercase tracking-[0.35em] text-muted">
                    About Me
                  </span>

                  <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.35rem] lg:leading-[1.02]">
                    Hi! I&apos;m Benkhair Najir, a Computer Engineer and Web Developer
                  </h2>

                  <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                    Computer Engineer passionate about robotics and building meaningful digital solutions. I focus on clean code and solving real world problems.
                    I enjoy turning ideas into practical systems that are both efficient and impactful.
                  </p>
                </div>

                <div className="flex flex-col gap-4 lg:sticky lg:top-24">
                  <motion.div
                    className="relative overflow-hidden rounded-[2rem] border border-border bg-background/50 shadow-2xl shadow-black/15"
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(89,132,255,0.28),transparent_60%)]" />

                    <div className="relative aspect-[0.85] sm:aspect-[0.9] w-full overflow-hidden rounded-[2rem] min-h-[280px] sm:min-h-[340px] md:min-h-[380px]">
                      <Image
                        src="/BENKHAIR%20NAJIR.jpg"
                        alt="BENKHAIR NAJIR"
                        fill
                        priority
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="mt-6 rounded-[2rem] border border-border bg-background/45 p-5 shadow-xl shadow-black/10 backdrop-blur-xl"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, delay: 0.12 }}
              >
                <div className="flex flex-col gap-2 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent">
                      Personal Details
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                      Contact and personal information
                    </h3>
                  </div>

                </div>

                <div className="mt-5 grid items-stretch gap-3 sm:grid-cols-2 sm:auto-rows-fr xl:grid-cols-3">
                  {[
                    {
                      icon: Mail,
                      label: "Email",
                      value: "benkhairnajir2001@gmail.com",
                      href: "mailto:benkhairnajir2001@gmail.com",
                    },
                    {
                      icon: Phone,
                      label: "Contact",
                      value: "+63 955 890 3235",
                      href: "tel:+639558903235",
                    },
                    {
                      icon: MapPin,
                      label: "Location",
                      value: "Talon-talon, Zamboanga City, Philippines",
                    },
                    { icon: Calendar, label: "Age", value: "24 years old" },
                    {
                      icon: Gamepad2,
                      label: "Hobbies",
                      value: "Streaming online games and watching anime",
                    },
                    {
                      icon: PenTool,
                      label: "Other skills",
                      value: "Interior formatting design using Adobe InDesign",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    const content = (
                      <div className="flex h-full min-h-[112px] items-start gap-3 rounded-2xl border border-border/70 bg-surface/55 p-4 transition duration-300 hover:border-accent/30 hover:bg-surface/80">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent shadow-inner shadow-black/10">
                          <Icon className="h-4.5 w-4.5" />
                        </span>

                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
                            {item.label}
                          </p>
                          <p className="mt-2 text-sm leading-6 font-medium text-foreground">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );

                    return item.href ? (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block h-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/40"
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={item.label} className="h-full">
                        {content}
                      </div>
                    );
                  })}
                </div>

              </motion.div>
            </section>

            <section id="tech-stack" className="scroll-mt-20 sm:scroll-mt-28">
              <motion.div
                  className="mt-6 rounded-[2rem] border border-border bg-background/45 p-5 shadow-xl shadow-black/10 backdrop-blur-xl"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.65, delay: 0.08 }}
                >
                  <div className="flex flex-col gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent">
                        Tech Stack
                      </p>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                        Tools, platforms, and technologies I work with
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  {techStackCategories.map((category) => (
                    <div
                      key={category.title}
                      className="flex h-full min-h-[320px] flex-col rounded-[1.75rem] border border-border/70 bg-surface/55 p-5"
                    >
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted">
                          {category.title}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-muted">
                          {category.description}
                        </p>
                      </div>

                      <div className="mt-5 grid flex-1 auto-rows-fr gap-3 sm:grid-cols-2">
                        {category.items.map((item, index) => {
                          const isCenteredLastItem =
                            (category.title === "Electronics & Robotics" ||
                              category.title === "Mobile Development") &&
                            category.items.length % 2 === 1 &&
                            index === category.items.length - 1;

                          return (
                          <div
                            key={item.name}
                            className={`flex h-full min-h-[78px] items-center gap-3 rounded-2xl border border-border/70 bg-background/85 px-3 py-3 shadow-sm transition duration-300 hover:border-accent/30 hover:bg-surface/80 ${isCenteredLastItem ? "sm:col-span-2 sm:w-full sm:max-w-[calc(50%-0.375rem)] sm:justify-self-center" : ""}`}
                          >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-background/90 p-2 shadow-sm ring-1 ring-white/5">
                              {item.name === "Windsurf" ? (
                                <>
                                  <Image
                                    src={windsurfLogoSvg}
                                    alt={item.logoAlt}
                                    width={24}
                                    height={24}
                                    className="h-6 w-6 object-contain dark:hidden"
                                  />
                                  <Image
                                    src={windsurfLogoSvgDark}
                                    alt={item.logoAlt}
                                    width={24}
                                    height={24}
                                    className="hidden h-6 w-6 object-contain dark:block"
                                  />
                                </>
                              ) : item.name === "Next.js" ? (
                                <>
                                  <Image
                                    src={nextjsLogoSvg}
                                    alt={item.logoAlt}
                                    width={24}
                                    height={24}
                                    className="h-6 w-6 object-contain dark:hidden"
                                  />
                                  <Image
                                    src={nextjsLogoSvgDark}
                                    alt={item.logoAlt}
                                    width={24}
                                    height={24}
                                    className="hidden h-6 w-6 object-contain dark:block"
                                  />
                                </>
                              ) : (
                                <Image
                                  src={item.logoSrc}
                                  alt={item.logoAlt}
                                  width={24}
                                  height={24}
                                  className="h-6 w-6 object-contain"
                                />
                              )}
                            </span>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">{item.name}</p>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            <section id="projects" className="scroll-mt-20 sm:scroll-mt-28 pt-16 sm:pt-20 lg:pt-24">
              {/* Background decorations */}
              <div className="absolute left-1/4 top-[2000px] h-96 w-96 rounded-full bg-violet-500/10 blur-[100px]" />
              <div className="absolute right-1/4 top-[2200px] h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />
              <div className="absolute left-1/2 top-[2400px] h-80 w-80 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[100px]" />

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <motion.span
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 text-xs uppercase tracking-[0.35em] text-muted"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Layers3 className="h-3.5 w-3.5 text-accent" />
                    Project Showcase
                  </motion.span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
                    Featured Projects
                  </h2>
                </div>

                {/* 3D Carousel with Floating Animation */}
                <div className="relative mt-8 sm:mt-12 h-[380px] sm:h-[450px] lg:h-[520px]">
                  {/* Ambient glow behind carousel */}
                  <div className="absolute left-1/2 top-1/2 h-[200px] w-[300px] sm:h-[250px] sm:w-[400px] lg:h-[300px] lg:w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-500/20 via-accent/20 to-cyan-500/20 blur-[60px] sm:blur-[80px]" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    {projects.map((project, index) => {
                      const Icon = project.icon;
                      const offset = index - carouselIndex;
                      const absOffset = Math.abs(offset);
                      const isCenter = offset === 0;
                      const isActive = isCenter;

                      // Calculate position and rotation for 3D effect - responsive
                      const translateX = offset * 220;
                      const translateZ = isCenter ? 0 : -200 - absOffset * 60;
                      const rotateY = offset * -15;
                      const scale = isCenter ? 1 : 0.85 - absOffset * 0.08;
                      const opacity = absOffset > 1 ? 0 : 1 - absOffset * 0.35;
                      const zIndex = 20 - absOffset;

                      // Floating animation offset based on index
                      const floatDelay = index * 0.5;

                      return (
                        <motion.button
                          key={project.title}
                          type="button"
                          onClick={() => isActive ? setModalProject(project) : setCarouselIndex(index)}
                          className="absolute w-[260px] sm:w-[290px] lg:w-[340px] cursor-pointer"
                          initial={false}
                          animate={{
                            x: translateX,
                            z: translateZ,
                            rotateY: rotateY,
                            scale: scale,
                            opacity: opacity,
                            zIndex: zIndex,
                            y: [0, -8, 0], // Floating animation
                          }}
                          transition={{
                            x: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                            z: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                            rotateY: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                            scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.4 },
                            zIndex: { duration: 0 },
                            y: {
                              duration: 3 + index * 0.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: floatDelay,
                            },
                          }}
                          style={{
                            perspective: 1000,
                            transformStyle: "preserve-3d",
                          }}
                          whileHover={isActive ? { scale: 1.03, y: -15 } : {}}
                        >
                          <div
                            className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                              isActive
                                ? `border-[${project.color}]/50 bg-surface/95 shadow-[${project.color}]/20`
                                : "border-border/40 bg-surface/50 shadow-black/10"
                            }`}
                            style={{
                              borderColor: isActive ? `${project.color}50` : undefined,
                              boxShadow: isActive ? `0 25px 50px -12px ${project.color}20, 0 0 30px ${project.color}10` : undefined,
                            }}
                          >
                            {/* Dynamic gradient glow effect */}
                            <div
                              className={`absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-b ${project.gradient} opacity-60`}
                            />

                            {/* Animated border glow for active */}
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 -z-10 rounded-[2rem]"
                                style={{
                                  background: `linear-gradient(135deg, ${project.color}30 0%, transparent 50%, ${project.color}20 100%)`,
                                }}
                                animate={{
                                  opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            )}

                            {/* Icon container with project color */}
                            <div className="flex flex-col items-center">
                              <motion.div
                                className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl transition-colors duration-300"
                                style={{
                                  backgroundColor: isActive ? `${project.color}30` : `${project.color}15`,
                                  color: isActive ? project.color : `${project.color}99`,
                                }}
                                whileHover={isActive ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
                                transition={{ duration: 0.5 }}
                              >
                                <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
                              </motion.div>

                              <div className="mt-4 sm:mt-6 text-center">
                                <span
                                  className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300"
                                  style={{
                                    backgroundColor: isActive ? `${project.color}25` : `${project.color}10`,
                                    color: isActive ? project.color : `${project.color}99`,
                                  }}
                                >
                                  {project.category}
                                </span>
                                <h3 className="mt-2 sm:mt-3 text-base sm:text-lg font-semibold text-foreground lg:text-xl">
                                  {project.title}
                                </h3>
                                <p className="mt-2 line-clamp-2 text-xs sm:text-sm leading-5 sm:leading-6 text-muted">
                                  {project.description}
                                </p>
                              </div>
                            </div>

                            {/* Click indicator */}
                            <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs text-muted">
                              {isActive ? (
                                <>
                                  <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                                  Click to view details
                                </>
                              ) : (
                                <>
                                  <span className="flex h-2 w-2 rounded-full bg-muted/50" />
                                  Click to focus
                                </>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="mt-6 sm:mt-8 flex flex-col items-center gap-4 sm:gap-6">
                  {/* Dots indicator with project colors */}
                  <div className="flex items-center gap-2">
                    {projects.map((project, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCarouselIndex(index)}
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: index === carouselIndex ? 32 : 8,
                          backgroundColor: index === carouselIndex ? project.color : `${project.color}40`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Navigation buttons with current project color */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setCarouselIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))}
                      className="group flex h-12 w-12 items-center justify-center rounded-full border bg-surface/80 text-foreground shadow-lg backdrop-blur-xl transition"
                      style={{
                        borderColor: `${projects[carouselIndex].color}40`,
                      }}
                      whileHover={{
                        scale: 1.1,
                        borderColor: projects[carouselIndex].color,
                        backgroundColor: `${projects[carouselIndex].color}15`,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className="h-5 w-5 transition group-hover:-translate-x-0.5" />
                    </motion.button>

                    <motion.span
                      className="mx-4 min-w-[80px] text-center text-sm font-medium"
                      style={{ color: projects[carouselIndex].color }}
                      key={carouselIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {carouselIndex + 1} / {projects.length}
                    </motion.span>

                    <motion.button
                      type="button"
                      onClick={() => setCarouselIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))}
                      className="group flex h-12 w-12 items-center justify-center rounded-full border bg-surface/80 text-foreground shadow-lg backdrop-blur-xl transition"
                      style={{
                        borderColor: `${projects[carouselIndex].color}40`,
                      }}
                      whileHover={{
                        scale: 1.1,
                        borderColor: projects[carouselIndex].color,
                        backgroundColor: `${projects[carouselIndex].color}15`,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                    </motion.button>
                  </div>
                </div>

                {/* Modal */}
                <AnimatePresence>
                  {modalProject && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm"
                      onClick={() => setModalProject(null)}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-[95vw] sm:max-w-lg overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border bg-surface/95 p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto"
                        style={{
                          borderColor: `${modalProject.color}40`,
                          boxShadow: `0 25px 50px -12px ${modalProject.color}25`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Background gradient */}
                        <div
                          className={`absolute inset-0 -z-10 bg-gradient-to-b ${modalProject.gradient} opacity-40`}
                        />

                        {/* Close button */}
                        <button
                          type="button"
                          onClick={() => setModalProject(null)}
                          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/50 text-muted transition hover:border-[${modalProject.color}] hover:text-foreground"
                          style={{ borderColor: `${modalProject.color}30` }}
                        >
                          <X className="h-5 w-5" />
                        </button>

                        {/* Content */}
                        <div className="flex flex-col items-center text-center">
                          <motion.div
                            className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl"
                            style={{
                              backgroundColor: `${modalProject.color}25`,
                              color: modalProject.color,
                            }}
                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {(() => {
                              const Icon = modalProject.icon;
                              return <Icon className="h-8 w-8 sm:h-10 sm:w-10" />;
                            })()}
                          </motion.div>

                          <span
                            className="mt-4 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${modalProject.color}20`,
                              color: modalProject.color,
                            }}
                          >
                            {modalProject.category}
                          </span>

                          <h3 className="mt-3 text-xl sm:text-2xl font-semibold text-foreground lg:text-3xl">
                            {modalProject.title}
                          </h3>

                          <p className="mt-3 sm:mt-4 text-sm leading-6 sm:leading-7 text-muted">
                            {modalProject.description}
                          </p>

                          {/* Tech Stack */}
                          <div className="mt-6 w-full">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">
                              Technologies Used
                            </p>
                            <div className="mt-3 flex flex-wrap justify-center gap-2">
                              {modalProject.stack.map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full border px-3 py-1.5 text-xs text-muted"
                                  style={{
                                    borderColor: `${modalProject.color}30`,
                                    backgroundColor: `${modalProject.color}08`,
                                  }}
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Outcome */}
                          <div className="mt-4 sm:mt-6 flex w-full items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4"
                            style={{
                              borderColor: `${modalProject.color}25`,
                              backgroundColor: `${modalProject.color}08`,
                            }}
                          >
                            <div
                              className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl"
                              style={{
                                backgroundColor: `${modalProject.color}20`,
                                color: modalProject.color,
                              }}
                            >
                              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <div className="text-left min-w-0">
                              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted">Outcome</p>
                              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-medium text-foreground">
                                {modalProject.outcome}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </section>

            <section id="contact" className="scroll-mt-20 sm:scroll-mt-28 pt-16 sm:pt-20 lg:pt-24">
              <motion.div
                className="grid gap-6 rounded-[2rem] border border-border bg-surface/70 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 text-xs uppercase tracking-[0.35em] text-muted">
                    <Mail className="h-3.5 w-3.5 text-accent" />
                    Contact
                  </span>

                  <h2 className="mt-6 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
                    Let&apos;s build something different.
                  </h2>

                  <p className="npm mt-5 max-w-2xl text-sm leading-6 sm:leading-7 text-muted sm:text-base">
                    Do you want to build a website? an Embedded System? just email me and I got you bro.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {socialLinks.map((link) => {
                      const Icon = link.icon;

                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm text-foreground transition hover:border-accent/30 hover:bg-accent/10"
                        >
                          <Icon className="h-4 w-4 text-accent" />
                          {link.label}
                        </a>
                      );
                    })}
                  </div>
                </div>

                <form className="grid gap-3 sm:gap-4 rounded-[1.25rem] sm:rounded-[1.5rem] border border-border bg-background/45 p-4 sm:p-5" onSubmit={handleContactSubmit}>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">Name</span>
                    <input
                      name="name"
                      type="text"
                      placeholder="Your name"
                      className="rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent/40"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">Email</span>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent/40"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">Message</span>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Tell me about your project"
                      className="rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent/40"
                    />
                  </label>

                  {/* Status Messages */}
                  {contactStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400"
                    >
                      Message sent successfully! I&apos;ll get back to you soon.
                    </motion.div>
                  )}

                  {contactStatus === "error" && contactError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                    >
                      {contactError}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={contactStatus === "loading"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#6b9cff] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {contactStatus === "loading" ? (
                      <>
                        <motion.div
                          className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </section>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
