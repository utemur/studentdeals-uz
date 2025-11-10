import { Container } from '@studentdeals/ui';
import { generateSEOMetadata } from '@/lib/seo';

const TELEGRAM_BOT_URL = 'https://t.me/studentdeals_uz_bot';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  return generateSEOMetadata({
    title: locale === 'ru' ? 'О нас - StudentDeals.uz' : 'Biz haqimizda - StudentDeals.uz',
    description: locale === 'ru' 
      ? 'Узнайте больше о StudentDeals.uz - платформе для студентов Узбекистана'
      : 'StudentDeals.uz haqida ko\'proq ma\'lumot oling - O\'zbekiston talabalari uchun platforma',
    locale,
    path: '/about',
    keywords: locale === 'ru' 
      ? ['о нас', 'компания', 'миссия', 'студенты', 'скидки']
      : ['biz haqimizda', 'kompaniya', 'missiya', 'talabalar', 'chegirmalar']
  });
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            {locale === 'ru' ? 'О нас' : 'Biz haqimizda'}
          </h1>
          <p className="text-xl text-gray-600">
            {locale === 'ru' 
              ? 'Мы помогаем студентам Узбекистана экономить на покупках'
              : 'Biz O\'zbekiston talabalariga xarid qilishda tejashga yordam beramiz'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {locale === 'ru' ? 'Наша миссия' : 'Bizning missiyamiz'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {locale === 'ru' 
                ? 'Мы стремимся сделать образование более доступным для студентов, предоставляя эксклюзивные скидки и предложения от лучших брендов.'
                : 'Biz talabalar uchun ta\'limni yanada qulay qilishga intilamiz, eng yaxshi brendlardan eksklyuziv chegirmalar va takliflar taqdim etamiz.'
              }
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {locale === 'ru' ? 'Наше видение' : 'Bizning ko\'rinishimiz'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {locale === 'ru' 
                ? 'Создать крупнейшую платформу для студентов в Центральной Азии, где каждый студент может найти выгодные предложения.'
                : 'Markaziy Osiyoda talabalar uchun eng katta platformani yaratish, bu yerda har bir talaba foydali takliflarni topishi mumkin.'
              }
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-brand-50 to-brand-100 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            {locale === 'ru' ? 'Почему выбирают нас?' : 'Nima uchun bizni tanlashadi?'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {locale === 'ru' ? 'Только для студентов' : 'Faqat talabalar uchun'}
              </h3>
              <p className="text-sm text-gray-600">
                {locale === 'ru' 
                  ? 'Эксклюзивные предложения только для студентов'
                  : 'Faqat talabalar uchun eksklyuziv takliflar'
                }
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {locale === 'ru' ? 'Большие скидки' : 'Katta chegirmalar'}
              </h3>
              <p className="text-sm text-gray-600">
                {locale === 'ru' 
                  ? 'Скидки до 70% от лучших брендов'
                  : 'Eng yaxshi brendlardan 70% gacha chegirmalar'
                }
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {locale === 'ru' ? 'Быстро и удобно' : 'Tez va qulay'}
              </h3>
              <p className="text-sm text-gray-600">
                {locale === 'ru' 
                  ? 'Простой интерфейс и быстрый поиск'
                  : 'Oddiy interfeys va tez qidiruv'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {locale === 'ru' ? 'Присоединяйтесь к нам!' : 'Bizga qo\'shiling!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {locale === 'ru' 
              ? 'Станьте частью сообщества студентов, которые экономят на покупках'
              : 'Xarid qilishda tejaydigan talabalar jamoasining bir qismi bo\'ling'
            }
          </p>
          <a 
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl font-medium transition-colors bg-brand-500 text-white hover:bg-brand-600 h-12 px-6"
          >
            {locale === 'ru' ? 'Зарегистрироваться через Telegram' : 'Telegram orqali ro\'yxatdan o\'tish'}
          </a>
        </div>
      </div>
    </Container>
  );
}