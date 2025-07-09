"use client";

import React, { useState } from "react";
import "./RegisterCompanyAdminEmail.css";

export default function RegisterCompanyAdminEmail() {
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const registerCompanyAdminEmail = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8001/api/v1/registerCompanyAdminEmail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ allowedEmails: adminEmail }),
        }
      );

      console.log("Sending email:", adminEmail);

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.message || "Failed to register company admin email"
        );

      setMessage("Company admin email registered successfully!");
      setAdminEmail(""); // Clear the form after success
    } catch (err) {
      setError(
        err.message || "Error occurred while adding company admin email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-admin-container">
      <div className="register-admin-card">
        <div className="register-admin-header">
          <div className="register-admin-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="m22 2-5 5" />
              <path d="m17 7 5-5" />
            </svg>
          </div>
          <h2 className="register-admin-title">Register Company Admin</h2>
          <p className="register-admin-subtitle">
            Add a new company administrator email to your organization
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            registerCompanyAdminEmail();
          }}
          className="register-admin-form"
        >
          <div className="form-group">
            <label className="form-label" htmlFor="adminEmail">
              Administrator Email Address
            </label>
            <div className="input-wrapper">
              <input
                id="adminEmail"
                type="email"
                className="form-input"
                placeholder="Enter admin email address"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                disabled={loading}
              />
              <div className="input-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`submit-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Registering...</span>
              </>
            ) : (
              <>
                <span>Add Administrator</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        {message && (
          <div className="alert alert-success">
            <div className="alert-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
            </div>
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
