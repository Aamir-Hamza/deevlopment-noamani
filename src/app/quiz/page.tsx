'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProductImage from '@/components/ui/ProductImage';
import { useCountry } from '@/hooks/useCountry';
import { getPrice } from '@/lib/priceUtils';

const questions = [
  {
    id: 1,
    questionKey: 'quiz.q1.question',
    options: [
      { key: 'floralSweet', tags: ['floral', 'rose', 'orchid', 'bloom', 'saffron'], image: 'https://images.pexels.com/photos/4110409/pexels-photo-4110409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { key: 'freshClean', tags: ['fresh', 'aquatic', 'ocean', 'citrus', 'breeze'], image: 'https://images.pexels.com/photos/4110408/pexels-photo-4110408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { key: 'warmSpicy', tags: ['spicy', 'warm', 'pimento', 'amber'], image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { key: 'woodyEarthy', tags: ['woody', 'oud', 'cedar', 'resin', 'sandalwood'], image: 'https://images.pexels.com/photos/4041393/pexels-photo-4041393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    ],
  },
  {
    id: 2,
    questionKey: 'quiz.q2.question',
    options: [
      { key: 'dailyWear', tags: ['fresh', 'light', 'citrus'], image: 'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { key: 'specialOccasions', tags: ['oud', 'amber', 'rich'], image: 'https://images.pexels.com/photos/5490779/pexels-photo-5490779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { key: 'eveningEvents', tags: ['musk', 'oud', 'intense'], image: 'https://images.pexels.com/photos/6621441/pexels-photo-6621441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { key: 'seasonalUse', tags: ['fresh', 'aquatic'], image: 'https://images.pexels.com/photos/6621442/pexels-photo-6621442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    ],
  },
  {
    id: 3,
    questionKey: 'quiz.q3.question',
    options: [
      { key: 'lightSubtle', tags: ['fresh', 'citrus', 'light'], image: 'https://images.pexels.com/photos/6621263/pexels-photo-6621263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { key: 'moderate', tags: ['floral', 'amber'], image: 'https://images.pexels.com/photos/6621266/pexels-photo-6621266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { key: 'strongBold', tags: ['oud', 'spicy', 'intense'], image: 'https://images.pexels.com/photos/6621472/pexels-photo-6621472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { key: 'veryIntense', tags: ['oud', 'musk', 'resin'], image: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    ],
  },
];

const questionNsMap = ['q1', 'q2', 'q3'] as const;

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  reviews?: number;
};

export default function QuizPage() {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[][]>([]);
  const [showResults, setShowResults] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const router = useRouter();
  const { countryData } = useCountry();

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleAnswer = (tags: string[]) => {
    const updated = [...selectedTags.slice(0, currentQuestion), tags];
    setSelectedTags(updated);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const goBack = () => {
    if (currentQuestion === 0) return;
    setCurrentQuestion((q) => q - 1);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedTags([]);
    setShowResults(false);
  };

  const allTags = selectedTags.flat();

  const recommendations = products
    .map((p) => {
      const haystack = `${p.name} ${p.description} ${p.category}`.toLowerCase();
      const score = allTags.reduce((sum, tag) => sum + (haystack.includes(tag) ? 1 : 0), 0);
      return { product: p, score };
    })
    .filter((r) => r.product.stock > 0)
    .sort((a, b) => b.score - a.score || (b.product.reviews ?? 0) - (a.product.reviews ?? 0))
    .slice(0, 3)
    .map((r) => r.product);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[45vh] bg-black text-white flex items-center justify-center">
        <img
          src="https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Find Your Perfect Scent"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center max-w-2xl px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl font-light mb-4"
            style={{ fontFamily: 'Didot, serif' }}
          >
            {t('quiz.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg font-light"
          >
            {t('quiz.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {/* Progress */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  {currentQuestion > 0 ? (
                    <button
                      onClick={goBack}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {t('quiz.back')}
                    </button>
                  ) : (
                    <span />
                  )}
                  <p className="text-sm text-gray-500">
                    {t('quiz.questionOf', { current: currentQuestion + 1, total: questions.length })}
                  </p>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#bfa14a] rounded-full"
                    initial={false}
                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question */}
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <h2 className="text-2xl sm:text-3xl font-light mb-10" style={{ fontFamily: 'Didot, serif' }}>
                  {t(questions[currentQuestion].questionKey)}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={option.key}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() => handleAnswer(option.tags)}
                      className="relative aspect-[4/3] overflow-hidden group rounded-xl"
                    >
                      {failedImages.has(option.image) ? (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1916] to-[#3a342c]" />
                      ) : (
                        <img
                          src={option.image}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={() => setFailedImages((prev) => new Set(prev).add(option.image))}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <h3 className="text-xl sm:text-2xl font-light">
                          {t(`quiz.${questionNsMap[currentQuestion]}.${option.key}`)}
                        </h3>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="text-center mb-12">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bfa14a] mb-3">{t('quiz.yourMatch')}</p>
                <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: 'Didot, serif' }}>
                  {t('quiz.recommendedForYou')}
                </h2>
              </div>

              {loadingProducts ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-8">
                    {t('quiz.noMatch')}
                  </p>
                  <Link
                    href="/shop/all"
                    className="inline-block bg-black text-white px-8 py-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors rounded-full"
                  >
                    {t('quiz.browseAll')}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                  {recommendations.map((product, idx) => {
                    const { symbol, value } = getPrice(product.price, countryData?.currency);
                    return (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Link href={`/product/${product._id}`} className="group block">
                          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3">
                            <ProductImage
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                            />
                            {idx === 0 && (
                              <span className="absolute top-3 left-3 bg-[#bfa14a] text-black px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full">
                                {t('quiz.bestMatch')}
                              </span>
                            )}
                          </div>
                          <h3 className="text-center text-sm font-medium text-gray-900 group-hover:text-[#bfa14a] transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-center text-sm text-gray-500">
                            {symbol}{value}
                          </p>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/shop/all"
                  className="bg-black text-white px-8 py-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors rounded-full"
                >
                  {t('quiz.shopAllFragrances')}
                </Link>
                <button
                  onClick={restartQuiz}
                  className="bg-white text-black px-8 py-3 text-sm font-medium uppercase tracking-wide border border-gray-300 hover:border-gray-900 transition-colors rounded-full"
                >
                  {t('quiz.retakeQuiz')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
