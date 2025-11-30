import Link from "next/link";

export const metadata = {
  title: "Disclaimer | MedicalModels.co",
  description: "Legal disclaimer and terms of use for MedicalModels.co",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Disclaimer</h1>

        {/* Medical Disclaimer */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Medical Disclaimer
          </h2>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 mb-4">
            <strong>Important:</strong> This platform is for informational and research purposes only.
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>
              MedicalModels.co provides information about AI models described in peer-reviewed
              medical publications. This information is intended for healthcare professionals,
              researchers, and developers interested in medical AI.
            </p>
            <p>
              <strong className="text-foreground">This platform does not:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide medical advice, diagnosis, or treatment recommendations</li>
              <li>Replace professional medical judgment or clinical decision-making</li>
              <li>Validate or certify AI models for clinical use</li>
              <li>Guarantee the safety or efficacy of any listed model</li>
            </ul>
            <p>
              Always consult qualified healthcare professionals for medical decisions.
              AI models should only be used in clinical settings after proper regulatory
              approval and institutional validation.
            </p>
          </div>
        </section>

        {/* Data Sources & Copyright */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Data Sources & Copyright
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              All model information displayed on MedicalModels.co is sourced from
              peer-reviewed publications indexed in PubMed and other scientific databases.
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
                We provide links to original sources for full attribution
              </li>
              <li>
                Use of this information must comply with applicable copyright laws
                and fair use provisions
              </li>
            </ul>
            <p className="mt-4">
              If you are a researcher or rights holder and have concerns about content
              displayed on this platform, please <Link href="/impressum" className="text-primary hover:underline">contact us</Link>.
            </p>
          </div>
        </section>

        {/* No Warranty */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            No Warranty
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              The information on MedicalModels.co is provided "as is" without warranty
              of any kind, express or implied.
            </p>
            <p>
              <strong className="text-foreground">We do not guarantee:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Accuracy or completeness of reported performance metrics</li>
              <li>Reproducibility of results in different settings or populations</li>
              <li>Suitability of any model for specific use cases</li>
              <li>Continuous availability of the platform or linked resources</li>
            </ul>
            <p>
              Reported metrics (AUC, sensitivity, specificity, etc.) are extracted from
              original publications and may reflect specific validation cohorts that
              differ from real-world clinical populations.
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
              <li>Implementation or deployment of any referenced AI model</li>
              <li>Errors or omissions in the content</li>
            </ul>
          </div>
        </section>

        {/* Regulatory Notice */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Regulatory Notice
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              AI/ML-based medical devices are subject to regulatory oversight in most
              jurisdictions. Before using any AI model in clinical practice:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Verify FDA clearance/approval status (USA)</li>
              <li>Check CE marking requirements (European Union)</li>
              <li>Confirm compliance with local medical device regulations</li>
              <li>Obtain necessary institutional approvals and ethics clearances</li>
            </ul>
            <p>
              Regulatory status displayed on this platform is for informational purposes
              and may not reflect current approval status.
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
