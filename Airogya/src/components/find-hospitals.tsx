"use client";

import { useState } from 'react';
import { MapPin, Search, Phone, Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { searchHospitals } from '@/app/actions';
import type { FindNearbyHospitalsOutput } from '@/ai/flows/find-nearby-hospitals';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';

type Hospital = FindNearbyHospitalsOutput['hospitals'][0];

export default function FindHospitals() {
  const { t } = useTranslation();
  const [pincode, setPincode] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.trim().length !== 6) {
      toast({
        variant: 'destructive',
        title: t('find_hospitals.invalid_pincode.title'),
        description: t('find_hospitals.invalid_pincode.description'),
      });
      return;
    }

    setLoading(true);
    setSearched(true);
    setHospitals([]);

    try {
      const result = await searchHospitals(pincode);
      setHospitals(result.hospitals);
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
      toast({
        variant: 'destructive',
        title: t('find_hospitals.search_failed.title'),
        description: t('find_hospitals.search_failed.description'),
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card className="shadow-lg flex flex-col bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          <span>{t('find_hospitals.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <form onSubmit={handleSearch} className="relative mb-4">
          <Input 
            placeholder={t('find_hospitals.placeholder')} 
            className="pr-10"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            disabled={loading}
            type="number"
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5 text-muted-foreground" />}
          </Button>
        </form>
        
        <ScrollArea className="flex-grow h-[250px] pr-3 -mr-3">
          <div className="space-y-4">
            {loading && (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {!loading && searched && hospitals.length === 0 && (
              <Alert>
                <AlertTitle>{t('find_hospitals.no_results.title')}</AlertTitle>
                <AlertDescription>
                  {t('find_hospitals.no_results.description')}
                </AlertDescription>
              </Alert>
            )}
            {!loading && hospitals.map((hospital, index) => (
              <div key={index} className="animate-fade-in">
                <div className="flex flex-col text-left">
                  <h4 className="font-semibold">{hospital.name}</h4>
                  <p className="text-sm text-muted-foreground">{hospital.address}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant={hospital.type === 'private' ? 'secondary' : 'default'}>{hospital.type}</Badge>
                    <Badge variant="outline">{hospital.hours}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <Button asChild variant="ghost" size="sm" className="p-0 h-auto">
                      <a href={hospital.directions} target="_blank" rel="noopener noreferrer">
                        <Send className="mr-1 h-4 w-4" /> {t('find_hospitals.get_directions')}
                      </a>
                    </Button>
                     <Button asChild variant="ghost" size="sm" className="p-0 h-auto">
                      <a href={hospital.phone}>
                        <Phone className="mr-1 h-4 w-4" /> {t('find_hospitals.call')}
                      </a>
                    </Button>
                  </div>
                </div>
                {index < hospitals.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
             {!searched && !loading && (
              <div className="text-center text-muted-foreground pt-10">
                <p>{t('find_hospitals.initial_prompt')}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
