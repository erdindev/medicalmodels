
export default function DatenschutzPage() {
    return (
        <div className="min-h-screen bg-background bg-dot-grid container mx-auto max-w-3xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

            <div className="space-y-8 text-muted-foreground">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Informationen gemäß Art. 13, 14 DSGVO</h2>

                    <h3 className="text-lg font-medium text-foreground mt-6 mb-2">1. Verantwortlicher für die Datenverarbeitung</h3>
                    <p>
                        Dr. med. Erdin Tokmak<br />
                        Ingelheimer Str. 15<br />
                        45145 Essen, Deutschland<br />
                        E-Mail: hallo@navigatesolutions.de<br />
                        Website: https://navigatesolution.de
                    </p>
                    <p className="mt-2">
                        Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte können Sie uns jederzeit unter den oben genannten Kontaktdaten erreichen.
                    </p>

                    <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2. Allgemeine Hinweise zur Datenverarbeitung</h3>
                    <h4 className="font-medium text-foreground mt-2">2.1 Umfang der Verarbeitung</h4>
                    <p>
                        Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist.
                    </p>

                    <h4 className="font-medium text-foreground mt-2">2.2 Rechtsgrundlagen</h4>
                    <p>Die Verarbeitung personenbezogener Daten erfolgt auf folgenden Rechtsgrundlagen:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Art. 6 Abs. 1 lit. a DSGVO - Einwilligung</li>
                        <li>Art. 6 Abs. 1 lit. b DSGVO - Vertragserfüllung</li>
                        <li>Art. 6 Abs. 1 lit. c DSGVO - Rechtliche Verpflichtung</li>
                        <li>Art. 6 Abs. 1 lit. f DSGVO - Berechtigte Interessen</li>
                    </ul>

                    <h4 className="font-medium text-foreground mt-2">2.3 Datenlöschung und Speicherdauer</h4>
                    <p>
                        Personenbezogene Daten werden gelöscht, sobald der Zweck der Speicherung entfällt. Eine Speicherung kann darüber hinaus erfolgen, wenn dies durch gesetzliche Vorschriften vorgesehen wurde.
                    </p>

                    <h3 className="text-lg font-medium text-foreground mt-6 mb-2">3. Welche Daten werden erhoben?</h3>
                    <h4 className="font-medium text-foreground mt-2">3.1 Server-Logfiles</h4>
                    <p>Bei jedem Aufruf unserer Website erfasst unser System automatisiert folgende Daten:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>IP-Adresse des anfragenden Rechners</li>
                        <li>Datum und Uhrzeit des Zugriffs</li>
                        <li>Name und URL der abgerufenen Datei</li>
                        <li>Übertragene Datenmenge</li>
                        <li>Meldung über erfolgreichen Abruf (HTTP response code)</li>
                        <li>Browser-Typ und Version</li>
                        <li>Betriebssystem des Nutzers</li>
                        <li>Referrer URL (zuvor besuchte Seite)</li>
                    </ul>
                    <p className="mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse an der Systemsicherheit)</p>

                    <h4 className="font-medium text-foreground mt-2">3.2 Nutzungsdaten</h4>
                    <p>Zur Verbesserung unseres Services erfassen wir anonymisierte Nutzungsdaten:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Gesuchte Ziele und Standorte</li>
                        <li>Genutzte Routen</li>
                        <li>Verweildauer auf Seiten</li>
                        <li>Abbrüche und Fehler</li>
                    </ul>
                    <p className="mt-2">Wichtig: Diese Daten werden anonymisiert und können nicht auf einzelne Personen zurückgeführt werden.</p>

                    <h4 className="font-medium text-foreground mt-2">3.3 Registrierungsdaten (Kunden-Accounts)</h4>
                    <p>Bei der Registrierung eines Kundenkontos werden folgende Daten erhoben:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Name der Einrichtung</li>
                        <li>Ansprechpartner (Name, E-Mail)</li>
                        <li>Rechnungsadresse</li>
                        <li>Zahlungsinformationen (verschlüsselt über Stripe)</li>
                    </ul>
                    <p className="mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>

                    <h3 className="text-lg font-medium text-foreground mt-6 mb-2">4. Cookies und Tracking</h3>
                    <h4 className="font-medium text-foreground mt-2">4.1 Technisch notwendige Cookies</h4>
                    <p>Wir verwenden Cookies, um unsere Website nutzerfreundlich zu gestalten. Folgende Cookies werden gesetzt:</p>
                    <div className="overflow-x-auto mt-2">
                        <table className="min-w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="py-2">Cookie</th>
                                    <th className="py-2">Zweck</th>
                                    <th className="py-2">Laufzeit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border">
                                    <td className="py-2">auth_token</td>
                                    <td className="py-2">Authentifizierung & Session-Verwaltung</td>
                                    <td className="py-2">30 Tage</td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="py-2">cookie-consent</td>
                                    <td className="py-2">Speicherung Cookie-Einstellungen</td>
                                    <td className="py-2">12 Monate</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (Technische Notwendigkeit)</p>

                    <h4 className="font-medium text-foreground mt-4">4.2 Google Tag Manager & Analytics</h4>
                    <p>Mit Ihrer Einwilligung verwenden wir Google Tag Manager (GTM) und Google Analytics 4 zur Analyse der Websitenutzung.</p>
                    <p className="mt-2"><strong>Google Tag Manager (GTM)</strong></p>
                    <p>Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland</p>
                    <p>Zweck: Verwaltung von Website-Tags und Tracking-Tools</p>
                    <p>Container-ID: GTM-WKJHD2LZ</p>
                    <p className="mt-2">Erfasste Daten:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>QR-Code Scans und Standort-IDs</li>
                        <li>Suchbegriffe und Suchergebnisse</li>
                        <li>Ausgewählte Routen und Navigationsziele</li>
                        <li>Video-Wiedergabe und Abspieldauer</li>
                        <li>Routen-Abschlüsse und Bewertungen</li>
                        <li>Seitenaufrufe und Verweildauer</li>
                        <li>Browser-Typ, Gerätetyp, IP-Adresse (anonymisiert)</li>
                    </ul>
                    <p className="mt-2">Wichtig: GTM wird nur geladen, wenn Sie dem Cookie-Banner ausdrücklich zustimmen. Ohne Ihre Einwilligung erfolgt kein Tracking durch Google.</p>
                    <p className="mt-2">Speicherdauer: Analytics-Daten werden nach 14 Monaten automatisch gelöscht.</p>
                    <p className="mt-2">Datenübermittlung in Drittländer: Google kann Daten in die USA übermitteln. Google ist nach dem EU-US Data Privacy Framework zertifiziert.</p>
                    <p className="mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung via Cookie-Banner)</p>
                    <p className="mt-2">Widerruf: Sie können Ihre Einwilligung jederzeit widerrufen, indem Sie Ihre Cookie-Einstellungen ändern oder den localStorage-Eintrag cookieConsent löschen.</p>

                    <h4 className="font-medium text-foreground mt-4">4.3 Cookie-Einstellungen verwalten</h4>
                    <p>Sie können Ihre Cookie-Einstellungen jederzeit ändern. Beim ersten Besuch unserer Website wird Ihnen ein Cookie-Banner angezeigt, über das Sie Ihre Präferenzen festlegen können.</p>
                    <p className="mt-2">Hinweis: Wenn Sie das Cookie-Banner erneut aufrufen möchten, löschen Sie bitte den localStorage-Eintrag cookie-consent in Ihren Browser-Einstellungen oder kontaktieren Sie uns unter hallo@navigatesolutions.de.</p>

                    <h3 className="text-lg font-medium text-foreground mt-6 mb-2">5. Weitergabe von Daten an Dritte</h3>
                    <h4 className="font-medium text-foreground mt-2">5.1 Hosting</h4>
                    <p>Unsere Website wird bei folgendem Anbieter gehostet:</p>
                    <p>Hetzner Online GmbH<br />Industriestr. 25, 91710 Gunzenhausen, Deutschland<br />Serverstandort: Deutschland (EU)</p>
                    <p>Mit Hetzner wurde ein Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO geschlossen.</p>

                    <h4 className="font-medium text-foreground mt-4">5.2 Zahlungsdienstleister</h4>
                    <p>Für die Abwicklung von Zahlungen nutzen wir:</p>
                    <p>Stripe Payments Europe Ltd.<br />1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland</p>
                    <p>Stripe ist PCI-DSS zertifiziert. Zahlungsdaten werden ausschließlich verschlüsselt übertragen und von uns nicht gespeichert.</p>

                    <h4 className="font-medium text-foreground mt-4">5.3 Google (Analytics & Tag Manager)</h4>
                    <p>Mit Ihrer Einwilligung werden Nutzungsdaten an Google übermittelt:</p>
                    <p>Google Ireland Limited<br />Gordon House, Barrow Street, Dublin 4, Irland</p>
                    <p>Muttergesellschaft: Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</p>
                    <p>Google verarbeitet die Daten in unserem Auftrag zur Analyse der Websitenutzung. Die Datenübermittlung erfolgt nur nach ausdrücklicher Einwilligung über den Cookie-Banner.</p>
                    <p>Datenschutzerklärung Google: https://policies.google.com/privacy</p>

                    <h4 className="font-medium text-foreground mt-4">5.4 Keine weiteren Empfänger</h4>
                    <p>Abgesehen von den oben genannten Dienstleistern geben wir Ihre Daten nicht an Dritte weiter, es sei denn, wir sind gesetzlich dazu verpflichtet oder Sie haben ausdrücklich eingewilligt.</p>

                    <h3 className="text-lg font-medium text-foreground mt-6 mb-2">6. Ihre Rechte als betroffene Person</h3>
                    <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li><strong>Recht auf Auskunft (Art. 15 DSGVO):</strong> Sie können Auskunft über Ihre gespeicherten Daten verlangen.</li>
                        <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie können die Berichtigung unrichtiger Daten verlangen.</li>
                        <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen ("Recht auf Vergessenwerden").</li>
                        <li><strong>Recht auf Einschränkung (Art. 18 DSGVO):</strong> Sie können die Einschränkung der Verarbeitung verlangen.</li>
                        <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können Ihre Daten in einem strukturierten Format erhalten.</li>
                        <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können der Verarbeitung Ihrer Daten widersprechen.</li>
                        <li><strong>Beschwerderecht (Art. 77 DSGVO):</strong> Sie können sich bei einer Datenschutzaufsichtsbehörde beschweren.</li>
                    </ul>
                    <p className="mt-4">Kontakt zur Ausübung Ihrer Rechte: hallo@navigatesolutions.de</p>

                    <h3 className="text-lg font-medium text-foreground mt-6 mb-2">7. Datensicherheit</h3>
                    <p>Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird.</p>
                    <p className="mt-2">Sicherheitsmaßnahmen:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>SSL/TLS-Verschlüsselung (HTTPS)</li>
                        <li>Regelmäßige Sicherheits-Updates</li>
                        <li>Zugriffsbeschränkungen und Berechtigungskonzepte</li>
                        <li>Firewall und Intrusion Detection</li>
                        <li>Regelmäßige Datensicherungen (Backups)</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
