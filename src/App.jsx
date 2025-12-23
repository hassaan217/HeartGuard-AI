// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import {
  Heart, Activity, Users, Phone, Mail, MapPin,
  Facebook, Twitter, Linkedin, Instagram, ChevronRight,
  CheckCircle, AlertCircle, BarChart3, Brain, Download,
  AlertTriangle, Shield, Zap, Star, Calendar, Clock,
  TrendingUp, User, Activity as ActivityIcon, Info,
  Github
} from 'lucide-react';

function App() {
  // State for the form
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

  // State for the result and loading status
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [showTips, setShowTips] = useState(true);

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
        setError("Cannot connect to the prediction service. Make sure the backend is running on port 8000.");
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
        st_depression: '0.0',
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
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get risk icon
  const getRiskIcon = (level) => {
    switch (level) {
      case 'Low': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Medium': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'High': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <div className="relative">
                  <Heart className="h-10 w-10 text-red-500 animate-pulse" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full"></div>
                </div>
                <div>
                  <span className="font-bold text-2xl text-gray-800 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">HeartGuard</span>
                  <p className="text-xs text-gray-500 -mt-1">AI-Powered Heart Health</p>
                </div>
              </div>
              {/* <div className="hidden md:ml-12 md:flex md:space-x-8">
                <a href="#" className="text-gray-700 hover:text-red-500 px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent hover:border-red-500">Home</a>
                <a href="#" className="text-gray-700 hover:text-red-500 px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent hover:border-red-500">How It Works</a>
                <a href="#" className="text-gray-700 hover:text-red-500 px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent hover:border-red-500">Research</a>
                <a href="#" className="text-gray-700 hover:text-red-500 px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent hover:border-red-500">Team</a>
                <a href="#" className="text-gray-700 hover:text-red-500 px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 border-transparent hover:border-red-500">Contact</a>
              </div>*/}
            </div>
            <div className="flex items-center space-x-4">
              <button className="hidden md:block text-gray-600 hover:text-red-500 px-4 py-2 text-sm font-medium transition-colors duration-200">
                <User className="h-5 w-5 inline mr-1" />
                Sign In
              </button>
              <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                <ActivityIcon className="h-4 w-4 inline mr-2" />
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Heart className="h-20 w-20 animate-bounce" />
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-20 rounded-full animate-ping"></div>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 tracking-tight">
              Advanced Heart Disease Prediction
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
              Leverage cutting-edge AI technology to assess your heart disease risk based on clinical parameters.
              Early detection and prevention can save lives.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center">
                <Zap className="h-4 w-4 mr-2" /> 88.9% Prediction Accuracy
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center">
                <Shield className="h-4 w-4 mr-2" /> Medical Grade Algorithm
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center">
                <Clock className="h-4 w-4 mr-2" /> Instant Results
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-3 bg-red-50 rounded-xl mr-4">
                    <Activity className="h-8 w-8 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Patient Assessment Form</h2>
                    <p className="text-gray-600">Enter clinical parameters for heart disease risk prediction</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Fields marked with * are required</div>
                  </div>
                </div>
              </div>

              {/* Sample Data Buttons */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Try Sample Data:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => loadSampleData('lowRisk')}
                    className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm font-medium"
                  >
                    Low Risk Profile
                  </button>
                  <button
                    onClick={() => loadSampleData('mediumRisk')}
                    className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors duration-200 text-sm font-medium"
                  >
                    Medium Risk Profile
                  </button>
                  <button
                    onClick={() => loadSampleData('highRisk')}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                  >
                    High Risk Profile
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      <User className="h-5 w-5 inline mr-2 text-red-500" />
                      Personal Information
                    </h3>
                  </div>

                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      min="20"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter age"
                    />
                  </div>

                  <div>
                    <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
                      Sex *
                    </label>
                    <select
                      id="sex"
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Gender</option>
                      <option value="0">Female</option>
                      <option value="1">Male</option>
                    </select>
                  </div>

                  {/* Clinical Measurements */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      <ActivityIcon className="h-5 w-5 inline mr-2 text-red-500" />
                      Clinical Measurements
                    </h3>
                  </div>

                  <div>
                    <label htmlFor="bp" className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Pressure (mm Hg) *
                    </label>
                    <input
                      type="number"
                      id="bp"
                      name="bp"
                      value={formData.bp}
                      onChange={handleChange}
                      required
                      min="50"
                      max="250"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 120"
                    />
                    <p className="text-xs text-gray-500 mt-1">Systolic blood pressure</p>
                  </div>

                  <div>
                    <label htmlFor="cholesterol" className="block text-sm font-medium text-gray-700 mb-2">
                      Cholesterol (mg/dl) *
                    </label>
                    <input
                      type="number"
                      id="cholesterol"
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleChange}
                      required
                      min="100"
                      max="600"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 200"
                    />
                  </div>

                  <div>
                    <label htmlFor="max_hr" className="block text-sm font-medium text-gray-700 mb-2">
                      Max Heart Rate (bpm) *
                    </label>
                    <input
                      type="number"
                      id="max_hr"
                      name="max_hr"
                      value={formData.max_hr}
                      onChange={handleChange}
                      required
                      min="60"
                      max="220"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 150"
                    />
                  </div>

                  <div>
                    <label htmlFor="st_depression" className="block text-sm font-medium text-gray-700 mb-2">
                      ST Depression *
                    </label>
                    <input
                      type="number"
                      id="st_depression"
                      name="st_depression"
                      value={formData.st_depression}
                      onChange={handleChange}
                      step="0.1"
                      required
                      min="0"
                      max="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 1.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">Exercise induced ST depression</p>
                  </div>

                  {/* Medical History & Tests */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      <Activity className="h-5 w-5 inline mr-2 text-red-500" />
                      Medical History & Test Results
                    </h3>
                  </div>

                  <div>
                    <label htmlFor="chest_pain_type" className="block text-sm font-medium text-gray-700 mb-2">
                      Chest Pain Type
                    </label>
                    <select
                      id="chest_pain_type"
                      name="chest_pain_type"
                      value={formData.chest_pain_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="1">Typical angina</option>
                      <option value="2">Atypical angina</option>
                      <option value="3">Non-anginal pain</option>
                      <option value="4">Asymptomatic</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="fbs_over_120" className="block text-sm font-medium text-gray-700 mb-2">
                      Fasting Blood Sugar &gt; 120 mg/dl
                    </label>
                    <select
                      id="fbs_over_120"
                      name="fbs_over_120"
                      value={formData.fbs_over_120}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ekg_results" className="block text-sm font-medium text-gray-700 mb-2">
                      EKG Results
                    </label>
                    <select
                      id="ekg_results"
                      name="ekg_results"
                      value={formData.ekg_results}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="0">Normal</option>
                      <option value="1">ST-T wave abnormality</option>
                      <option value="2">Left ventricular hypertrophy</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="exercise_angina" className="block text-sm font-medium text-gray-700 mb-2">
                      Exercise Angina
                    </label>
                    <select
                      id="exercise_angina"
                      name="exercise_angina"
                      value={formData.exercise_angina}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="slope_st" className="block text-sm font-medium text-gray-700 mb-2">
                      Slope of ST Segment
                    </label>
                    <select
                      id="slope_st"
                      name="slope_st"
                      value={formData.slope_st}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="1">Upsloping</option>
                      <option value="2">Flat</option>
                      <option value="3">Downsloping</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="num_vessels_fluro" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Vessels (Fluroscopy)
                    </label>
                    <select
                      id="num_vessels_fluro"
                      name="num_vessels_fluro"
                      value={formData.num_vessels_fluro}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="0">0 vessels</option>
                      <option value="1">1 vessel</option>
                      <option value="2">2 vessels</option>
                      <option value="3">3 vessels</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="thallium" className="block text-sm font-medium text-gray-700 mb-2">
                      Thallium Scan Result
                    </label>
                    <select
                      id="thallium"
                      name="thallium"
                      value={formData.thallium}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="3">Normal</option>
                      <option value="6">Fixed defect</option>
                      <option value="7">Reversible defect</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Stress thallium test result</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Data...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-3 h-6 w-6" />
                        Analyze Heart Disease Risk
                        <ChevronRight className="ml-3 h-5 w-5" />
                      </>
                    )}
                  </button>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-4 rounded-xl transition-colors duration-200"
                    >
                      Clear Form
                    </button>

                    {result && (
                      <button
                        type="button"
                        onClick={downloadResults}
                        className="px-6 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-4 rounded-xl transition-colors duration-200 flex items-center"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Export
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Model Information Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl mr-4">
                  <Brain className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">AI Model Performance</h2>
                  <p className="text-gray-600">Powered by advanced machine learning algorithms</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
                  <BarChart3 className="h-10 w-10 text-red-500 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-red-600 mb-2">88.9%</p>
                  <p className="text-sm font-medium text-gray-700">Accuracy Rate</p>
                  <p className="text-xs text-gray-500 mt-1">Based on 303 samples</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                  <TrendingUp className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-yellow-600 mb-2">0.84</p>
                  <p className="text-sm font-medium text-gray-700">F1 Score</p>
                  <p className="text-xs text-gray-500 mt-1">Balanced precision & recall</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <Brain className="h-10 w-10 text-blue-500 mx-auto mb-4" />
                  <p className="text-lg font-bold text-blue-600 mb-2">Logistic Regression</p>
                  <p className="text-sm font-medium text-gray-700">Algorithm</p>
                  <p className="text-xs text-gray-500 mt-1">Medical-grade prediction</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <Users className="h-10 w-10 text-green-500 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-green-600 mb-2">303</p>
                  <p className="text-sm font-medium text-gray-700">Training Cases</p>
                  <p className="text-xs text-gray-500 mt-1">Clinical dataset</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Model Features</h3>
                    <p className="text-gray-600">Trained on 19 clinical parameters</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Updated: Today
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {['Age', 'Blood Pressure', 'Cholesterol', 'Heart Rate', 'ST Depression', 'EKG Results',
                    'Chest Pain Type', 'Exercise Angina', 'Thallium Scan'].map((feature, idx) => (
                      <div key={idx} className="px-3 py-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Result Box */}
            {result && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    {result.prediction === 'Absence' ? (
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                    )}
                    Prediction Result
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(result.risk_level)}`}>
                    {result.risk_level} Risk
                  </span>
                </div>

                <div className={`p-6 rounded-xl mb-6 ${result.prediction === 'Absence'
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'
                  : 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-200'
                  }`}>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-md mb-4">
                      {getRiskIcon(result.risk_level)}
                    </div>
                    <h4 className={`text-2xl font-bold mb-2 ${result.prediction === 'Absence' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {result.prediction}
                    </h4>
                    <p className="text-gray-600">Heart Disease Prediction</p>
                  </div>

                  {/* Probability Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Risk Probability</span>
                      <span className="text-sm font-bold text-gray-800">{result.confidence}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${result.risk_level === 'Low' ? 'bg-green-500' :
                          result.risk_level === 'Medium' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                        style={{ width: result.confidence }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">0%</span>
                      <span className="text-xs text-gray-500">50%</span>
                      <span className="text-xs text-gray-500">100%</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Probability</p>
                      <p className="text-xl font-bold text-gray-800">
                        {result.probability.toFixed(4)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Confidence</p>
                      <p className="text-xl font-bold text-blue-600">{result.confidence}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Info className="h-5 w-5 text-blue-500 mr-2" />
                    Recommendations
                  </h4>
                  {result.prediction === 'Presence' ? (
                    <ul className="space-y-2">
                      <li className="flex items-start text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Consult with a cardiologist for comprehensive evaluation</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Activity className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Schedule follow-up diagnostic tests</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Heart className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Begin preventive lifestyle modifications</span>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-2">
                      <li className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Maintain current healthy lifestyle habits</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Calendar className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Schedule annual heart health check-ups</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Shield className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Continue preventive healthcare measures</span>
                      </li>
                    </ul>
                  )}
                </div>

                {/* Disclaimer */}
                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Disclaimer:</strong> This AI prediction is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment.
                  </p>
                </div>
              </div>
            )}

            {/* Prediction History */}
            {predictionHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Clock className="h-6 w-6 text-gray-500 mr-3" />
                  Recent Predictions
                </h3>
                <div className="space-y-4">
                  {predictionHistory.map((history, idx) => (
                    <div key={history.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${history.risk_level === 'Low' ? 'bg-green-100 text-green-800' :
                          history.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {history.risk_level}
                        </span>
                        <span className="text-xs text-gray-500">{history.timestamp}</span>
                      </div>
                      <p className="font-medium text-gray-800 mb-1">
                        {history.prediction} ({history.confidence})
                      </p>
                      <p className="text-xs text-gray-600">
                        Age: {history.formData.age}, BP: {history.formData.bp}, Cholesterol: {history.formData.cholesterol}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Box */}
            {error && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                  Error Notification
                </h3>
                <div className="p-4 bg-red-50 rounded-xl">
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Health Tips Card */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-xl p-6 border border-red-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Heart className="h-6 w-6 text-red-500 mr-3" />
                Heart Health Tips
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/80 rounded-xl">
                  <div className="flex items-start">
                    <div className="p-2 bg-red-100 rounded-lg mr-3">
                      <Activity className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Regular Exercise</h4>
                      <p className="text-sm text-gray-600">30 minutes daily of moderate activity</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/80 rounded-xl">
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Activity className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Balanced Diet</h4>
                      <p className="text-sm text-gray-600">Low sodium, high fiber foods</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/80 rounded-xl">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Activity className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Stress Management</h4>
                      <p className="text-sm text-gray-600">Meditation and adequate sleep</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/80 rounded-xl">
                  <div className="flex items-start">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <Activity className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Regular Check-ups</h4>
                      <p className="text-sm text-gray-600">Annual cardiovascular screening</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Heart Disease Facts</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <span className="text-gray-700">Leading cause of death</span>
                  <span className="font-bold text-red-600">#1</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <span className="text-gray-700">Affects 1 in 4 adults</span>
                  <span className="font-bold text-red-600">25%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <span className="text-gray-700">Preventable cases</span>
                  <span className="font-bold text-green-600">80%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <span className="text-gray-700">Early detection impact</span>
                  <span className="font-bold text-blue-600">+90%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
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
        <div className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Logo and Brand */}
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-6">
                  <Heart className="h-16 w-16 text-red-400 mr-4" />
                  <div>
                    <span className="font-bold text-3xl bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">HeartGuard</span>
                    <p className="text-gray-400 text-sm mt-2">Powered by Zenehrix AI</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed text-center max-w-md">
                  Empowering individuals with AI-driven heart disease risk assessment for early detection and prevention.
                </p>
              </div>

              {/* Copyright */}
              <div className="md:col-span-2 mt-12 text-center">
                <p className="text-gray-400 text-sm mb-4 md:mb-0">
                  &copy; {new Date().getFullYear()} HeartGuard AI. All rights reserved.
                  <span className="ml-2 text-gray-500">For educational purposes only.</span>
                </p>
                <div className="flex justify-center items-center space-x-6 mt-4">
                  <p className="text-gray-400 text-sm">
                    Made with <span className="text-red-500">❤️</span> by <span className="text-white font-medium">Hassan Shahid</span>
                  </p>
                  <div className="flex space-x-4">
                    <a href="https://github.com/batman-hassaan" className="text-gray-400 hover:text-white transition-colors duration-200">
                      <Github className="h-5 w-5" />
                    </a>
                    <a href="https://www.linkedin.com/in/hassaanshahid217" className="text-gray-400 hover:text-white transition-colors duration-200">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;