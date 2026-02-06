import React, { useEffect, useState } from "react";

export default function SmtpConfig() {
  const [cfg, setCfg] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Test SMTP de votre portfolio");
  const [text, setText] = useState("Ceci est un email de test.");

  useEffect(() => {
    fetch("/api/admin/smtp")
      .then((r) => r.json())
      .then(setCfg)
      .catch(() => setCfg(null));
  }, []);

  async function sendTest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/smtp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: to || undefined, subject, text }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || JSON.stringify(json));
      setTestResult("Email de test envoyé avec succès.");
    } catch (err: any) {
      setTestResult(`Erreur: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: 16 }}>
      <h3>Configuration SMTP</h3>
      <p>Les valeurs sensibles sont masquées. Pour configurer SMTP, définissez les variables d'environnement dans l'interface d'administration:</p>
      <ul>
        <li>SMTP_HOST</li>
        <li>SMTP_PORT</li>
        <li>SMTP_USER</li>
        <li>SMTP_PASS</li>
        <li>TO_EMAIL (destinataire par défaut)</li>
      </ul>

      <div style={{ background: "#f7f7f7", padding: 12, borderRadius: 6 }}>
        <pre style={{ margin: 0 }}>{JSON.stringify(cfg, null, 2)}</pre>
      </div>

      <form onSubmit={sendTest} style={{ marginTop: 16 }}>
        <h4>Envoyer un email de test</h4>
        <label style={{ display: "block", marginBottom: 8 }}>Destinataire (laisser vide pour TO_EMAIL)</label>
        <input value={to} onChange={(e) => setTo(e.target.value)} style={{ width: "100%", padding: 8 }} />
        <label style={{ display: "block", marginTop: 8 }}>Sujet</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: "100%", padding: 8 }} />
        <label style={{ display: "block", marginTop: 8 }}>Message</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ width: "100%", padding: 8, minHeight: 100 }} />
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
            {loading ? "Envoi…" : "Envoyer un test"}
          </button>
        </div>
      </form>

      {testResult && (
        <div style={{ marginTop: 12, padding: 8, background: "#fffbe6", borderRadius: 6 }}>
          {testResult}
        </div>
      )}
    </div>
  );
}
