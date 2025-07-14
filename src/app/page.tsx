'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Menu } from 'lucide-react';

// Contentful client setup (keeping existing logic)
const createClient = () => {
  const getEnvVar = (key: string) => {
    try {
      return typeof window !== 'undefined' ? 
        (window as any).process?.env?.[key] || 
        (window as any).env?.[key] || 
        null : 
        process.env?.[key] || null;
    } catch {
      return null;
    }
  };

  const spaceId = getEnvVar('REACT_APP_CONTENTFUL_SPACE_ID');
  const accessToken = getEnvVar('REACT_APP_CONTENTFUL_ACCESS_TOKEN');
  
  if (!spaceId || !accessToken) {
    return null;
  }

  return {
    async getEntries(contentType: string) {
      try {
        const response = await fetch(
          `https://cdn.contentful.com/spaces/${spaceId}/entries?content_type=${contentType}&access_token=${accessToken}`
        );
        return await response.json();
      } catch (error) {
        console.error(`Error fetching ${contentType}:`, error);
        return { items: [] };
      }
    }
  };
};

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSocialIndex, setCurrentSocialIndex] = useState(0);
  const [currentWelcomeIndex, setCurrentWelcomeIndex] = useState(0);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Enhanced fallback data with high-quality hotel images
  const fallbackData = {
    hero: {
      title: "Where It's Saturday\nAfternoon All Year Long",
      subtitle: "Boutique Hotels in Malibu and West LA",
      heroImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop&crop=center",
      welcomeTitle: "Welcome to Hotel June",
      welcomeDescription: "Hotel June is imbued with inviting design, vibrant food, and thoughtful details. It's where creative happenings draw you closer to the city outside your door, and the gathering crowd inspires a renewed love for time away from home.",
      welcomeImages: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop&crop=center", 
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop&crop=center"
      ]
    },
    locations: {
      westLA: {
        title: "West LA",
        description: "Located in West LA, just minutes from LAX and a short drive to Santa Monica and Venice",
        ctaText: "Explore",
        image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&h=400&fit=crop&crop=center"
      },
      malibu: {
        title: "Malibu", 
        description: "Your Private Malibu Retreat, Nestled Into Four Lush Acres On Famed Pacific Coast Highway",
        ctaText: "Explore",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center"
      }
    },
    goldenHour: {
      title: "Golden Hour Starts Here",
      description: "Caravan Swim Club is Hotel June's breezy, Baja-inspired poolside restaurant and bar—a sun-soaked hideaway serving fresh coastal cuisine, natural wines, and spirited cocktails from day to night. Think fish tacos by the fire pit, golden hour gatherings, and a laid-back vibe that captures the essence of Westside summer, all year long.",
      ctaText: "Visit Caravan",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop&crop=center"
    },
    journalPosts: [
      {
        date: "West LA | February 21, 2025",
        title: "Health and Wellness: Yoga, Spas, and Fitness on the West Side",
        excerpt: "Los Angeles is a haven for health and wellness enthusiasts, and nowhere is this more evident than in West LA, Santa Monica, and Venice. Whether you're a local looking...",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center"
      },
      {
        date: "Malibu | February 21, 2025", 
        title: "Hotel June by Chelsea Cutler",
        excerpt: "Once a historic hideaway for wayfaring writers, musicians, and artists nestled in Point Dume, Hotel June remains a beacon of inspiration for a fresh generation of creatives. We're excited to share that Hotel...",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center"
      },
      {
        date: "West LA | February 21, 2025",
        title: "The Best of Santa Monica: A Guide to Restaurants, Shopping, Wellness, and Outdoor Activities",
        excerpt: "Santa Monica, with its beautiful beaches and vibrant atmosphere, offers a plethora of activities for visitors and locals alike.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center"
      }
    ],
    pressFeatures: [
      {
        publication: "Travel + Leisure",
        title: "11 Best Boutique Hotels in Los Angeles"
      },
      {
        publication: "Fathom", 
        title: "The Best New Hotels"
      },
      {
        publication: "Condé Nast Traveler",
        title: "The Aura of Relaxed Beach Living"
      }
    ]
  };

  // Load content
  useEffect(() => {
    const fetchData = async () => {
      const client = createClient();
      if (!client) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const [hotelPageData, bungalowData, amenitiesData, journalData] = await Promise.all([
          client.getEntries('hotelPage'),
          client.getEntries('bungalow'),
          client.getEntries('amenity'),
          client.getEntries('journalPost')
        ]);

        const processedData = {
          hero: hotelPageData?.items?.[0]?.fields || {},
          bungalows: bungalowData?.items || [],
          amenities: amenitiesData?.items || [],
          journalPosts: journalData?.items || []
        };

        setPageData(processedData);
      } catch (err) {
        console.error('Error loading page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = pageData || fallbackData;

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section - Exact Figma Implementation */}
      <section 
        className="hero-background relative flex flex-col text-white min-h-screen"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${data.hero.heroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        
        {/* Navigation Bar - Exact Figma Positioning */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between padding-hero">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 text-white button-text">
            hotel june
          </div>
          
          <div className="relative">
            <button className="text-white hover:text-gray-300 transition-colors flex items-center button-text">
              Destinations ▼
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-0 left-0 right-0 bg-black/90 backdrop-blur-sm z-40 pt-20">
            <div className="px-6 py-8 space-y-6">
              {['STAY', 'DINE', 'GATHER', 'JOURNAL', 'CONTACT'].map((item) => (
                <a key={item} href="#" className="block text-white text-lg font-medium hover:text-gray-300">
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Hero Content - Exact Figma Typography */}
        <div className="flex-1 flex items-center justify-center padding-hero">
          <div className="max-w-4xl px-6 flex flex-col gap-hero">
            <p className="hero-subtitle">
              {data.hero.subtitle}
            </p>
            <h1 className="hero-title">
              {data.hero.title?.split('\n').map((line: string, index: number) => (
                <span key={index}>
                  {line}
                  {index < data.hero.title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
          </div>
        </div>
        
        {/* Booking Widget - Exact Figma Implementation */}
        <div className="px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="booking-widget">
              <div className="flex items-center text-left gap-inline">
                <MapPin className="w-5 h-5 text-white" />
                <div>
                  <div className="booking-field text-xs opacity-75">
                    Select Location
                  </div>
                  <div className="text-white font-medium">West LA & Malibu</div>
                </div>
              </div>
              
              <div className="flex items-center text-left gap-inline">
                <Calendar className="w-5 h-5 text-white" />
                <div>
                  <div className="booking-field text-xs opacity-75">
                    Add Dates
                  </div>
                  <div className="text-white font-medium">Check availability</div>
                </div>
              </div>
              
              <div className="flex items-center text-left gap-inline">
                <Users className="w-5 h-5 text-white" />
                <div>
                  <div className="booking-field text-xs opacity-75">
                    Total Guests
                  </div>
                  <div className="text-white font-medium">2 guests</div>
                </div>
              </div>
              
              <button className="btn-primary">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section - Exact Figma Layout */}
      <section className="padding-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-hero">
            <div>
              <h2 className="welcome-section-title mb-8">
                {data.hero.welcomeTitle}
              </h2>
              <p className="body-text">
                {data.hero.welcomeDescription}
              </p>
            </div>
            
            {/* Welcome Image Carousel */}
            <div className="relative">
              <img 
                src={data.hero.welcomeImages?.[currentWelcomeIndex]}
                alt="Hotel June Welcome"
                className="w-full h-96 object-cover"
              />
              <button 
                onClick={() => setCurrentWelcomeIndex(prev => {
                  const images = data.hero.welcomeImages || [];
                  return prev > 0 ? prev - 1 : images.length - 1;
                })}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentWelcomeIndex(prev => {
                  const images = data.hero.welcomeImages || [];
                  return prev < images.length - 1 ? prev + 1 : 0;
                })}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex justify-center mt-4 space-x-2">
                {(data.hero.welcomeImages || []).map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentWelcomeIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentWelcomeIndex ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section - Exact Figma Typography */}
      <section className="padding-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="section-title">
              Locations
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-hero">
            {/* West LA */}
            <div className="group cursor-pointer text-center">
              <img 
                src={data.locations?.westLA?.image}
                alt="West LA location"
                className="w-full h-64 object-cover mb-4 group-hover:opacity-90 transition-opacity"
              />
              <h4 className="location-title mb-4">
                {data.locations?.westLA?.title}
              </h4>
              <p className="body-text-center mb-6 max-w-md mx-auto">
                {data.locations?.westLA?.description}
              </p>
              <button className="btn-accent">
                {data.locations?.westLA?.ctaText}
              </button>
            </div>

            {/* Malibu */}
            <div className="group cursor-pointer text-center">
              <img 
                src={data.locations?.malibu?.image}
                alt="Malibu location"
                className="w-full h-64 object-cover mb-4 group-hover:opacity-90 transition-opacity"
              />
              <h4 className="location-title mb-4">
                {data.locations?.malibu?.title}
              </h4>
              <p className="body-text-center mb-6 max-w-md mx-auto">
                {data.locations?.malibu?.description}
              </p>
              <button className="btn-accent">
                {data.locations?.malibu?.ctaText}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Golden Hour Section - Exact Figma Implementation */}
      <section className="padding-section bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-hero">
            <div>
              <img 
                src={data.goldenHour?.image}
                alt="Golden Hour dining"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="golden-hour-title mb-6">
                {data.goldenHour?.title}
              </h3>
              <p className="body-text-center mb-8 max-w-md mx-auto">
                {data.goldenHour?.description}
              </p>
              <button className="btn-primary">
                {data.goldenHour?.ctaText}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* In the Press Section - Exact Figma Layout */}
      <section className="padding-section bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="section-title">
              In The Press
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-frame">
            {(data.pressFeatures || []).map((feature: any, index: number) => (
              <div key={index} className="text-center">
                <div className="press-card">
                  <h4 className="press-quote mb-2">
                    "{feature.title}"
                  </h4>
                  <p className="body-text">
                    — {feature.publication}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* June Journal Section - Exact Figma Typography */}
      <section className="padding-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="section-title mb-4">
              June Journal
            </h3>
            <p className="body-text-center">
              Feels like June — what's inspiring us right now, from local art to live music to neighborhood discoveries and everything in between.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-card">
            {(data.journalPosts || []).map((post: any, index: number) => (
              <div key={index} className="group cursor-pointer">
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover mb-4 group-hover:opacity-90 transition-opacity"
                />
                <div className="button-text mb-2 text-xs uppercase tracking-wider opacity-75">
                  {post.date}
                </div>
                <h4 className="journal-title mb-4 group-hover:text-gray-600 transition-colors">
                  {post.title}
                </h4>
                <p className="body-text mb-4">
                  {post.excerpt}
                </p>
                <button className="btn-outline">
                  Read More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section - Exact Figma Typography */}
      <section className="padding-section bg-cream">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h4 className="follow-title mb-8">
            Follow us @hoteljunemalibu and @hoteljunewestla
          </h4>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSocialIndex * 20}%)` }}
              >
                {[
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop&crop=center",
                  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop&crop=center", 
                  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center",
                  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center",
                  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=400&fit=crop&crop=center"
                ].map((image, index) => (
                  <div key={index} className="w-1/5 flex-shrink-0 px-2">
                    <img 
                      src={image}
                      alt={`Hotel June moment ${index + 1}`}
                      className="w-full aspect-square object-cover hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setCurrentSocialIndex(prev => prev > 0 ? prev - 1 : 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentSocialIndex(prev => prev < 1 ? prev + 1 : 0)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Exact Figma Typography */}
      <section className="padding-section">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h4 className="newsletter-title mb-6">
            Be the first to know everything about Hotel June.
          </h4>
          <div className="bg-cream flex gap-3 rounded padding-card">
            <input 
              type="email" 
              placeholder="Email Address"
              className="flex-1 px-4 py-2 border-0 bg-transparent focus:outline-none body-text"
            />
            <button className="btn-primary">
              Submit
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Exact Figma Layout */}
      <footer className="bg-cream padding-hero">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div>
              <h5 className="font-display text-sm font-medium tracking-wider mb-3 text-primary">
                Offers Contact Colleagues Careers Gift Cards
              </h5>
            </div>
            <div>
              <h5 className="font-display text-sm font-medium tracking-wider mb-3 text-primary">
                Accessibility Terms of Use Privacy Policy Sitemap Select Language
              </h5>
            </div>
            <div>
              <p className="font-body text-base text-primary">
                A Proper Hospitality Hotel
              </p>
            </div>
            <div>
              <p className="font-display text-sm font-medium tracking-wider text-primary">
                Proper Hotels Hotel June The Collective
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}