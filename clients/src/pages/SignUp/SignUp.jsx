import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ name, email });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6">
      <div className="w-full max-w-md p-8 rounded-xl card-dark border border-[var(--border-subtle)]">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-6 text-center">
          Create your NoteForge account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="input-dark w-full px-4 py-2.5"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input-dark w-full px-4 py-2.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input-dark w-full px-4 py-2.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-glow w-full py-2.5 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition"
          >
            Sign Up
          </button>
          <p className="text-center text-sm text-[var(--text-secondary)] mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--accent)] font-medium hover:text-[var(--accent-hover)] transition underline underline-offset-2">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;