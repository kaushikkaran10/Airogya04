"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Activity, AlertTriangle, CheckCircle, Heart } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const healthRiskSchema = z.object({
  age: z.coerce.number().min(1, "Age must be at least 1").max(120, "Please enter a valid age"),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Please select a gender" }),
  height: z.coerce.number().min(50, "Height must be at least 50cm").max(250, "Please enter a valid height"),
  weight: z.coerce.number().min(20, "Weight must be at least 20kg").max(300, "Please enter a valid weight"),
  smoking: z.enum(["yes", "no"], { required_error: "Please select an option" }),
  alcohol: z.enum(["yes", "no"], { required_error: "Please select an option" }),
  exercise: z.enum(["never", "rarely", "sometimes", "regularly", "daily"], { required_error: "Please select an option" }),
  diet: z.enum(["poor", "fair", "good", "excellent"], { required_error: "Please select an option" }),
  sleep: z.coerce.number().min(1, "Sleep hours must be at least 1").max(24, "Sleep hours cannot exceed 24"),
  stress: z.enum(["low", "moderate", "high", "very_high"], { required_error: "Please select an option" }),
  familyHistory: z.enum(["yes", "no"], { required_error: "Please select an option" }),
});

type HealthRiskFormData = z.infer<typeof healthRiskSchema>;

interface RiskResult {
  overallRisk: "Low" | "Moderate" | "High";
  bmi: number;
  bmiCategory: string;
  riskFactors: string[];
  recommendations: string[];
  score: number;
}

