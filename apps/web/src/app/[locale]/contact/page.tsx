import { Container } from '@studentdeals/ui';
import { generateSEOMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  return generateSEOMetadata({
    title: locale === 'ru' ? 'Контакты - StudentDeals.uz' : 'Aloqa - StudentDeals.uz',
    description: locale === 'ru' 
      ? 'Свяжитесь с нами для получения поддержки или предложения сотрудничества'
      : 'Qo\'llab-quvvatlash yoki hamkorlik taklifi uchun biz bilan bog\'laning',
    locale,
    path: '/contact',
    keywords: locale === 'ru' 
      ? ['контакты', 'поддержка', 'связь', 'помощь']
      : ['aloqa', 'qo\'llab-quvvatlash', 'bog\'lanish', 'yordam']
  });
}

export default function ContactPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            {locale === 'ru' ? 'Контакты' : 'Aloqa'}
          </h1>
          <p className="text-xl text-gray-600">
            {locale === 'ru' 
              ? 'Свяжитесь с нами любым удобным способом'
              : 'Biz bilan qulay usulda bog\'laning'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {locale === 'ru' ? 'Свяжитесь с нами' : 'Biz bilan bog\'laning'}
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                  <span className="text-brand-600 text-xl">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {locale === 'ru' ? 'Email' : 'Email'}
                  </h3>
                  <p className="text-gray-600">support@studentdeals.uz</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                  <span className="text-brand-600 text-xl">📱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {locale === 'ru' ? 'Telegram' : 'Telegram'}
                  </h3>
                  <p className="text-gray-600">@studentdealsuz</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                  <span className="text-brand-600 text-xl">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {locale === 'ru' ? 'Адрес' : 'Manzil'}
                  </h3>
                  <p className="text-gray-600">
                    {locale === 'ru' 
                      ? 'Ташкент, Узбекистан'
                      : 'Toshkent, O\'zbekiston'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {locale === 'ru' ? 'Напишите нам' : 'Bizga yozing'}
            </h2>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'ru' ? 'Имя' : 'Ism'}
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder={locale === 'ru' ? 'Ваше имя' : 'Sizning ismingiz'}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'ru' ? 'Email' : 'Email'}
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'ru' ? 'Сообщение' : 'Xabar'}
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder={locale === 'ru' ? 'Ваше сообщение...' : 'Sizning xabaringiz...'}
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-colors"
              >
                {locale === 'ru' ? 'Отправить' : 'Yuborish'}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-gradient-to-r from-brand-50 to-brand-100 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
            {locale === 'ru' ? 'Часто задаваемые вопросы' : 'Tez-tez so\'raladigan savollar'}
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {locale === 'ru' ? 'Как получить скидку?' : 'Chegirma qanday olinadi?'}
              </h3>
              <p className="text-gray-600 text-sm">
                {locale === 'ru' 
                  ? 'Зарегистрируйтесь, подтвердите статус студента и используйте промокоды'
                  : 'Ro\'yxatdan o\'ting, talaba maqomini tasdiqlang va promokodlardan foydalaning'
                }
              </p>
            </div>

            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {locale === 'ru' ? 'Как подтвердить статус студента?' : 'Talaba maqomini qanday tasdiqlash mumkin?'}
              </h3>
              <p className="text-gray-600 text-sm">
                {locale === 'ru' 
                  ? 'Загрузите фото студенческого билета в личном кабинете'
                  : 'Shaxsiy kabinetingizda talaba biletining fotosini yuklang'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
