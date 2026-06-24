'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    checkPasswordStrength(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate all fields
      if (!username.trim() || !fullName.trim() || !email.trim() || !password.trim()) {
        setError('All fields are required');
        setIsLoading(false);
        return;
      }

      if (username.length < 3) {
        setError('Username must be at least 3 characters');
        setIsLoading(false);
        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        setIsLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // TODO: Call your register API endpoint
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, fullName, email, password }),
      // });

      console.log('Register attempt:', { username, fullName, email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColors = ['bg-destructive/20', 'bg-yellow-500/20', 'bg-blue-500/20', 'bg-green-500/20'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            CompileX
          </h1>
          <p className="text-muted-foreground">Join the competitive programming community</p>
        </div>

        {/* Register Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-foreground">Create your account</h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              {/* Full Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={handlePasswordChange}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-border/30'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Strength: <span className="text-foreground font-medium">{strengthLabels[Math.max(0, passwordStrength - 1)]}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-background/50 rounded-lg p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Password requirements:</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-500' : ''}`}>
                    {password.length >= 8 && <Check className="w-3 h-3" />}
                    {password.length < 8 && <div className="w-3 h-3 rounded-full border border-current" />}
                    At least 8 characters
                  </li>
                  <li className={`flex items-center gap-2 ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-500' : ''}`}>
                    {/[a-z]/.test(password) && /[A-Z]/.test(password) && <Check className="w-3 h-3" />}
                    {(!(/[a-z]/.test(password)) || !(/[A-Z]/.test(password))) && <div className="w-3 h-3 rounded-full border border-current" />}
                    Mix of uppercase and lowercase
                  </li>
                  <li className={`flex items-center gap-2 ${/\d/.test(password) ? 'text-green-500' : ''}`}>
                    {/\d/.test(password) && <Check className="w-3 h-3" />}
                    {!/\d/.test(password) && <div className="w-3 h-3 rounded-full border border-current" />}
                    At least one number
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card/50 text-muted-foreground">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full border-border/50 hover:bg-background/50"
              >
                Sign in instead
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By registering, you agree to our{' '}
          <Link href="#" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}
