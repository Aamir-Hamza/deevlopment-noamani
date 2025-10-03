'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    id: 1,
    question: 'What type of fragrance do you typically prefer?',
    options: [
      { text: 'Floral & Sweet', image: 'https://images.pexels.com/photos/4110409/pexels-photo-4110409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { text: 'Fresh & Clean', image: 'https://images.pexels.com/photos/4110410/pexels-photo-4110410.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { text: 'Warm & Spicy', image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { text: 'Woody & Earthy', image: 'https://images.pexels.com/photos/4041393/pexels-photo-4041393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }
    ]
  },
  {
    id: 2,
    question: 'When do you typically wear fragrance?',
    options: [
      { text: 'Daily Wear', image: 'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { text: 'Special Occasions', image: 'https://images.pexels.com/photos/5490779/pexels-photo-5490779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { text: 'Evening Events', image: 'https://images.pexels.com/photos/6621441/pexels-photo-6621441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { text: 'Seasonal Use', image: 'https://images.pexels.com/photos/6621442/pexels-photo-6621442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }
    ]
  },
  {
    id: 3,
    question: 'What\'s your preferred fragrance intensity?',
    options: [
      { text: 'Light & Subtle', image: 'https://images.pexels.com/photos/6621264/pexels-photo-6621264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { text: 'Moderate', image: 'https://images.pexels.com/photos/6621266/pexels-photo-6621266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { text: 'Strong & Bold', image: 'https://images.pexels.com/photos/6621472/pexels-photo-6621472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { text: 'Very Intense', image: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }
    ]
  }
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[60vh] bg-black text-white flex items-center justify-center"
      >
        <Image
          src="https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Quiz Hero"
          fill
          className="object-cover opacity-30"
        />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl font-light mb-6"
          >
            FIND YOUR PERFECT SCENT
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Take our quiz to discover your signature fragrance
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-black rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <p className="text-center mt-4 text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>

            {/* Question */}
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-light mb-8">{questions[currentQuestion].question}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-[4/3] overflow-hidden group cursor-pointer"
                    onClick={() => handleAnswer(option.text)}
                  >
                    <Image
                      src={option.image}
                      alt={option.text}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <h3 className="text-2xl font-light">{option.text}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-light mb-8">YOUR PERFECT MATCH</h2>
            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <p className="text-xl mb-6">Based on your preferences, we recommend:</p>
              <div className="space-y-4 mb-8">
                {answers.map((answer, index) => (
                  <p key={index} className="text-gray-600">{answer}</p>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/shop')}
                  className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  SHOP RECOMMENDATIONS
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restartQuiz}
                  className="bg-white text-black px-8 py-3 text-sm font-medium border border-black hover:bg-gray-100 transition-colors"
                >
                  RETAKE QUIZ
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 