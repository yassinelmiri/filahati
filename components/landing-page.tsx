'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Language } from '@/lib/translations';
import { 
  Calculator, 
  BarChart3, 
  Database, 
  Users, 
  Check, 
  Star, 
  MessageCircle,
  Sun,
  Moon,
  Globe,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Leaf
} from 'lucide-react';

interface LandingPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onLogin: () => void;
}

const content = {
  fr: {
    nav: {
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      testimonials: 'Témoignages',
      contact: 'Contact',
      login: 'Connexion'
    },
    hero: {
      badge: 'Nouveau: Système FILAHATI',
      title: 'Optimisez la nutrition de votre troupeau',
      subtitle: 'RationPro est la solution professionnelle de rationnement alimentaire pour vaches laitières, basée sur le système FILAHATI. Calculez, analysez et optimisez vos rations en quelques clics.',
      cta: 'Commencer maintenant',
      secondary: 'Voir les tarifs'
    },
    trusted: 'Plus de 500 exploitations agricoles nous font confiance au Maroc',
    features: {
      title: 'Fonctionnalités puissantes',
      subtitle: 'Tout ce dont vous avez besoin pour optimiser la nutrition de votre troupeau',
      items: [
        {
          icon: 'Calculator',
          title: 'Calcul FILAHATI',
          description: 'Algorithmes précis basés sur les normes INRA pour des rations équilibrées'
        },
        {
          icon: 'Database',
          title: 'Base de données complète',
          description: 'Plus de 100 aliments avec leurs valeurs nutritionnelles détaillées'
        },
        {
          icon: 'BarChart3',
          title: 'Statistiques avancées',
          description: 'Tableaux de bord et graphiques pour suivre vos performances'
        },
        {
          icon: 'Users',
          title: 'Multi-utilisateurs',
          description: 'Gestion des accès pour toute votre équipe agricole'
        }
      ]
    },
    pricing: {
      title: 'Tarifs adaptés à vos besoins',
      subtitle: 'Choisissez le plan qui correspond à votre exploitation',
      plans: [
        {
          name: 'Débutant',
          price: '199',
          period: '/mois',
          description: 'Idéal pour les petites exploitations',
          features: [
            'Jusqu\'à 50 vaches',
            'Calculs illimités',
            'Base de données standard',
            'Support email'
          ],
          cta: 'Choisir Débutant',
          popular: false
        },
        {
          name: 'Professionnel',
          price: '499',
          period: '/mois',
          description: 'Pour les exploitations moyennes',
          features: [
            'Jusqu\'à 200 vaches',
            'Calculs illimités',
            'Base de données complète',
            'Statistiques avancées',
            'Support prioritaire',
            'Export Excel/PDF'
          ],
          cta: 'Choisir Pro',
          popular: true
        },
        {
          name: 'Entreprise',
          price: '999',
          period: '/mois',
          description: 'Pour les grandes exploitations',
          features: [
            'Vaches illimitées',
            'Toutes les fonctionnalités',
            'API personnalisée',
            'Formation sur site',
            'Support 24/7',
            'Personnalisation'
          ],
          cta: 'Nous contacter',
          popular: false
        }
      ],
      currency: 'MAD'
    },
    testimonials: {
      title: 'Ce que disent nos clients',
      subtitle: 'Des agriculteurs marocains nous font confiance',
      items: [
        {
          name: 'Ahmed Benali',
          role: 'Propriétaire, Ferme Al Baraka - Meknès',
          content: 'RationPro a transformé notre gestion alimentaire. Nous avons augmenté notre production laitière de 15% en 3 mois.',
          rating: 5
        },
        {
          name: 'Fatima Zohra',
          role: 'Vétérinaire, Coopérative Lait Pur - Casablanca',
          content: 'L\'interface bilingue arabe-français est parfaite. Mes clients comprennent facilement les recommandations.',
          rating: 5
        },
        {
          name: 'Mohammed Alami',
          role: 'Directeur technique, Agri-Maroc - Agadir',
          content: 'Le support client est exceptionnel. L\'équipe comprend vraiment les besoins des agriculteurs marocains.',
          rating: 5
        }
      ]
    },
    contact: {
      title: 'Contactez-nous',
      subtitle: 'Une question? Notre équipe est là pour vous aider',
      form: {
        name: 'Votre nom',
        email: 'Votre email',
        phone: 'Téléphone',
        message: 'Votre message',
        submit: 'Envoyer le message'
      },
      info: {
        email: 'miriyassine123@gmail.com',
        phone: '+212 612 441 246',
        address: 'Maroc'
      }
    },
    footer: {
      description: 'Solution professionnelle de rationnement alimentaire pour vaches laitières.',
      links: ['Fonctionnalités', 'Tarifs', 'Contact', 'Mentions légales'],
      copyright: '© 2026 RationPro. Tous droits réservés.'
    },
    whatsapp: 'Besoin d\'aide? Chattez avec nous!'
  },
  ar: {
    nav: {
      features: 'المميزات',
      pricing: 'الأسعار',
      testimonials: 'آراء العملاء',
      contact: 'اتصل بنا',
      login: 'تسجيل الدخول'
    },
    hero: {
      badge: 'جديد: نظام FILAHATI',
      title: 'حسّن تغذية قطيعك',
      subtitle: 'راشن برو هو الحل الاحترافي لتغذية الأبقار الحلوب، المبني على نظام FILAHATI. احسب وحلل وحسّن حصصك بنقرات قليلة.',
      cta: 'ابدأ الآن',
      secondary: 'شاهد الأسعار'
    },
    trusted: 'أكثر من 500 مزرعة تثق بنا في المغرب',
    features: {
      title: 'مميزات قوية',
      subtitle: 'كل ما تحتاجه لتحسين تغذية قطيعك',
      items: [
        {
          icon: 'Calculator',
          title: 'حساب FILAHATI',
          description: 'خوارزميات دقيقة مبنية على معايير INRA لحصص متوازنة'
        },
        {
          icon: 'Database',
          title: 'قاعدة بيانات شاملة',
          description: 'أكثر من 100 علف مع قيمها الغذائية المفصلة'
        },
        {
          icon: 'BarChart3',
          title: 'إحصائيات متقدمة',
          description: 'لوحات تحكم ورسوم بيانية لمتابعة أدائك'
        },
        {
          icon: 'Users',
          title: 'متعدد المستخدمين',
          description: 'إدارة الصلاحيات لفريقك الزراعي بالكامل'
        }
      ]
    },
    pricing: {
      title: 'أسعار تناسب احتياجاتك',
      subtitle: 'اختر الخطة المناسبة لمزرعتك',
      plans: [
        {
          name: 'المبتدئ',
          price: '199',
          period: '/شهر',
          description: 'مثالي للمزارع الصغيرة',
          features: [
            'حتى 50 بقرة',
            'حسابات غير محدودة',
            'قاعدة بيانات قياسية',
            'دعم بالبريد الإلكتروني'
          ],
          cta: 'اختر المبتدئ',
          popular: false
        },
        {
          name: 'المحترف',
          price: '499',
          period: '/شهر',
          description: 'للمزارع المتوسطة',
          features: [
            'حتى 200 بقرة',
            'حسابات غير محدودة',
            'قاعدة بيانات كاملة',
            'إحصائيات متقدمة',
            'دعم ذو أولوية',
            'تصدير Excel/PDF'
          ],
          cta: 'اختر المحترف',
          popular: true
        },
        {
          name: 'المؤسسات',
          price: '999',
          period: '/شهر',
          description: 'للمزارع الكبيرة',
          features: [
            'أبقار غير محدودة',
            'جميع المميزات',
            'API مخصص',
            'تدريب في الموقع',
            'دعم 24/7',
            'تخصيص كامل'
          ],
          cta: 'اتصل بنا',
          popular: false
        }
      ],
      currency: 'درهم'
    },
    testimonials: {
      title: 'ماذا يقول عملاؤنا',
      subtitle: 'مزارعون مغاربة يثقون بنا',
      items: [
        {
          name: 'أحمد بنعلي',
          role: 'مالك مزرعة البركة - مكناس',
          content: 'راشن برو غيّر إدارتنا للتغذية. زدنا إنتاج الحليب بنسبة 15% في 3 أشهر.',
          rating: 5
        },
        {
          name: 'فاطمة الزهراء',
          role: 'طبيبة بيطرية، تعاونية الحليب النقي - الدار البيضاء',
          content: 'الواجهة ثنائية اللغة عربية-فرنسية مثالية. عملائي يفهمون التوصيات بسهولة.',
          rating: 5
        },
        {
          name: 'محمد العلمي',
          role: 'مدير تقني، أغري-المغرب - أكادير',
          content: 'دعم العملاء استثنائي. الفريق يفهم حقاً احتياجات المزارعين المغاربة.',
          rating: 5
        }
      ]
    },
    contact: {
      title: 'اتصل بنا',
      subtitle: 'سؤال؟ فريقنا هنا لمساعدتك',
      form: {
        name: 'اسمك',
        email: 'بريدك الإلكتروني',
        phone: 'الهاتف',
        message: 'رسالتك',
        submit: 'إرسال الرسالة'
      },
      info: {
        email: 'miriyassine123@gmail.com',
        phone: '+212 612 441 246',
        address: 'المغرب'
      }
    },
    footer: {
      description: 'الحل الاحترافي لتغذية الأبقار الحلوب.',
      links: ['المميزات', 'الأسعار', 'اتصل بنا', 'الشروط القانونية'],
      copyright: '© 2026 راشن برو. جميع الحقوق محفوظة.'
    },
    whatsapp: 'تحتاج مساعدة؟ تحدث معنا!'
  }
};

