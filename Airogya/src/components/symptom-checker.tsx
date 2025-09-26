
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertTriangle, HeartPulse, Sparkles, Send, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { analyzeSymptoms, chatWithN8n, chatWithGemini } from "@/app/actions";
import type { AnalyzeSymptomsOutput } from "@/ai/flows/analyze-symptoms-and-suggest-conditions";
import ConditionCard from "./condition-card";
import GuidanceCard from "./guidance-card";
import EmergencyPopup from "./emergency-popup";
import AIAnalysisResults from "./ai-analysis-results";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useLanguage } from "@/context/language-context";
import { analyzeEmergency, formatEmergencyMessage } from "@/lib/emergency-detection";
import { useEmergency } from "@/contexts/emergency-context";
import ReactMarkdown from 'react-markdown';

type Severity = "Mild" | "Moderate" | "Severe";

interface Message {
  type: 'user' | 'bot';
  text: string;
}

const userDetailsSchema = z.object({
  age: z.coerce.number().min(0, "Age cannot be negative.").max(120, "Please enter a valid age."),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Please select a gender." }),
});

type UserDetails = z.infer<typeof userDetailsSchema>;

const CheckerContent = ({
  setResults,
}: {
  setResults: (results: AnalyzeSymptomsOutput | null) => void;
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { triggerEmergency, canTriggerEmergency } = useEmergency();
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<'details' | 'chat'>('details');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [sessionId, setSessionId] = useState<string>(`session_${Date.now()}`);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<UserDetails>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      age: '' as unknown as number,
      gender: undefined,
    },
  });
  
  useEffect(() => {
    setMessages([{type: 'bot', text: t('symptom_checker.greeting.anonymous')}]);
  }, [t]);


  const onUserDetailsSubmit: SubmitHandler<UserDetails> = (data) => {
    setUserDetails(data);
    setStep('chat');
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const scrollableNode = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableNode) {
            scrollableNode.scrollTo({
                top: scrollableNode.scrollHeight,
                behavior: "smooth",
            });
        }
    }
  };

  // Auto-resize textarea
  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = Math.min(element.scrollHeight, 128) + 'px';
  };

  useEffect(() => {
    if (messages.length) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSymptomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() || loading || !userDetails) return;

    const userMessage: Message = { type: 'user', text: symptoms };
    setMessages(prev => [...prev, userMessage]);
    setSymptoms("");
    setLoading(true);
    setResults(null);
    
    // Check for emergency keywords before processing
    const emergencyAnalysis = analyzeEmergency(symptoms);
    
    // Use emergency context for clean state management
    if (emergencyAnalysis.isEmergency && canTriggerEmergency()) {
      triggerEmergency('critical');
      const emergencyMessage: Message = { 
        type: 'bot', 
        text: formatEmergencyMessage(emergencyAnalysis) 
      };
      setMessages(prev => [...prev, emergencyMessage]);
      setLoading(false);
      return;
    }

    try {
      // Use Gemini AI instead of n8n chat
      const chatResponse = await chatWithGemini({
        message: symptoms,
        sessionId: sessionId,
        userDetails: {
          age: userDetails.age,
          gender: userDetails.gender,
        },
      });

      if (chatResponse.success) {
        const botMessage: Message = { type: 'bot', text: chatResponse.response };
        setMessages(prev => [...prev, botMessage]);
        
        // Only check AI response for emergency if we can trigger one
        if (canTriggerEmergency() && 
            (chatResponse.response.includes('EMERGENCY ALERT') || chatResponse.response.includes('Call 112'))) {
          triggerEmergency('high');
        }
        
        // Update session ID if provided
        if (chatResponse.sessionId) {
          setSessionId(chatResponse.sessionId);
        }
      } else {
        // Handle API errors gracefully
        const errorResponse = chatResponse.response || chatResponse.error || 'Failed to get response from AI service';
        const botMessage: Message = { type: 'bot', text: errorResponse };
        setMessages(prev => [...prev, botMessage]);
        
        // Show toast for technical errors but not for user-friendly API responses
        if (chatResponse.error && !chatResponse.response) {
          toast({
            variant: "destructive",
            title: t('symptom_checker.error.title'),
            description: chatResponse.error,
          });
        }
      }

      // Run the original analysis for condition cards
      try {
        const analysisResults = await analyzeSymptoms({
          symptoms,
          age: userDetails.age,
          gender: userDetails.gender as 'Male' | 'Female' | 'Other',
          language: language,
        });
        setResults(analysisResults);

        // No automatic emergency triggering here - let user manually trigger if needed

      } catch (analysisError) {
        console.warn('Analysis failed, but Gemini chat succeeded:', analysisError);
      }

    } catch (err: any) {
      let errorMessage = t('symptom_checker.error.description');
      
      // Handle specific error types
      if (err instanceof Error) {
        if (err.message.includes('503') || err.message.includes('Service Unavailable')) {
          errorMessage = "The AI service is temporarily overloaded. Please wait a moment and try again.";
        } else if (err.message.includes('429') || err.message.includes('Too Many Requests')) {
          errorMessage = "Too many requests. Please wait a moment before trying again.";
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = "Unable to connect to the AI service. Please check your internet connection and try again.";
        }
      }
      
      const botMessage: Message = { type: 'bot', text: errorMessage };
      setMessages(prev => [...prev, botMessage]);
      toast({
        variant: "destructive",
        title: t('symptom_checker.error.title'),
        description: errorMessage,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getHighestSeverity = (conditions: AnalyzeSymptomsOutput['conditions']): Severity | null => {
    if (!conditions || conditions.length === 0) return null;
    const severities = conditions.map(c => c.severity);
    if (severities.includes('Severe')) return 'Severe';
    if (severities.includes('Moderate')) return 'Moderate';
    return 'Mild';
  };
  
  const resetChecker = () => {
    setStep('details');
    setUserDetails(null);
    setMessages([{type: 'bot', text: t('symptom_checker.greeting.anonymous')}]);
    setResults(null);
    setSymptoms('');
    setSessionId(`session_${Date.now()}`); // Reset session ID
    form.reset();
  }

  return (
     <div className="w-full">
        <Card className="bg-card/50 backdrop-blur-sm rounded-lg border p-4 h-[600px] flex flex-col shadow-lg">
          {step === 'details' && (
            <div className="flex flex-col justify-center h-full text-left p-4 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 text-center">{t('symptom_checker.details_form.title')}</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onUserDetailsSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('symptom_checker.details_form.age')}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder={t('symptom_checker.details_form.age_placeholder')} {...field} value={field.value || ''}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('symptom_checker.details_form.gender')}</FormLabel>
                        <FormControl>
                           <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="Male" /></FormControl>
                              <FormLabel className="font-normal">{t('symptom_checker.details_form.male')}</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="Female" /></FormControl>
                              <FormLabel className="font-normal">{t('symptom_checker.details_form.female')}</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="Other" /></FormControl>
                              <FormLabel className="font-normal">{t('symptom_checker.details_form.other')}</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">{t('symptom_checker.details_form.continue')}</Button>
                </form>
              </Form>
            </div>
          )}
          {step === 'chat' && (
            <div className="flex flex-col h-full bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <style dangerouslySetInnerHTML={{
                __html: `
                  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                  * { font-family: 'Inter', 'Helvetica Neue', sans-serif; }
                  
                  .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                  }
                  
                  .typing-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #10b981;
                    animation: typing 1.4s infinite ease-in-out;
                  }
                  
                  .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                  .typing-dot:nth-child(2) { animation-delay: -0.16s; }
                  
                  @keyframes typing {
                    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                  }
                  
                  .message-enter {
                    animation: messageSlideIn 0.3s ease-out;
                  }
                  
                  @keyframes messageSlideIn {
                    from {
                      opacity: 0;
                      transform: translateY(10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                  
                  .chat-scrollbar::-webkit-scrollbar {
                    width: 6px;
                  }
                  
                  .chat-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                  }
                  
                  .chat-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.5);
                    border-radius: 3px;
                  }
                  
                  .chat-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.7);
                  }
                `
              }} />
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
                <div className="flex items-center gap-3 ml-2">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                      <HeartPulse className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-800"></div>
                  </div>
                  <div>
                     <h3 className="text-sm font-semibold text-white">Airogya</h3>
                     <p className="text-xs text-emerald-400">AI Medical Assistant</p>
                   </div>
                </div>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="ghost" 
                  onClick={resetChecker} 
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </div>
              
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto chat-scrollbar p-4 space-y-4 min-h-0">
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-3 message-enter ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {/* Avatar */}
                    {message.type === 'bot' && (
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                          <HeartPulse className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Message Bubble */}
                    <div className={`flex flex-col max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`rounded-2xl px-4 py-3 shadow-lg ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md' 
                          : 'bg-slate-700/80 text-slate-100 rounded-bl-md border border-slate-600/50'
                      }`}>
                        {message.type === 'bot' ? (
                          <div className="prose prose-sm prose-invert max-w-none text-left">
                            <ReactMarkdown 
                              components={{
                                h1: ({children}) => <h1 className="text-base font-bold mb-2 text-white text-left">{children}</h1>,
                                h2: ({children}) => <h2 className="text-sm font-semibold mb-2 text-white text-left">{children}</h2>,
                                h3: ({children}) => <h3 className="text-sm font-semibold mb-1 text-white text-left">{children}</h3>,
                                p: ({children}) => <p className="mb-2 text-slate-100 leading-relaxed text-sm text-left">{children}</p>,
                                ul: ({children}) => <ul className="list-none space-y-1 mb-2 text-left">{children}</ul>,
                                li: ({children}) => <li className="flex items-start gap-2 text-slate-100 text-sm text-left">
                                  <span className="text-emerald-400 mt-1 text-xs">•</span>
                                  <span>{children}</span>
                                </li>,
                                strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                                em: ({children}) => <em className="italic text-slate-200">{children}</em>,
                                code: ({children}) => <code className="bg-slate-800/50 px-1 py-0.5 rounded text-emerald-400 text-xs">{children}</code>,
                              }}
                            >
                              {message.text}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 mt-1 px-1">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* User Avatar */}
                    {message.type === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {loading && messages.length > 0 && messages[messages.length-1].type === 'user' && (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                      <HeartPulse className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-slate-700/80 rounded-2xl rounded-bl-md px-4 py-3 border border-slate-600/50 shadow-lg">
                      <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Input Form */}
              <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
                <form onSubmit={handleSymptomSubmit} className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                       value={symptoms}
                       onChange={(e) => {
                         setSymptoms(e.target.value);
                         adjustTextareaHeight(e.target);
                       }}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleSymptomSubmit(e);
                         }
                       }}
                       placeholder="Describe your symptoms..."
                       className="w-full min-h-[44px] max-h-32 resize-none rounded-2xl bg-slate-700/50 border border-slate-600/50 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                       disabled={loading}
                       rows={1}
                       style={{
                         scrollbarWidth: 'thin',
                         scrollbarColor: 'rgba(16, 185, 129, 0.5) transparent'
                       }}
                     />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      <button 
                        type="submit" 
                        disabled={loading || !symptoms.trim()}
                        className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </form>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Press Enter to send • Shift+Enter for new line
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
  )
}

export default function SymptomChecker() {
  const { t } = useTranslation();
  const [results, setResults] = useState<AnalyzeSymptomsOutput | null>(null);
  const { showEmergencyAlert, emergencySeverity, closeEmergency } = useEmergency();

  const getHighestSeverity = (conditions: AnalyzeSymptomsOutput['conditions']): Severity | null => {
    if (!conditions || conditions.length === 0) return null;
    const severities = conditions.map(c => c.severity);
    if (severities.includes('Severe')) return 'Severe';
    if (severities.includes('Moderate')) return 'Moderate';
    return 'Mild';
  };

  const highestSeverity = results ? getHighestSeverity(results.conditions) : null;

  return (
    <section className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 mb-6 animate-float">
          <Sparkles className="w-10 h-10 text-green-400 animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-fadeInUp">
          {t('symptom_checker.title')}
        </h1>
        
        <div className="w-full mt-8 animate-slideInLeft">
          <CheckerContent setResults={setResults} />
        </div>
      </div>

      {results && (
        <AIAnalysisResults 
          results={results}
          showEmergencyAlert={showEmergencyAlert}
        />
      )}

      <EmergencyPopup 
        isOpen={showEmergencyAlert} 
        onClose={closeEmergency}
        severity={emergencySeverity}
      />
    </section>
  );
}
