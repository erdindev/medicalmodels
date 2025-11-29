"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/settings");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["Browse all models", "Save up to 5 models", "Basic comparisons"],
      current: session.user.plan === "free" || !session.user.plan,
    },
    {
      name: "Pro",
      price: "$9/mo",
      features: [
        "Everything in Free",
        "Unlimited saved models",
        "Advanced comparisons",
        "Export to PDF",
        "API access",
      ],
      current: session.user.plan === "pro",
    },
    {
      name: "Team",
      price: "$29/mo",
      features: [
        "Everything in Pro",
        "5 team members",
        "Shared comparisons",
        "Priority support",
      ],
      current: session.user.plan === "team",
    },
  ];

  return (
    <div className="min-h-screen bg-background bg-dot-grid">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-foreground mb-8">Settings</h1>

        {/* Profile Section */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-foreground mb-4">Profile</h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-4">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-medium text-primary">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <p className="font-medium text-foreground">{session.user.name}</p>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-foreground mb-4">Subscription</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-4 ${
                  plan.current
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="mb-3">
                  <p className="font-medium text-foreground">{plan.name}</p>
                  <p className="text-2xl font-semibold text-foreground">{plan.price}</p>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                {plan.current ? (
                  <span className="text-sm text-primary">Current plan</span>
                ) : (
                  <button className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary/50">
                    Upgrade
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4">Account</h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Sign out</p>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