const iconMap = {
  Calculator,
  Database,
  BarChart3,
  Users
};

export function LandingPage({ language, setLanguage, theme, setTheme, onLogin }: LandingPageProps) {
  const t = content[language];
  const isRtl = language === 'ar';
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const whatsappNumber = '212612441246';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    language === 'fr' 
      ? 'Bonjour, je souhaite avoir plus d\'informations sur RationPro.'
      : 'مرحبا، أريد معرفة المزيد عن راشن برو.'
  )}`;

  return (
    <div className={`min-h-screen bg-background ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">RationPro</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.features}
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.pricing}
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.testimonials}
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.contact}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="h-9 w-9"
              >
                <Globe className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="h-9 w-9"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <Button onClick={onLogin} className="rounded-full px-6">
                {t.nav.login}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t.hero.badge}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
              {t.hero.title}
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
              {t.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={onLogin} size="lg" className="rounded-full px-8 h-12 text-base">
                {t.hero.cta}
                <ArrowRight className="w-4 h-4 ms-2" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base" asChild>
                <a href="#pricing">{t.hero.secondary}</a>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
              <img 
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&h=675&fit=crop&q=80" 
                alt="Dairy cows in field"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-wrap gap-4">
                  <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border">
                    <div className="text-2xl font-bold text-primary">+500</div>
                    <div className="text-sm text-muted-foreground">{language === 'fr' ? 'Fermes actives' : 'مزرعة نشطة'}</div>
                  </div>
                  <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border">
                    <div className="text-2xl font-bold text-primary">15%</div>
                    <div className="text-sm text-muted-foreground">{language === 'fr' ? 'Production accrue' : 'زيادة في الإنتاج'}</div>
                  </div>
                  <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">{language === 'fr' ? 'Support disponible' : 'دعم متاح'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <p className="text-center text-muted-foreground mt-12">{t.trusted}</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.features.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.features.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.features.items.map((feature, index) => {
              const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Feature image */}
          <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=600&h=400&fit=crop&q=80" 
                alt="Farmer with tablet"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&h=400&fit=crop&q=80" 
                alt="Modern dairy farm"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.pricing.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.pricing.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {t.pricing.plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-border ${plan.popular ? 'border-primary border-2 shadow-xl scale-105' : 'bg-card'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    {language === 'fr' ? 'Populaire' : 'الأكثر شعبية'}
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground"> {t.pricing.currency}{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full rounded-full ${plan.popular ? '' : 'variant-outline'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={onLogin}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.testimonials.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.testimonials.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {t.testimonials.items.map((testimonial, index) => (
              <Card key={index} className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testimonial image */}
          <div className="mt-16 rounded-2xl overflow-hidden border border-border shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1594771804886-a933bb2d609b?w=1200&h=400&fit=crop&q=80" 
              alt="Happy farmer"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.contact.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.contact.subtitle}</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder={t.contact.form.name}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder={t.contact.form.email}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder={t.contact.form.phone}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder={t.contact.form.message}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-full" disabled={formSubmitted}>
                    {formSubmitted 
                      ? (language === 'fr' ? 'Message envoyé!' : 'تم إرسال الرسالة!') 
                      : t.contact.form.submit
                    }
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden border border-border shadow-lg h-64">
                <img 
                  src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&h=300&fit=crop&q=80" 
                  alt="Agricultural landscape Morocco"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{language === 'fr' ? 'Email' : 'البريد الإلكتروني'}</div>
                    <a href={`mailto:${t.contact.info.email}`} className="font-medium text-foreground hover:text-primary transition-colors">
                      {t.contact.info.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{language === 'fr' ? 'Téléphone' : 'الهاتف'}</div>
                    <a href={`tel:${t.contact.info.phone}`} className="font-medium text-foreground hover:text-primary transition-colors">
                      {t.contact.info.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{language === 'fr' ? 'Adresse' : 'العنوان'}</div>
                    <span className="font-medium text-foreground">{t.contact.info.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">RationPro</span>
                <p className="text-sm text-muted-foreground">{t.footer.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {t.footer.links.map((link, index) => (
                <a key={index} href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {link}
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            {t.footer.copyright}
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 end-6 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline font-medium">{t.whatsapp}</span>
      </a>
    </div>
  );
}
