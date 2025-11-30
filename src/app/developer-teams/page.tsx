import { Metadata } from "next";
import { RegistrationForm } from "@/components/developer-teams/registration-form";

export const metadata: Metadata = {
    title: "Register Developer Team | MedicalModels",
    description: "Register your developer team to showcase your medical AI models and collaborate with the community.",
};

export default function DeveloperTeamsPage() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Register as a Developer Team
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Join our ecosystem of medical AI developers. Showcase your models and
                        collaborate with others.
                    </p>
                </div>

                <RegistrationForm />
            </div>
        </div>
    );
}
