
export default function ImpressumPage() {
    return (
        <div className="min-h-screen bg-background bg-dot-grid container mx-auto max-w-3xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Impressum</h1>

            <div className="space-y-8 text-muted-foreground">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Angaben gemäß § 5 TMG</h2>
                    <p>
                        Tokmak Systems<br />
                        Ingelheimer Str. 15<br />
                        45145 Essen, Deutschland
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Vertreten durch</h2>
                    <p>
                        Geschäftsführung: Dr. med. Erdin Tokmak
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Kontakt</h2>
                    <p>
                        E-Mail: hallo@navigatesolutions.de<br />
                        Website: https://navigatesolution.de
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                    <p>
                        Dr. med. Erdin Tokmak<br />
                        Ingelheimer Str. 15<br />
                        45145 Essen
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Haftungsausschluss (Disclaimer)</h2>

                    <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Haftung für Inhalte</h3>
                    <p className="mb-4">
                        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                    </p>

                    <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Haftung für Links</h3>
                    <p className="mb-4">
                        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                    </p>

                    <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Urheberrecht</h3>
                    <p className="mb-4">
                        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4">EU-Streitschlichtung</h2>
                    <p>
                        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/<br />
                        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                    </p>
                </section>
            </div>
        </div>
    );
}
