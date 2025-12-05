'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PlacesAutocomplete from '@/components/ui/places-autocomplete';
import { toast } from 'sonner';
import { Sparkles, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';

export default function GenerateChartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthLocation: '',
  });
  const [errors, setErrors] = useState({
    birthDate: false,
    birthTime: false,
    birthLocation: false,
  });

  const validateForm = () => {
    const newErrors = {
      birthDate: !formData.birthDate,
      birthTime: !formData.birthTime,
      birthLocation: !formData.birthLocation,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate chart');
      }

      if (data.success) {
        toast.success('Chart calculated successfully!');

        // Redirect to my-chart page to view the chart
        router.push('/my-chart');
      } else {
        throw new Error(data.error || 'Failed to calculate chart');
      }
    } catch (error) {
      console.error('Chart calculation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to calculate chart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-2xl shadow-2xl border-primary/20">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
            Generate Your <span className="text-primary italic">Human Design</span> Chart
          </CardTitle>
          <CardDescription className="text-lg">
            Enter your birth details to calculate your unique Human Design chart
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Birth Date */}
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-base font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Birth Date
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => {
                  setFormData({ ...formData, birthDate: e.target.value });
                  setErrors({ ...errors, birthDate: false });
                }}
                className={errors.birthDate ? 'border-red-400' : ''}
                required
              />
              {errors.birthDate && (
                <p className="text-sm text-red-500">Birth date is required</p>
              )}
            </div>

            {/* Birth Time */}
            <div className="space-y-2">
              <Label htmlFor="birthTime" className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Birth Time
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="birthTime"
                type="time"
                value={formData.birthTime}
                onChange={(e) => {
                  setFormData({ ...formData, birthTime: e.target.value });
                  setErrors({ ...errors, birthTime: false });
                }}
                className={errors.birthTime ? 'border-red-400' : ''}
                required
              />
              {errors.birthTime && (
                <p className="text-sm text-red-500">Birth time is required for accurate calculations</p>
              )}
              <p className="text-sm text-muted-foreground">
                Enter the exact time you were born. If you don't know, check your birth certificate or ask your parents.
              </p>
            </div>

            {/* Birth Location */}
            <div className="space-y-2">
              <Label htmlFor="birthLocation" className="text-base font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Birth Location
                <span className="text-red-500">*</span>
              </Label>
              <PlacesAutocomplete
                value={formData.birthLocation}
                onChange={(value) => {
                  setFormData({ ...formData, birthLocation: value });
                  setErrors({ ...errors, birthLocation: false });
                }}
                placeholder="City, Country (e.g., Manila, Philippines)"
                error={errors.birthLocation}
              />
              {errors.birthLocation && (
                <p className="text-sm text-red-500">Birth location is required</p>
              )}
              <p className="text-sm text-muted-foreground">
                Start typing your birth city and select from the suggestions
              </p>
            </div>

            {/* Privacy Notice */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-primary">Privacy:</strong> Your birth information is securely stored and only used to calculate your Human Design chart. We never share your personal data.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-lg bg-gradient-to-r from-primary to-accent hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Calculating Your Chart...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Calculate My Chart
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
