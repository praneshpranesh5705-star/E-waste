"use client";

import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  async function loadRequests() {
    setMessage("Loading…");
    const res = await fetch("/api/admin/requests", {
      headers: { "x-admin-password": password },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Unable to load requests.");
      return;
    }
    setRequests(data.requests || []);
    setMessage((data.requests?.length || 0) + " pickup requests");
  }

  return (
    <main className="admin-page">
      <div className="admin-top">
        <a className="brand" href="/"><span>♻</span> EcoCycle Admin</a>
        <a href="/">← Back to website</a>
      </div>
      <section className="admin-card">
        <p className="eyebrow">PRIVATE DASHBOARD</p>
        <h1>Pickup requests</h1>
        <p>Enter the configured admin password to view recent customer requests.</p>
        <div className="admin-login">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password" />
          <button className="btn" onClick={loadRequests}>Load Requests</button>
        </div>
        <p className="form-msg">{message}</p>
        <div className="request-list">
          {requests.map((item) => (
            <article className="request-item" key={item.id || item.created_at}>
              <div><strong>{item.name}</strong><span>{item.phone}</span></div>
              <div><b>{item.type}</b><span>{item.message || "No extra details"}</span></div>
              <small>{item.created_at ? new Date(item.created_at).toLocaleString() : "New request"}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}