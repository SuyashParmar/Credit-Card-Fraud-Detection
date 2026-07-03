import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Activity, Terminal, Lock, User, Hash } from 'lucide-react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const DEFAULT_PAYLOAD = "-1.3598071336738,-0.0727811733098497,2.53634673796914,1.37815522427443,-0.338320769942518,0.462387777762292,0.239598554061257,0.0986979012610507,0.363786969611213,0.0907941719789316,-0.551599533260813,-0.617800855762348,-0.991389847235408,-0.311169353699879,1.46817697209427,-0.470400525259478,0.207971241929242,0.0257905801985591,0.403992960255733,0.251412098239705,-0.018306777944153,0.277837575558899,-0.110473910188767,0.0669280749146731,0.128539358273528,-0.189114843888824,0.133558376740387,-0.0210530534538215,149.62";

export default function App() {
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{ prediction: string; probability: number | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setResult(null);
    setError(null);

    try {
      // Small simulated delay for the "scanning" animation effect
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Network response was not ok");
      }

      const data = await response.json();
      setResult({
        prediction: data.prediction,
        probability: data.probability,
      });
    } catch (err: any) {
      setError(err.message || "Failed to connect to the backend.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <>
      <div className="bg-mesh" />
      <div className="deco-grid" />
      
      <div className="terminal-container">
        <header className="terminal-header">
          <div className="brand">
            <div className="brand-icon">
              <Terminal size={24} />
            </div>
            <div>
              <h1>FRAUD-X TERMINAL</h1>
              <span>v2.0 // Secured Network</span>
            </div>
          </div>
          <Lock size={20} className="text-muted" style={{ color: "var(--text-muted)" }} />
        </header>

        <main className={`glass-card ${isScanning ? 'scanning' : ''}`}>
          <div className="scanner-line" />
          
          <form onSubmit={handleScan} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Simulated Human Fields for Aesthetics */}
            <div>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <User size={14} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                Simulated Transaction Context
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input type="text" className="simulated" readOnly value="JOHN DOE" />
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" className="simulated" readOnly value="**** **** **** 4242" />
                </div>
                <div className="form-group">
                  <label>Merchant ID</label>
                  <input type="text" className="simulated" readOnly value="MERCH_982371X" />
                </div>
              </div>
            </div>

            {/* Raw Data Payload */}
            <div>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-indigo)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <Hash size={14} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                Encrypted Data Payload (V1-V28 + Amount)
              </h3>
              <div className="form-group">
                <label>Raw CSV Vector</label>
                <textarea 
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  placeholder="Enter exactly 29 comma-separated numeric features..."
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-scan" disabled={isScanning || !payload}>
              <Activity size={18} className={isScanning ? 'animate-spin' : ''} />
              {isScanning ? 'RUNNING HEURISTICS...' : 'INITIALIZE SCAN'}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(244,63,94,0.1)', border: '1px solid var(--accent-rose)', borderRadius: '8px', color: 'var(--accent-rose)' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className={`result-card ${result.prediction === 'Fraudulent' ? 'result-fraud' : 'result-legit'}`}>
              <div className="result-icon">
                {result.prediction === 'Fraudulent' ? <ShieldAlert size={40} /> : <ShieldCheck size={40} />}
              </div>
              <h2 className="result-title">
                {result.prediction.toUpperCase()}
              </h2>
              {result.probability !== null && (
                <p className="result-probability">
                  Confidence Score: {(result.probability * 100).toFixed(2)}%
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
