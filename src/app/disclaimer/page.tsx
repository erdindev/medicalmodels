import Link from "next/link";
import { AlertTriangle, Search, ExternalLink, Shield, Scale, FileText } from "lucide-react";

export const metadata = {
  title: "Disclaimer | MedicalModels.co",
  description: "Legal disclaimer and terms of use for MedicalModels.co",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Disclaimer</h1>

        {/* Primary Purpose Banner - EMPHASIZED */}
        <section className="mb-10">
          <div className="rounded-xl border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 shrink-0">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-2">
                  This is a Search Directory Only
                </h2>
                <p className="text-blue-800 font-medium mb-3">
                  MedicalModels.co is exclusively a search and discovery platform that aggregates
                  publicly available information about medical AI models from various sources.
                </p>
                <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-900 font-semibold mb-2">
                    We are NOT:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✕</span>
                      <span>A provider, developer, or distributor of AI models</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✕</span>
                      <span>A medical device company or healthcare provider</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✕</span>
                      <span>A certification or validation authority</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✕</span>
                      <span>Affiliated with any of the models listed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            What MedicalModels.co Does
          </h2>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-muted-foreground mb-4">
              MedicalModels.co serves as a centralized search engine and directory to help
              researchers, clinicians, and developers discover medical AI models more easily.
              We aggregate information from:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <span><strong className="text-foreground">Peer-reviewed publications</strong> indexed in PubMed and medical journals</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <span><strong className="text-foreground">Open-source repositories</strong> such as Hugging Face</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <span><strong className="text-foreground">Publicly available model cards</strong> and documentation</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Our sole purpose</strong> is to make it easier to find and compare
                medical AI models that are scattered across different platforms, journals, and repositories.
                Think of us as "Google for Medical AI Models" – we index and organize, but we do not
                create, host, validate, or endorse any of the models listed.
              </p>
            </div>
          </div>
        </section>

        {/* Medical Disclaimer - CRITICAL */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Medical Disclaimer
          </h2>
          <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-5">
            <p className="text-amber-900 font-bold text-lg mb-3">
              This platform is for informational and research purposes only.
            </p>
            <div className="space-y-3 text-amber-800">
              <p>
                MedicalModels.co does NOT provide medical advice, diagnosis, or treatment
                recommendations. The information displayed is extracted from third-party sources
                and has not been independently verified by us.
              </p>
              <p>
                <strong>Critical Warnings:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Never use any AI model for clinical decisions without proper regulatory approval</li>
                <li>Always consult qualified healthcare professionals for medical advice</li>
                <li>Reported performance metrics may not generalize to your specific use case or population</li>
                <li>Research models are often not suitable for production clinical use</li>
                <li>We cannot verify the accuracy of any claims made by model authors</li>
              </ul>
              <p className="font-medium mt-4">
                AI models should only be deployed in clinical settings after obtaining proper
                regulatory clearance, institutional approval, and thorough local validation.
              </p>
            </div>
          </div>
        </section>

        {/* Third-Party Content */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            Third-Party Content & Links
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              All model information, metrics, and descriptions displayed on MedicalModels.co
              originate from third-party sources. We do not control, verify, or endorse this content.
            </p>
            <div className="rounded-lg border border-border bg-slate-50 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Important:</p>
              <ul className="text-sm space-y-1">
                <li>• Links lead to external websites that we do not control</li>
                <li>• External content may change or become unavailable without notice</li>
                <li>• We are not responsible for the content, accuracy, or practices of linked sites</li>
                <li>• Always verify information directly with the original source</li>
              </ul>
            </div>
            <p>
              <strong className="text-foreground">For Hugging Face models:</strong> These are
              open-source models hosted on huggingface.co. We simply index their existence –
              please review each model's license, terms, and documentation directly on Hugging Face
              before any use.
            </p>
          </div>
        </section>

        {/* Data Sources & Copyright */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Data Sources & Copyright
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              We aggregate publicly available information under fair use principles for
              research and educational purposes.
            </p>
            <p>
              <strong className="text-foreground">Copyright Notice:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                All research data, metrics, and methodologies remain the intellectual
                property of the original authors and publishing institutions
              </li>
              <li>
                Journal articles are subject to their respective publisher copyrights
              </li>
              <li>
                Open-source models are subject to their individual licenses (MIT, Apache, etc.)
              </li>
              <li>
                We provide links to original sources for full attribution
              </li>
              <li>
                Use of aggregated information must comply with applicable copyright laws
              </li>
            </ul>
            <p className="mt-4">
              If you are a researcher, publisher, or rights holder and have concerns about content
              displayed on this platform, please <Link href="/impressum" className="text-primary hover:underline">contact us</Link> for
              prompt removal or correction.
            </p>
          </div>
        </section>

        {/* No Warranty */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            No Warranty
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              The information on MedicalModels.co is provided <strong className="text-foreground">"as is"</strong> without
              warranty of any kind, express or implied.
            </p>
            <p>
              <strong className="text-foreground">We do not guarantee:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Accuracy, completeness, or currentness of any information</li>
              <li>Reproducibility of reported performance metrics</li>
              <li>Suitability of any model for any specific use case</li>
              <li>That listed models are available, functional, or safe to use</li>
              <li>That external links will remain active or accurate</li>
              <li>Continuous availability of this platform</li>
            </ul>
            <p>
              Reported metrics (AUC, sensitivity, specificity, etc.) are extracted from
              original publications and may reflect specific validation cohorts that
              differ significantly from real-world clinical populations.
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Limitation of Liability
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              MedicalModels.co and its operators shall not be liable for any direct,
              indirect, incidental, consequential, or punitive damages arising from:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Use or inability to use information provided on this platform</li>
              <li>Decisions made based on information found here</li>
              <li>Implementation, deployment, or use of any referenced AI model</li>
              <li>Errors, omissions, or inaccuracies in the content</li>
              <li>Any actions taken based on third-party content we link to</li>
              <li>Any harm resulting from the use of listed models</li>
            </ul>
            <p className="font-medium text-foreground mt-4">
              By using this platform, you accept full responsibility for how you use the
              information found here and agree that MedicalModels.co bears no liability
              for your actions.
            </p>
          </div>
        </section>

        {/* Regulatory Notice */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Regulatory Notice
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              AI/ML-based medical devices are heavily regulated. Most models listed here
              are research prototypes that have <strong className="text-foreground">NOT</strong> received
              regulatory approval for clinical use.
            </p>
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-900">
              <p className="font-bold mb-2">Before using ANY AI model in clinical practice:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                <li>Verify FDA clearance/approval status (USA)</li>
                <li>Check CE marking and MDR compliance (European Union)</li>
                <li>Confirm compliance with local medical device regulations</li>
                <li>Obtain institutional review board (IRB) approval if required</li>
                <li>Conduct local validation studies</li>
                <li>Establish proper clinical governance and oversight</li>
              </ul>
            </div>
            <p>
              Any regulatory information displayed on this platform is for informational purposes
              only and may be outdated or incorrect. Always verify current regulatory status
              with official regulatory bodies.
            </p>
          </div>
        </section>

        {/* Summary Box */}
        <section className="mb-10">
          <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">In Summary</h2>
            <p className="text-slate-700">
              MedicalModels.co is a <strong>search directory</strong> that helps you discover medical AI
              models. We do not create, validate, certify, or endorse any models. All information
              comes from third-party sources. Always verify information with original sources,
              consult professionals, and ensure regulatory compliance before any clinical use.
            </p>
          </div>
        </section>

        {/* Last Updated */}
        <section className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Last updated: December 2025
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            For questions regarding this disclaimer, please see our{" "}
            <Link href="/impressum" className="text-primary hover:underline">
              Impressum
            </Link>{" "}
            for contact information.
          </p>
        </section>
      </div>
    </div>
  );
}
