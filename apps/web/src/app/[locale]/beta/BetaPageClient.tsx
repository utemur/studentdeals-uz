'use client';

import { useState } from 'react';
import { Container, Button, Input } from '@studentdeals/ui';

interface BetaPageClientProps {
  params: {
    locale: string;
  };
}

export default function BetaPageClient({ params }: BetaPageClientProps) {
  const locale = params.locale;
  
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    rating: 0,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email || undefined,
          message: formData.message,
          rating: formData.rating || undefined,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ email: '', message: '', rating: 0 });
        
        // Send GA event if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'feedback_submitted', {
            event_category: 'engagement',
            event_label: 'beta_feedback',
            value: formData.rating,
          });
        }
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6">
              <span className="text-3xl">🚧</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {locale === 'ru' ? 'Бета-версия' : 'Beta versiya'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {locale === 'ru' 
                ? 'StudentDeals.uz находится в закрытой бета-версии. Мы активно работаем над улучшением платформы и ценим ваши отзывы!'
                : 'StudentDeals.uz yopiq beta versiyada. Biz platformani yaxshilash ustida faol ishlayapmiz va sizning fikr-mulohazalaringizni qadrlaymiz!'
              }
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === 'ru' ? 'Закрытая бета' : 'Yopiq beta'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ru' 
                  ? 'Доступ только для избранных пользователей'
                  : 'Faqat tanlangan foydalanuvchilar uchun kirish'
                }
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === 'ru' ? 'Быстрые обновления' : 'Tez yangilanishlar'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ru' 
                  ? 'Новые функции появляются каждую неделю'
                  : 'Yangi funksiyalar har hafta paydo bo\'ladi'
                }
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === 'ru' ? 'Прямая связь' : 'To\'g\'ridan-to\'g\'ri aloqa'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ru' 
                  ? 'Ваши отзывы напрямую влияют на развитие'
                  : 'Sizning fikr-mulohazalaringiz rivojlanishga to\'g\'ridan-to\'g\'ri ta\'sir qiladi'
                }
              </p>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {locale === 'ru' ? 'Оставьте отзыв' : 'Fikr-mulohaza qoldiring'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'ru' ? 'Email (необязательно)' : 'Email (ixtiyoriy)'}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={locale === 'ru' ? 'your@email.com' : 'sizning@email.com'}
                  className="w-full"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'ru' ? 'Оценка (необязательно)' : 'Baholash (ixtiyoriy)'}
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className={`text-3xl transition-colors ${
                        star <= formData.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'ru' ? 'Сообщение *' : 'Xabar *'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  minLength={5}
                  maxLength={2000}
                  rows={6}
                  placeholder={locale === 'ru' 
                    ? 'Расскажите о вашем опыте использования платформы...'
                    : 'Platformadan foydalanish tajribangiz haqida gapiring...'
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.message.length}/2000
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !formData.message.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                {isSubmitting 
                  ? (locale === 'ru' ? 'Отправка...' : 'Yuborilmoqda...')
                  : (locale === 'ru' ? 'Отправить отзыв' : 'Fikr-mulohaza yuborish')
                }
              </Button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-medium">
                    {locale === 'ru' 
                      ? '✅ Спасибо за ваш отзыв!' 
                      : '✅ Fikr-mulohazangiz uchun rahmat!'
                    }
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-800 font-medium">
                    {locale === 'ru' 
                      ? '❌ Ошибка при отправке. Попробуйте еще раз.' 
                      : '❌ Yuborishda xatolik. Qayta urinib ko\'ring.'
                    }
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {locale === 'ru' ? 'Свяжитесь с нами' : 'Biz bilan bog\'laning'}
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/studentdealsuz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                📱 Telegram
              </a>
              <a
                href="mailto:noreply@studentdeals.uz"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                📧 Email
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