export default function HealthRiskAssessmentPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RiskResult | null>(null);

  const form = useForm<HealthRiskFormData>({
    resolver: zodResolver(healthRiskSchema),
    defaultValues: {
      age: '' as unknown as number,
      gender: undefined,
      height: '' as unknown as number,
      weight: '' as unknown as number,
      smoking: undefined,
      alcohol: undefined,
      exercise: undefined,
      diet: undefined,
      sleep: '' as unknown as number,
      stress: undefined,
      familyHistory: undefined,
    },
  });

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const assessHealthRisk = (data: HealthRiskFormData): RiskResult => {
    let score = 0;
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    const bmi = calculateBMI(data.weight, data.height);
    const bmiCategory = getBMICategory(bmi);

    // Age factor
    if (data.age > 65) {
      score += 15;
      riskFactors.push("Advanced age (>65)");
    } else if (data.age > 45) {
      score += 10;
      riskFactors.push("Middle age (45-65)");
    }

    // BMI factor
    if (bmi >= 30) {
      score += 20;
      riskFactors.push("Obesity (BMI ≥30)");
      recommendations.push("Consider weight management through diet and exercise");
    } else if (bmi >= 25) {
      score += 10;
      riskFactors.push("Overweight (BMI 25-29.9)");
      recommendations.push("Maintain healthy weight through balanced diet");
    } else if (bmi < 18.5) {
      score += 10;
      riskFactors.push("Underweight (BMI <18.5)");
      recommendations.push("Consider consulting a nutritionist for healthy weight gain");
    }

    // Smoking
    if (data.smoking === "yes") {
      score += 25;
      riskFactors.push("Smoking");
      recommendations.push("Consider quitting smoking - consult healthcare provider for support");
    }

    // Alcohol
    if (data.alcohol === "yes") {
      score += 10;
      riskFactors.push("Regular alcohol consumption");
      recommendations.push("Limit alcohol consumption to recommended guidelines");
    }

    // Exercise
    if (data.exercise === "never") {
      score += 20;
      riskFactors.push("Sedentary lifestyle");
      recommendations.push("Start with light physical activity like walking 30 minutes daily");
    } else if (data.exercise === "rarely") {
      score += 15;
      riskFactors.push("Insufficient physical activity");
      recommendations.push("Increase physical activity to at least 150 minutes per week");
    } else if (data.exercise === "regularly" || data.exercise === "daily") {
      recommendations.push("Great job maintaining regular physical activity!");
    }

    // Diet
    if (data.diet === "poor") {
      score += 15;
      riskFactors.push("Poor diet quality");
      recommendations.push("Focus on eating more fruits, vegetables, and whole grains");
    } else if (data.diet === "fair") {
      score += 8;
      riskFactors.push("Fair diet quality");
      recommendations.push("Continue improving diet with more nutritious foods");
    } else if (data.diet === "excellent") {
      recommendations.push("Excellent dietary habits - keep it up!");
    }

    // Sleep
    if (data.sleep < 6 || data.sleep > 9) {
      score += 10;
      riskFactors.push("Inadequate sleep duration");
      recommendations.push("Aim for 7-9 hours of quality sleep per night");
    }

    // Stress
    if (data.stress === "very_high") {
      score += 15;
      riskFactors.push("Very high stress levels");
      recommendations.push("Consider stress management techniques like meditation or counseling");
    } else if (data.stress === "high") {
      score += 10;
      riskFactors.push("High stress levels");
      recommendations.push("Practice stress reduction activities like yoga or deep breathing");
    }

    // Family history
    if (data.familyHistory === "yes") {
      score += 15;
      riskFactors.push("Family history of chronic diseases");
      recommendations.push("Regular health screenings are important due to family history");
    }

    // Determine overall risk
    let overallRisk: "Low" | "Moderate" | "High";
    if (score <= 30) {
      overallRisk = "Low";
      recommendations.push("Maintain your healthy lifestyle habits");
    } else if (score <= 60) {
      overallRisk = "Moderate";
      recommendations.push("Consider making lifestyle improvements to reduce health risks");
    } else {
      overallRisk = "High";
      recommendations.push("Strongly recommend consulting with a healthcare provider");
    }

    return {
      overallRisk,
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      riskFactors,
      recommendations,
      score,
    };
  };

  const onSubmit: SubmitHandler<HealthRiskFormData> = async (data) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const riskResults = assessHealthRisk(data);
    setResults(riskResults);
    setLoading(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600";
      case "Moderate": return "text-yellow-600";
      case "High": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Low": return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "Moderate": return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case "High": return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default: return <Activity className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">{t('health.risk.assessment.title')}</h1>
          </div>
          <p className="text-lg text-gray-600">{t('health.risk.assessment.subtitle')}</p>
        </div>

        {!results ? (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Health Assessment Form</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('health.risk.assessment.form.age')}</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="30" {...field} />
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
                          <FormLabel>{t('health.risk.assessment.form.gender')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('health.risk.assessment.form.height')}</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="170" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('health.risk.assessment.form.weight')}</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="70" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sleep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('health.risk.assessment.form.sleep')}</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="8" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="smoking"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{t('health.risk.assessment.form.smoking')}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="smoking-yes" />
                                <FormLabel htmlFor="smoking-yes">{t('health.risk.assessment.options.yes')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="smoking-no" />
                                <FormLabel htmlFor="smoking-no">{t('health.risk.assessment.options.no')}</FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="alcohol"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{t('health.risk.assessment.form.alcohol')}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="alcohol-yes" />
                                <FormLabel htmlFor="alcohol-yes">{t('health.risk.assessment.options.yes')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="alcohol-no" />
                                <FormLabel htmlFor="alcohol-no">{t('health.risk.assessment.options.no')}</FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="exercise"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{t('health.risk.assessment.form.exercise')}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 md:grid-cols-2 gap-3"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="never" id="exercise-never" />
                                <FormLabel htmlFor="exercise-never">{t('health.risk.assessment.options.exercise.never')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="rarely" id="exercise-rarely" />
                                <FormLabel htmlFor="exercise-rarely">{t('health.risk.assessment.options.exercise.rarely')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="sometimes" id="exercise-sometimes" />
                                <FormLabel htmlFor="exercise-sometimes">{t('health.risk.assessment.options.exercise.sometimes')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="regularly" id="exercise-regularly" />
                                <FormLabel htmlFor="exercise-regularly">{t('health.risk.assessment.options.exercise.regularly')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="daily" id="exercise-daily" />
                                <FormLabel htmlFor="exercise-daily">{t('health.risk.assessment.options.exercise.daily')}</FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="diet"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{t('health.risk.assessment.form.diet')}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="poor" id="diet-poor" />
                                <FormLabel htmlFor="diet-poor">{t('health.risk.assessment.options.diet.poor')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fair" id="diet-fair" />
                                <FormLabel htmlFor="diet-fair">{t('health.risk.assessment.options.diet.fair')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="good" id="diet-good" />
                                <FormLabel htmlFor="diet-good">{t('health.risk.assessment.options.diet.good')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="excellent" id="diet-excellent" />
                                <FormLabel htmlFor="diet-excellent">{t('health.risk.assessment.options.diet.excellent')}</FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stress"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{t('health.risk.assessment.form.stress')}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="low" id="stress-low" />
                                <FormLabel htmlFor="stress-low">{t('health.risk.assessment.options.stress.low')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="moderate" id="stress-moderate" />
                                <FormLabel htmlFor="stress-moderate">{t('health.risk.assessment.options.stress.moderate')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="high" id="stress-high" />
                                <FormLabel htmlFor="stress-high">{t('health.risk.assessment.options.stress.high')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="very_high" id="stress-very-high" />
                                <FormLabel htmlFor="stress-very-high">{t('health.risk.assessment.options.stress.very_high')}</FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="familyHistory"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{t('health.risk.assessment.form.family_history')}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="family-yes" />
                                <FormLabel htmlFor="family-yes">{t('health.risk.assessment.options.yes')}</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="family-no" />
                                <FormLabel htmlFor="family-no">{t('health.risk.assessment.options.no')}</FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full py-3 text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      t('health.risk.assessment.form.submit')
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {getRiskIcon(results.overallRisk)}
                  <CardTitle className={`text-3xl ml-3 ${getRiskColor(results.overallRisk)}`}>
                    {results.overallRisk} Risk
                  </CardTitle>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">BMI</p>
                    <p className="text-2xl font-bold">{results.bmi}</p>
                    <p className="text-sm text-gray-600">{results.bmiCategory}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Risk Score</p>
                    <p className="text-2xl font-bold">{results.score}/100</p>
                    <Progress value={results.score} className="w-20 mt-2" />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {results.riskFactors.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-red-600 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Risk Factors Identified
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.riskFactors.map((factor, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-green-600 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button 
                onClick={() => {
                  setResults(null);
                  form.reset();
                }}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                Take Assessment Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}