import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-secondary/30 relative z-50">
            {/* Disclaimer Banner */}
            <div className="border-b border-border bg-amber-50/50">
                <div className="mx-auto max-w-7xl px-4 py-3">
                    <div className="flex items-start gap-2 text-xs text-amber-800">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <p>
                            <strong>For Research Purposes Only.</strong> This platform provides information from peer-reviewed publications.
                            It does not provide medical advice. All model data and metrics remain the intellectual property of the original authors.
                            <Link href="/disclaimer" className="ml-1 underline hover:text-amber-900">Read full disclaimer</Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 text-foreground mb-4">
                            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span className="font-semibold text-lg">medicalmodels.co</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-sm mb-4">
                            The comprehensive database for medical AI models. Discover, compare, and evaluate
                            machine learning models from peer-reviewed publications for clinical and research applications.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Tokmak Systems. All rights reserved.
                        </p>
                    </div>

                    {/* Medical Specialties */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Specialties</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/models?specialty=Radiology" className="hover:text-primary">Radiology AI</Link></li>
                            <li><Link href="/models?specialty=Pathology" className="hover:text-primary">Pathology AI</Link></li>
                            <li><Link href="/models?specialty=Cardiology" className="hover:text-primary">Cardiology AI</Link></li>
                            <li><Link href="/models?specialty=Dermatology" className="hover:text-primary">Dermatology AI</Link></li>
                            <li><Link href="/models?specialty=Ophthalmology" className="hover:text-primary">Ophthalmology AI</Link></li>
                            <li><Link href="/models?specialty=Neurology" className="hover:text-primary">Neurology AI</Link></li>
                            <li><Link href="/models?specialty=Oncology" className="hover:text-primary">Oncology AI</Link></li>
                            <li><Link href="/models?specialty=Pulmonology" className="hover:text-primary">Pulmonology AI</Link></li>
                        </ul>
                    </div>

                    {/* Platform */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/models" className="hover:text-primary">Browse All Models</Link></li>
                            <li><Link href="/compare" className="hover:text-primary">Compare Models</Link></li>
                            <li><Link href="/datasets" className="hover:text-primary">Medical Datasets</Link></li>
                            <li><Link href="/papers" className="hover:text-primary">Research Papers</Link></li>
                            <li><Link href="/developer-teams" className="hover:text-primary">Developer Teams</Link></li>
                        </ul>

                        <h3 className="font-semibold text-foreground mb-4 mt-6">Resources</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/models?architecture=CNN" className="hover:text-primary">CNN Models</Link></li>
                            <li><Link href="/models?architecture=Transformer" className="hover:text-primary">Transformer Models</Link></li>
                            <li><Link href="/models?architecture=ResNet" className="hover:text-primary">ResNet Models</Link></li>
                            <li><Link href="/models?architecture=U-Net" className="hover:text-primary">U-Net Models</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Company */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/disclaimer" className="hover:text-primary">Disclaimer</Link></li>
                            <li><Link href="/impressum" className="hover:text-primary">Impressum</Link></li>
                            <li><Link href="/datenschutz" className="hover:text-primary">Datenschutz</Link></li>
                        </ul>

                        <h3 className="font-semibold text-foreground mb-4 mt-6">Validation</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/models?validation=prospective" className="hover:text-primary">Prospective Studies</Link></li>
                            <li><Link href="/models?validation=retrospective" className="hover:text-primary">Retrospective Studies</Link></li>
                            <li><Link href="/models?validation=external" className="hover:text-primary">External Validation</Link></li>
                            <li><Link href="/models?fda=true" className="hover:text-primary">FDA Approved</Link></li>
                            <li><Link href="/models?ce=true" className="hover:text-primary">CE Marked</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Keywords Section for SEO */}
                <div className="mt-12 pt-8 border-t border-border">
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                        <strong className="text-muted-foreground">Medical AI Models:</strong> Deep learning for healthcare,
                        machine learning in medicine, clinical AI applications, medical image analysis,
                        diagnostic AI systems, healthcare artificial intelligence, radiology deep learning,
                        pathology machine learning, cardiology AI models, dermatology image classification,
                        ophthalmology retinal analysis, neurology brain imaging AI, oncology tumor detection,
                        chest X-ray AI, CT scan analysis, MRI segmentation, ECG interpretation AI,
                        skin lesion classification, diabetic retinopathy screening, mammography AI,
                        colonoscopy polyp detection, ultrasound AI analysis, PET scan AI,
                        medical image segmentation, clinical decision support systems,
                        AI-assisted diagnosis, computer-aided detection, neural networks in medicine,
                        convolutional neural networks healthcare, transformer models medical imaging,
                        U-Net medical segmentation, ResNet clinical applications.
                    </p>
                </div>
            </div>
        </footer>
    );
}
