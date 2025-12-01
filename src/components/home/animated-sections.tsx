"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Heart, Brain, Eye, Microscope, Activity, Camera, Ribbon, Wind, Fingerprint, Stethoscope, Database } from "lucide-react";
import { ReactNode } from "react";

const specialtyIcons: Record<string, ReactNode> = {
  Cardiology: <Heart className="h-4 w-4" />,
  Neurology: <Brain className="h-4 w-4" />,
  Ophthalmology: <Eye className="h-4 w-4" />,
  Pathology: <Microscope className="h-4 w-4" />,
  Radiology: <Camera className="h-4 w-4" />,
  Oncology: <Ribbon className="h-4 w-4" />,
  Pulmonology: <Wind className="h-4 w-4" />,
  Gastroenterology: <Stethoscope className="h-4 w-4" />,
  Dermatology: <Fingerprint className="h-4 w-4" />,
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

interface Specialty {
  id: string;
  name: string;
  _count: { models: number };
}

interface SpecialtySectionProps {
  specialties: Specialty[];
}

export function SpecialtySection({ specialties }: SpecialtySectionProps) {
  return (
    <section className="pt-8 pb-6 relative z-50">
      <div className="mx-auto max-w-4xl px-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm text-muted-foreground mb-5"
        >
          Browse by specialty
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {specialties.map((s) => (
            <motion.div key={s.id} variants={item}>
              <Link
                href={`/models?specialty=${s.name}`}
                className="group flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-all hover:border-primary/50 hover:bg-primary/5"
              >
                <span className="text-muted-foreground group-hover:text-primary">
                  {specialtyIcons[s.name] || <Activity className="h-4 w-4" />}
                </span>
                <span className="text-foreground font-medium">{s.name}</span>
                <span className="text-xs text-muted-foreground">{s._count.models}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface FeaturesSectionProps {
  modelCount: number;
}

export function FeaturesSection({ modelCount }: FeaturesSectionProps) {
  const features = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "Comprehensive Database",
      description: `${modelCount.toLocaleString()} AI models from peer-reviewed medical publications`
    },
    {
      icon: <Microscope className="h-6 w-6" />,
      title: "Evidence-Based",
      description: "All models sourced from PubMed with performance metrics and validation data"
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Compare & Evaluate",
      description: "Side-by-side comparison of architectures, accuracy, and clinical validation"
    }
  ];

  return (
    <section className="border-t border-border py-8">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={item} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h2 className="font-semibold text-foreground mb-2">{feature.title}</h2>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
