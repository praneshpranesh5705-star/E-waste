"use client";

import { useState } from "react";

const categories = [
  ["📱", "Phones & Tablets", "Old or damaged mobile devices and accessories."],
  ["💻", "Laptops & PCs", "Computers, monitors, keyboards and peripherals."],
  ["🔋", "Batteries", "Used rechargeable batteries handled safely."],
  ["🖥️", "Home Electronics", "TVs, printers, routers and other electronics."],
];

const steps = [
  ["01", "Book", "Tell us what you want to recycle."],
  ["02", "Collect", "Arrange a convenient pickup."],
  ["03", "Sort", "Items are assessed for reuse and recycling."],
  ["04", "Recover", "Useful materials return to the circular economy."],
];

const impact = [
  ["12.4T", "Electronics diverted"],
  ["3,250", "Devices processed"],
  ["420kg", "Materials recovered"],
  ["48", "Collection partners"],
];

function AiScanner() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [question, setQuestion] = useState("Describe what you want us to do with this item. Example: “Can this be repaired?”, “I want to recycle it”, “Is it safe?”, or “I want pickup.”");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const chooseFile = (e) => {
    const selected = Array.from(e.target.files || []).slice(0, 4);
    if (!selected.length) return;
    setFiles(selected);
    setPreviews(selected.map((item) => URL.createObjectURL(item)));
    setResult("");
  };

  const scan = async () => {
    if (!files.length) return;
    setLoading(true);
    setResult("");
    try {
      const encoded = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ image: String(reader.result).split(",")[1], mimeType: file.type });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      })));
      const response = await fetch("/api/ai/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: encoded, question })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI scan failed");
      setResult(data.result);
    } catch (error) {
      setResult(error.message || "AI scan failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-card">
      <div className="ai-upload">
        <label className="upload-box">
          {previews.length ? <div className="preview-grid">{previews.map((src, i) => <img key={src} src={src} alt={`E-waste image ${i + 1}`} />)}</div> : <span className="upload-icon">⌁</span>}
          <strong>{files.length ? `${files.length} image${files.length > 1 ? "s" : ""} selected` : "Choose e-waste images"}</strong>
          <small>Upload up to 4 JPG, PNG or WEBP images</small>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={chooseFile} />
        </label>
        <div className="ai-controls">
          <textarea value={question} onChange={e => setQuestion(e.target.value)} />
          <button className="btn" disabled={!file || loading} onClick={scan}>{loading ? "Analysing…" : "Scan with AI →"}</button>
        </div>
      </div>
      <div className="ai-result">
        <span className="result-label">AI RESULT</span>
        {result ? <p>{result}</p> : <p className="muted">Your identification and recycling guidance will appear here.</p>}
      </div>
    </div>
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", type: "", message: "" });
  const [status, setStatus] = useState("");

  const submitPickup = async (e) => {
    e.preventDefault();
    setStatus("Sending request…");
    try {
      const res = await fetch("/api/pickup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStatus("♻ Request received! Our team will contact you soon.");
      setForm({ name: "", phone: "", type: "", message: "" });
    } catch {
      setStatus("Unable to send right now. Please try again.");
    }
  };

  return (
    <>
      <header className="nav">
        <a className="brand" href="#home"><span>♻</span> EcoCycle</a>
        <button className="menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">☰</button>
        <nav className={mobileOpen ? "open" : ""}>
          <a href="#home" onClick={() => setMobileOpen(false)}>Home</a>
          <a href="#services" onClick={() => setMobileOpen(false)}>Services</a>
          <a href="#process" onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="#impact" onClick={() => setMobileOpen(false)}>Impact</a>
          <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
        </nav>
        <a className="btn small" href="#pickup">Recycle Now</a>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-copy">
            <p className="eyebrow">♻ RESPONSIBLE E-WASTE RECYCLING</p>
            <h1>Turn old electronics into a <em>greener future.</em></h1>
            <p className="lead">Give unwanted phones, laptops, batteries and electronics a responsible second life through collection, reuse and recycling.</p>
            <div className="actions">
              <a className="btn" href="#pickup">Schedule Pickup →</a>
              <a className="text-btn" href="#services">Explore Services</a>
            </div>
            <div className="stats">
              <div><b>10K+</b><span>Devices collected</span></div>
              <div><b>85%</b><span>Material recovery</span></div>
              <div><b>100%</b><span>Responsible handling</span></div>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orb" />
            <div className="device laptop">💻</div>
            <div className="device phone">📱</div>
            <div className="device board">🔌</div>
            <div className="ring r1" />
            <div className="ring r2" />
          </div>
        </section>

        <section id="services" className="section">
          <div className="section-head">
            <p className="eyebrow">WHAT WE COLLECT</p>
            <h2>Every device deserves a second chance.</h2>
            <p>We help households, colleges and businesses move electronics into the right reuse or recycling stream.</p>
          </div>
          <div className="cards">
            {categories.map(([icon, title, desc]) => (
              <article key={title}><span>{icon}</span><h3>{title}</h3><p>{desc}</p></article>
            ))}
          </div>
        </section>

        <section id="process" className="process section">
          <div className="section-head">
            <p className="eyebrow">SIMPLE PROCESS</p>
            <h2>From e-waste to recovered resources.</h2>
          </div>
          <div className="steps">
            {steps.map(([num, title, desc]) => (
              <div key={num}><b>{num}</b><h3>{title}</h3><p>{desc}</p></div>
            ))}
          </div>
        </section>

        <section id="impact" className="impact section">
          <div>
            <p className="eyebrow">OUR IMPACT</p>
            <h2>Waste is only waste when we waste its potential.</h2>
            <p>Responsible e-waste management keeps valuable materials in circulation and reduces improper disposal.</p>
            <a className="btn" href="#pickup">Start Recycling</a>
          </div>
          <div className="impact-grid">
            {impact.map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}
          </div>
        </section>

        <section id="pickup" className="pickup section">
          <div>
            <p className="eyebrow">RECYCLE WITH US</p>
            <h2>Schedule an e-waste pickup.</h2>
            <p>Send your details and the API will validate the request. Connect a database or email service later without changing the UI.</p>
          </div>
          <form onSubmit={submitPickup}>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" />
            <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone number" type="tel" />
            <select required value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="">Select e-waste type</option>
              <option>Mobile / Tablet</option><option>Laptop / Computer</option><option>Battery</option><option>TV / Monitor</option><option>Other electronics</option>
            </select>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Quantity / pickup details" />
            <button className="btn" type="submit">Request Pickup →</button>
            <p className="form-msg" aria-live="polite">{status}</p>
          </form>
        </section>

        <section id="ai" className="ai-lab section">
          <div className="section-head">
            <p className="eyebrow">AI E-WASTE SCANNER</p>
            <h2>Upload an electronic item and let AI explain what it is.</h2>
            <p>Get an AI-generated identification, condition summary and responsible recycling guidance. Never expose your API key in the browser.</p>
          </div>
          <AiScanner />
        </section>

        <section id="contact" className="contact-strip">
          <div><p className="eyebrow">CONTACT</p><h2>Ready to clear your e-waste responsibly?</h2></div>
          <a className="btn" href="#pickup">Book a Collection</a>
        </section>
      </main>

      <footer>
        <div><a className="brand" href="#home"><span>♻</span> EcoCycle</a><p>Responsible collection, reuse and recycling for a cleaner electronic future.</p></div>
        <div><b>Quick Links</b><a href="#services">Services</a><a href="#process">Process</a><a href="#impact">Impact</a></div>
        <div><b>Compliance</b><p>Replace this placeholder with your actual business registration and authorized recycler details before publishing.</p></div>
      </footer>
    </>
  );
}