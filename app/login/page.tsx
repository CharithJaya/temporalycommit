"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/lib/auth';
import { GraduationCap, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        router.push('/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gray-900 overflow-hidden">
      
      {/* Animated blobs */}
      <div className="blob absolute inset-0 m-auto w-[350px] h-[350px] border-2 border-white/20 z-0"></div>
      <div className="blob absolute inset-0 m-auto w-[350px] h-[350px] border-2 border-white/20 z-0"></div>
      <div className="blob absolute inset-0 m-auto w-[350px] h-[350px] border-2 border-white/20 z-0"></div>

      <Card className="relative w-full max-w-md z-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to TuitionApp</CardTitle>
          <CardDescription>
            Sign in to your account to access the management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Admin:</strong> admin@gmail.com / password</p>
              {/* <p><strong>Student:</strong> charithjc97@gmail.com / password</p> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tailwind CSS keyframes for blob animation */}
      <style jsx global>{`
        @keyframes morph {
          0% { border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%; }
          50% { border-radius: 41% 44% 56% 59% / 38% 62% 63% 37%; }
          100% { border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%; }
        }

        .blob {
          animation: morph 8s ease-in-out infinite;
          position: absolute;
          inset: 0;
          margin: auto;
          width: 350px;
          height: 350px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          z-index: 0;
        }

        .blob:nth-child(2) {
          animation-duration: 12s;
        }

        .blob:nth-child(3) {
          animation-duration: 20s;
        }
      `}</style>
    </div>
  );
}
