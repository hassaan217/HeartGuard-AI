// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Activity, Users, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, ChevronRight, CheckCircle, AlertCircle, BarChart3, Brain, Download, AlertTriangle, Shield, Zap, Star, Calendar, Clock, TrendingUp, User, Activity as ActivityIcon, Info, Github, Sparkles, Stethoscope, FileText, Settings, HelpCircle, X, Menu, ArrowRight, TrendingDown, Award, Target } from 'lucide-react';

function App() {
  // State for form
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    chest_pain_type: '1',
    bp: '',
    cholesterol: '',
    fbs_over_120: '0',
    ekg_results: '0',
    max_hr: '',
    exercise_angina: '0',
    st_depression: '',
    slope_st: '1',
    num_vessels_fluro: '0',
    thallium: '3',
  });

  // State for result and loading status
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [showTips, setShowTips] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [progress, setProgress] = useState(0);

  // Calculate form progress
  useEffect(() => {
    const requiredFields = ['age', 'sex', 'bp', 'cholesterol', 'max_hr', 'st_depression'];
    const filledFields = requiredFields.filter(field => formData[field]).length;
    setProgress((filledFields / requiredFields.length) * 100);
  }, [formData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = [];
    const warnings = [];

    // Required fields
    const requiredFields = ['age', 'sex', 'bp', 'cholesterol', 'max_hr', 'st_depression'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors.push(`${field.replace('_', ' ')} is required`);
      }
    });

    // Age validation
    if (formData.age) {
      const age = parseFloat(formData.age);
      if (age < 20 || age > 100) {
        warnings.push('Age should typically be between 20-100 years');
      }
    }

    // Blood Pressure validation
    if (formData.bp) {
      const bp = parseFloat(formData.bp);
      if (bp < 50 || bp > 250) {
        warnings.push('Blood pressure outside typical range (50-250 mm Hg)');
      } else if (bp > 140) {
        warnings.push('Elevated blood pressure detected');
      }
    }

    // Cholesterol validation
    if (formData.cholesterol) {
      const chol = parseFloat(formData.cholesterol);
      if (chol < 100 || chol > 600) {
        warnings.push('Cholesterol outside typical range (100-600 mg/dl)');
      } else if (chol > 240) {
        warnings.push('High cholesterol level detected');
      }
    }

    // Max Heart Rate validation
    if (formData.max_hr) {
      const hr = parseFloat(formData.max_hr);
      const age = parseFloat(formData.age);
      if (age && hr) {
        const maxPredictedHR = 220 - age;
        if (hr > maxPredictedHR * 1.1) {
          warnings.push('Heart rate exceeds typical maximum for age');
        }
      }
    }

    return { errors, warnings };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    // Validate form
    const { errors, warnings } = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      setIsLoading(false);
      return;
    }

    // Show warnings if any
    if (warnings.length > 0) {
      console.log('Warnings:', warnings);
    }

    try {
      // Convert form data to match backend expectations
      const requestData = {
        Age: parseFloat(formData.age),
        Sex: parseInt(formData.sex),
        chest_pain_type: parseInt(formData.chest_pain_type),
        BP: parseFloat(formData.bp),
        Cholesterol: parseFloat(formData.cholesterol),
        fbs_over_120: parseInt(formData.fbs_over_120),
        ekg_results: parseInt(formData.ekg_results),
        Max_HR: parseFloat(formData.max_hr),
        exercise_angina: parseInt(formData.exercise_angina),
        ST_depression: parseFloat(formData.st_depression),
        slope_st: parseInt(formData.slope_st),
        num_vessels_fluro: parseInt(formData.num_vessels_fluro),
        Thallium: parseFloat(formData.thallium),
      };

      console.log("📤 Sending data to backend:", requestData);

      const response = await axios.post('http://localhost:8000/predict', requestData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      console.log("📥 Received response:", response.data);

      const newResult = {
        ...response.data,
        timestamp: new Date().toLocaleString(),
        formData: { ...formData },
        id: Date.now()
      };

      setResult(newResult);
      setPredictionHistory(prev => [newResult, ...prev.slice(0, 4)]);

    } catch (error) {
      console.error("❌ Error making prediction:", error);

      if (error.response) {
        setError(error.response.data?.detail || `Server error: ${error.response.status}`);
      } else if (error.request) {
        setError("Cannot connect to prediction service. Make sure the backend is running on port 8000.");
      } else {
        setError("Failed to make prediction request.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      age: '',
      sex: '',
      chest_pain_type: '1',
      bp: '',
      cholesterol: '',
      fbs_over_120: '0',
      ekg_results: '0',
      max_hr: '',
      exercise_angina: '0',
      st_depression: '',
      slope_st: '1',
      num_vessels_fluro: '0',
      thallium: '3',
    });
    setResult(null);
    setError(null);
  };

  // Load sample data
  const loadSampleData = (type) => {
    const samples = {
      lowRisk: {
        age: '35',
        sex: '0',
        chest_pain_type: '1',
        bp: '120',
        cholesterol: '180',
        fbs_over_120: '0',
        ekg_results: '0',
        max_hr: '160',
        exercise_angina: '0',
        st_depression: '0',
        slope_st: '1',
        num_vessels_fluro: '0',
        thallium: '3'
      },
      mediumRisk: {
        age: '54',
        sex: '1',
        chest_pain_type: '3',
        bp: '130',
        cholesterol: '240',
        fbs_over_120: '0',
        ekg_results: '0',
        max_hr: '140',
        exercise_angina: '0',
        st_depression: '2.5',
        slope_st: '2',
        num_vessels_fluro: '0',
        thallium: '3'
      },
      highRisk: {
        age: '65',
        sex: '1',
        chest_pain_type: '4',
        bp: '160',
        cholesterol: '300',
        fbs_over_120: '1',
        ekg_results: '2',
        max_hr: '120',
        exercise_angina: '1',
        st_depression: '4.0',
        slope_st: '3',
        num_vessels_fluro: '2',
        thallium: '7'
      }
    };

    setFormData(samples[type]);
    setResult(null);
    setError(null);
  };

  // Download results as PDF (simulated)
  const downloadResults = () => {
    if (!result) return;

    const element = document.createElement('a');
    const file = new Blob([`
Heart Disease Prediction Report
================================
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

PREDICTION RESULT
-----------------
Heart Disease: ${result.prediction}
Risk Level: ${result.risk_level}
Probability: ${result.probability.toFixed(4)}
Confidence: ${result.confidence}

PATIENT DATA
------------
Age: ${formData.age} years
Sex: ${formData.sex === '0' ? 'Female' : 'Male'}
Blood Pressure: ${formData.bp} mm Hg
Cholesterol: ${formData.cholesterol} mg/dl
Max Heart Rate: ${formData.max_hr} bpm

RECOMMENDATIONS
---------------
 ${result.prediction === 'Presence'
        ? '- Consult with a cardiologist immediately\n- Schedule further diagnostic tests\n- Monitor blood pressure regularly\n- Consider lifestyle modifications'
        : '- Maintain healthy lifestyle\n- Regular exercise recommended\n- Annual check-ups advised\n- Continue preventive measures'
      }

DISCLAIMER
----------
This prediction is based on machine learning algorithms and should not replace professional medical advice. Always consult with healthcare providers for accurate diagnosis.
    `], { type: 'text/plain' });

    element.href = URL.createObjectURL(file);
    element.download = `HeartGuard_Prediction_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Get risk color
  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'High': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // Get risk icon
  const getRiskIcon = (level) => {
    switch (level) {
      case 'Low': return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'Medium': return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'High': return <AlertCircle className="h-6 w-6 text-red-500" />;
      default: return <Info className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Heart className="relative h-8 w-8 text-red-500 transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <span className="font-bold text-2xl bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-pink-700 transition-all duration-300">HeartGuard</span>
                  <p className="text-xs text-gray-500 -mt-1">AI-Powered Heart Health</p>
                </div>
              </div>
              {/* <div className="hidden md:ml-10 md:flex md:space-x-1">
                {['Home', 'How It Works', 'Research', 'Team', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-700 hover:text-red-500 hover:bg-red-50 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg"
                  >
                    {item}
                  </a>
                ))}
              </div> */}
            </div>
            <div className="flex items-center space-x-4">
              <button className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
                <HelpCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Help</span>
              </button>
              <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-2xl animate-pulse"></div>
                <Heart className="relative h-24 w-24 text-white animate-pulse drop-shadow-2xl" />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight animate-fade-in-up">
              Heart Disease
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Prediction System</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-200">
              Leverage cutting-edge AI technology to assess your heart disease risk with unprecedented accuracy.
              Early detection saves lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <button
                onClick={() => document.getElementById('assessment-form').scrollIntoView({ behavior: 'smooth' })}
                className="group bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center space-x-3"
              >
                <span>Start Assessment</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl">
                Learn More
              </button>
            </div>
          </div>
        </div>
        
        {/* Wave Animation */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24 fill-current text-white transform translate-y-1" viewBox="0 0 1440 48" preserveAspectRatio="none">
            <path d="M0,22 C160,16 320,32 480,22 C640,12 800,24 960,22 C1120,20 1280,8 1440,22 L1440,48 L0,48 Z"></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      {/* <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <Activity className="h-8 w-8" />, label: 'Accuracy', value: '88.9%', color: 'from-blue-500 to-cyan-500' },
              { icon: <Users className="h-8 w-8" />, label: 'Patients Analyzed', value: '10,000+', color: 'from-green-500 to-emerald-500' },
              { icon: <Award className="h-8 w-8" />, label: 'Expert Verified', value: '100%', color: 'from-purple-500 to-pink-500' },
              { icon: <Shield className="h-8 w-8" />, label: 'Data Security', value: 'HIPAA', color: 'from-red-500 to-orange-500' },
            ].map((stat, index) => (
              <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <main id="assessment-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl mr-4 shadow-lg">
                    <Stethoscope className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Patient Assessment</h2>
                    <p className="text-gray-600">Enter clinical parameters for analysis</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Form Progress</span>
                  <span className="text-sm font-bold text-red-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Sample Data Buttons */}
              <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="flex items-center mb-4">
                  <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-semibold text-gray-700">Quick Start with Sample Data:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { type: 'lowRisk', label: 'Low Risk', color: 'green' },
                    { type: 'mediumRisk', label: 'Medium Risk', color: 'yellow' },
                    { type: 'highRisk', label: 'High Risk', color: 'red' },
                  ].map((sample) => (
                    <button
                      key={sample.type}
                      onClick={() => loadSampleData(sample.type)}
                      className={`group px-4 py-3 bg-${sample.color}-50 hover:bg-${sample.color}-100 text-${sample.color}-700 rounded-xl transition-all duration-300 text-sm font-semibold border border-${sample.color}-200 hover:shadow-md transform hover:scale-105`}
                    >
                      {sample.label} Profile
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200 flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      Personal Information
                    </h3>
                  </div>

                  <div className="group">
                    <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={(e) => {
                        handleChange(e);
                        setActiveField('age');
                      }}
                      onFocus={() => setActiveField('age')}
                      onBlur={() => setActiveField(null)}
                      required
                      min="20"
                      max="100"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${activeField === 'age' ? 'border-red-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
                      placeholder="Enter age"
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended range: 20-100 years</p>
                  </div>

                  <div className="group">
                    <label htmlFor="sex" className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      Sex *
                    </label>
                    <select
                      id="sex"
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      onFocus={() => setActiveField('sex')}
                      onBlur={() => setActiveField(null)}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${activeField === 'sex' ? 'border-red-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
                    >
                      <option value="">Select Gender</option>
                      <option value="0">Female</option>
                      <option value="1">Male</option>
                    </select>
                  </div>

                  {/* Clinical Measurements */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200 flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <Activity className="h-5 w-5 text-green-600" />
                      </div>
                      Clinical Measurements
                    </h3>
                  </div>

                  <div className="group">
                    <label htmlFor="bp" className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      Blood Pressure (mm Hg) *
                    </label>
                    <input
                      type="number"
                      id="bp"
                      name="bp"
                      value={formData.bp}
                      onChange={handleChange}
                      onFocus={() => setActiveField('bp')}
                      onBlur={() => setActiveField(null)}
                      required
                      min="50"
                      max="250"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${activeField === 'bp' ? 'border-red-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
                      placeholder="e.g., 120"
                    />
                    <p className="text-xs text-gray-500 mt-1">Systolic blood pressure</p>
                  </div>

                  <div className="group">
                    <label htmlFor="cholesterol" className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      Cholesterol (mg/dl) *
                    </label>
                    <input
                      type="number"
                      id="cholesterol"
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleChange}
                      onFocus={() => setActiveField('cholesterol')}
                      onBlur={() => setActiveField(null)}
                      required
                      min="100"
                      max="600"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${activeField === 'cholesterol' ? 'border-red-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
                      placeholder="e.g., 200"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="max_hr" className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      Max Heart Rate (bpm) *
                    </label>
                    <input
                      type="number"
                      id="max_hr"
                      name="max_hr"
                      value={formData.max_hr}
                      onChange={handleChange}
                      onFocus={() => setActiveField('max_hr')}
                      onBlur={() => setActiveField(null)}
                      required
                      min="60"
                      max="220"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${activeField === 'max_hr' ? 'border-red-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
                      placeholder="e.g., 150"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="st_depression" className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      ST Depression *
                    </label>
                    <input
                      type="number"
                      id="st_depression"
                      name="st_depression"
                      value={formData.st_depression}
                      onChange={handleChange}
                      onFocus={() => setActiveField('st_depression')}
                      onBlur={() => setActiveField(null)}
                      step="0.1"
                      required
                      min="0"
                      max="10"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${activeField === 'st_depression' ? 'border-red-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
                      placeholder="e.g., 1.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">Exercise induced ST depression</p>
                  </div>

                  {/* Medical History & Tests */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200 flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      Medical History & Test Results
                    </h3>
                  </div>

                  {[
                    { id: 'chest_pain_type', label: 'Chest Pain Type', options: [
                      { value: '1', label: 'Typical angina' },
                      { value: '2', label: 'Atypical angina' },
                      { value: '3', label: 'Non-anginal pain' },
                      { value: '4', label: 'Asymptomatic' },
                    ]},
                    { id: 'fbs_over_120', label: 'Fasting Blood Sugar > 120 mg/dl', options: [
                      { value: '0', label: 'No' },
                      { value: '1', label: 'Yes' },
                    ]},
                    { id: 'ekg_results', label: 'EKG Results', options: [
                      { value: '0', label: 'Normal' },
                      { value: '1', label: 'ST-T wave abnormality' },
                      { value: '2', label: 'Left ventricular hypertrophy' },
                    ]},
                    { id: 'exercise_angina', label: 'Exercise Angina', options: [
                      { value: '0', label: 'No' },
                      { value: '1', label: 'Yes' },
                    ]},
                    { id: 'slope_st', label: 'Slope of ST Segment', options: [
                      { value: '1', label: 'Upsloping' },
                      { value: '2', label: 'Flat' },
                      { value: '3', label: 'Downsloping' },
                    ]},
                    { id: 'num_vessels_fluro', label: 'Number of Vessels (Fluroscopy)', options: [
                      { value: '0', label: '0 vessels' },
                      { value: '1', label: '1 vessel' },
                      { value: '2', label: '2 vessels' },
                      { value: '3', label: '3 vessels' },
                    ]},
                    { id: 'thallium', label: 'Thallium Scan Result', options: [
                      { value: '3', label: 'Normal' },
                      { value: '6', label: 'Fixed defect' },
                      { value: '7', label: 'Reversible defect' },
                    ]},
                  ].map((field) => (
                    <div key={field.id} className="group">
                      <label htmlFor={field.id} className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {field.label}
                      </label>
                      <select
                        id={field.id}
                        name={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        onFocus={() => setActiveField(field.id)}
                        onBlur={() => setActiveField(null)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${activeField === field.id ? 'border-red-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
                      >
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Analyzing Data...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="mr-3 h-6 w-6" />
                        <span>Analyze Heart Disease Risk</span>
                        <ChevronRight className="ml-3 h-5 w-5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </div>

            {/* Model Information Section */}
            <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mr-4 shadow-lg">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">AI Model Performance</h2>
                    <p className="text-gray-600">Powered by machine learning algorithms</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: <BarChart3 className="h-12 w-12" />, label: 'Accuracy Rate', value: '88.9%', color: 'from-red-400 to-pink-400' },
                  { icon: <Target className="h-12 w-12" />, label: 'F1 Score', value: '0.84', color: 'from-yellow-400 to-orange-400' },
                  { icon: <Brain className="h-12 w-12" />, label: 'Algorithm', value: 'Logistic Regression', color: 'from-blue-400 to-cyan-400' },
                  { icon: <Users className="h-12 w-12" />, label: 'Training Cases', value: '303', color: 'from-green-400 to-emerald-400' },
                ].map((stat, index) => (
                  <div key={index} className="group text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Result Box */}
            {result && (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    {result.prediction === 'Absence' ? (
                      <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
                    )}
                    Prediction Result
                  </h3>
                </div>

                <div className={`p-6 rounded-2xl mb-6 ${result.prediction === 'Absence'
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                  : 'bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200'
                  }`}>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-xl mb-4">
                      {getRiskIcon(result.risk_level)}
                    </div>
                    <h4 className={`text-3xl font-bold mb-2 ${result.prediction === 'Absence' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {result.prediction}
                    </h4>
                    <p className="text-gray-600">Risk Level: <span className={`font-bold text-lg ${result.risk_level === 'Low' ? 'text-green-600' : result.risk_level === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>{result.risk_level}</span></p>
                  </div>

                  {/* Probability Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Risk Probability</span>
                      <span className="text-sm font-bold text-gray-800">{result.confidence}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${result.risk_level === 'Low' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                          result.risk_level === 'Medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                            'bg-gradient-to-r from-red-400 to-pink-400'
                          }`}
                        style={{ width: result.confidence }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">0%</span>
                      <span className="text-xs text-gray-500">100%</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Info className="h-6 w-6 text-blue-500 mr-2" />
                    Recommendations
                  </h4>
                  <div className="space-y-4">
                    {result.prediction === 'Presence' ? (
                      [
                        { icon: <AlertTriangle className="h-5 w-5" />, text: 'Consult with a cardiologist for comprehensive evaluation' },
                        { icon: <Activity className="h-5 w-5" />, text: 'Schedule follow-up diagnostic tests' },
                        { icon: <Activity className="h-5 w-5" />, text: 'Begin preventive lifestyle modifications' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-start text-sm group">
                          <div className="p-2 bg-red-100 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                            {React.cloneElement(item.icon, { className: 'h-5 w-5 text-red-500' })}
                          </div>
                          <span className="text-gray-700">{item.text}</span>
                        </div>
                      ))
                    ) : (
                      [
                        { icon: <CheckCircle className="h-5 w-5" />, text: 'Maintain current healthy lifestyle' },
                        { icon: <Activity className="h-5 w-5" />, text: 'Regular exercise recommended' },
                        { icon: <Calendar className="h-5 w-5" />, text: 'Annual heart health check-ups' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-start text-sm group">
                          <div className="p-2 bg-green-100 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                            {React.cloneElement(item.icon, { className: 'h-5 w-5 text-green-500' })}
                          </div>
                          <span className="text-gray-700">{item.text}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Download Button */}
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={downloadResults}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Box */}
            {error && (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-red-100 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
                    Error Notification
                  </h3>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Information Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl mr-3">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                About Heart Disease
              </h3>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Heart disease is the leading cause of death worldwide. Early detection and lifestyle changes can significantly reduce your risk.
                </p>
                <a href="#" className="inline-flex items-center text-blue-500 hover:text-blue-600 font-semibold group">
                  <span>Learn more</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mr-3">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                Heart Health Tips
              </h3>
              <div className="space-y-6">
                {[
                  { icon: <Activity className="h-6 w-6" />, title: 'Regular Exercise', desc: '30 minutes daily of moderate activity', color: 'green' },
                  { icon: <Activity className="h-6 w-6" />, title: 'Balanced Diet', desc: 'Low sodium, high fiber foods', color: 'blue' },
                  { icon: <Activity className="h-6 w-6" />, title: 'Stress Management', desc: 'Meditation and adequate sleep', color: 'purple' },
                ].map((tip, index) => (
                  <div key={index} className="flex items-start group">
                    <div className={`p-3 bg-${tip.color}-100 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      {React.cloneElement(tip.icon, { className: `h-6 w-6 text-${tip.color}-500` })}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">{tip.title}</h4>
                      <p className="text-gray-600 text-sm">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white mt-20">
        {/* Floating hearts background */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s'
              }}
            >
              <Heart className="h-4 w-4 text-red-500 opacity-20" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Logo and Brand */}
              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-lg opacity-75"></div>
                    <Heart className="relative h-12 w-12 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <span className="font-bold text-2xl bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">HeartGuard</span>
                    <p className="text-xs text-gray-400 -mt-1">AI-Powered Heart Health</p>
                  </div>
                </div>
                <p className="text-gray-400 text-center md:text-left">
                  Empowering healthcare professionals and patients with  AI technology for early heart disease detection.
                </p>
              </div>

              {/* Quick Links */}
              {/* <div className="flex flex-col items-center md:items-start">
                <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  {['Home', 'About', 'Services', 'Research', 'Contact'].map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-y-[-2px] inline-block"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div> */}

              {/* Social Links */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-lg font-semibold mb-6">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/batman-hassaan"
                    className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/hassaanshahid217"
                    className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 pt-8 border-t border-gray-800 text-center">
              <p className="text-gray-400 text-sm mb-4">
                &copy; {new Date().getFullYear()} HeartGuard AI. All rights reserved.
                <span className="ml-2 text-gray-500">For educational purposes only.</span>
              </p>
              <div className="flex justify-center items-center space-x-6">
                <p className="text-gray-400 text-sm">
                  Made with <span className="text-red-500 animate-pulse">❤️</span> by <span className="text-white font-medium">Hassan Shahid</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}

export default App;