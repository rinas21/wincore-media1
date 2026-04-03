export type Project = {
  id: number;
  slug: string;
  title: string;
  category: string;
  image: string;
  tags: string[];
  description: string;
  stack: string;
  duration: string;
  role: string;
  impact: string;
  link: string;
  // Case Study specific fields
  problem?: string;
  approach?: string;
  execution?: string;
  outcome?: string;
  images?: string[];
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "onyx-luxury",
    title: "Onyx Luxury",
    category: "High-End Commerce",
    image: "/works/vibrant_webgl.png",
    tags: ["E-Commerce", "WebGL", "Brand Strategy"],
    description: "A flagship digital storefront for Onyx, blending 3D product interaction with seamless conversion architecture.",
    stack: "React, Three.js, Shopify",
    duration: "12 Weeks",
    role: "Full-Service Partner",
    impact: "+40% Conversion",
    link: "https://onyx-luxury.com",
    problem: "Onyx's existing digital presence was clinical and lacked the visceral 'luxury' feel of their physical showrooms. High-intent customers were bouncing because the mobile experience felt like a standard commodity template rather than an elite flagship.",
    approach: "We moved away from the standard 'grid of products' and toward a 'digital monologue.' Every product is treated as a piece of art, utilizing Three.js for spatial interaction and GSAP for narrative-driven scroll sequences that guide the user through the brand's heritage.",
    execution: "Leveraging React Three Fiber for the 3D core and custom GLSL shaders to simulate material luxuriance. We built a 'kinetic checkout' flow that maintains the cinematic feel until the final transaction, ensuring zero drop-off in the transition from story to sale.",
    outcome: "Conversion increased by 40% within the first quarter. More importantly, time-on-page tripled, and the brand successfully redefined its digital benchmark in the luxury sector.",
    images: ["/works/vibrant_webgl.png", "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80"]
  },
  {
    id: 3,
    slug: "aura-experiences",
    title: "Aura Experiences",
    category: "Immersive Motion",
    image: "/works/aura-hero.png",
    tags: ["WebGL", "Motion Design", "3D UI"],
    description: "An evocative, atmospheric experience for a luxury wellness brand.",
    stack: "GSAP, WebGL, React",
    duration: "8 Weeks",
    role: "Direction & Motion",
    impact: "1.2M+ Reach",
    link: "https://aura-exp.com",
    problem: "Aura's message of 'inner peace' was being delivered via static grids. They needed a digital home that physically felt as fluid and calm as their brand ethos.",
    approach: "We architected a 'liquid transition' system. Using non-linear navigation where users 'float' through content, we transformed the site into a symbiotic sensory extension.",
    execution: "A custom GSAP engine manages over 400 triggers. We utilized Three.js vertex shaders to create the signature 'aura' effect which responds live to user interaction.",
    outcome: "The site went viral, securing over 1.2M impressions. Aura subsequently closed their Series B, citing the digital flagship as a pivotal proof of brand maturity.",
    images: [
      "/works/aura-hero.png",
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1200"
    ]
  },
   {
    id: 2,
    slug: "cipher-fintech",
    title: "Cipher Fintech",
    category: "Financial Systems",
    image: "/works/vibrant_fintech.png",
    tags: ["Product Design", "Security", "AI Systems"],
    description: "Reimagining the security of digital assets. Cipher is a high-security, ultra-efficient fintech dashboard.",
    stack: "Next.js, D3.js, Rust",
    duration: "16 Weeks",
    role: "Product Architecture",
    impact: "99.9% Efficiency",
    link: "https://cipher-fin.io",
    problem: "Fintech dashboards are notoriously cluttered. Cipher's users (institutional traders) were suffering from decision fatigue. They needed elite-speed data visualization that didn't sacrifice psychological clarity.",
    approach: "Minimalist brutalism meets high-speed data. We removed all non-essential UI decorators and focused on 'Glance Value.' Using D3.js, we custom-built every chart to handle real-time Rust-powered data streams without a single drop in frame rate.",
    execution: "The dashboard uses a grid system inspired by architectural blueprints. We implemented a 'Command Center' feel with dark-mode optimized contrast ratios and kinetic feedback for critical actions (e.g., trade confirmations).",
    outcome: "Cipher reported a 22% increase in institutional onboarding and a significant reduction in user error rates. The platform has since been acquired by a major global bank.",
    images: ["/works/vibrant_fintech.png", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"]
  },
];
