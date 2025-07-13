'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Menu } from 'lucide-react';

// Contentful client setup (same as before)
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

  // Enhanced fallback data matching Figma specs
  const fallbackData = {
    hero: {
      title: "Where It's Saturday\nAfternoon All Year Long",
      subtitle: "Boutique Hotels in Malibu and West LA",
      heroImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop",
      welcomeTitle: "Welcome to Hotel June",
      welcomeDescription: "Hotel June is imbued with inviting design, vibrant food, and thoughtful details. It's where creative happenings draw you closer to the city outside your door, and the gathering crowd inspires a renewed love for time away from home.",
      welcomeImages: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop", 
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop"
      ]
    },
    locations: {
      westLA: {
        title: "West LA",
        description: "Located in West LA, just minutes from LAX and a short drive to Santa Monica and Venice",
        ctaText: "Explore",
        image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&h=400&fit=crop"
      },
      malibu: {
        title: "Malibu", 
        description: "Your Private Malibu Retreat, Nestled Into Four Lush Acres On Famed Pacific Coast Highway",
        ctaText: "Explore",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
      }
    },
    goldenHour: {
      title: "Golden Hour Starts Here",
      description: "Caravan Swim Club is Hotel June's breezy, Baja-inspired poolside restaurant and bar—a sun-soaked hideaway serving fresh coastal cuisine, natural wines, and spirited cocktails from day to night. Think fish tacos by the fire pit, golden hour gatherings, and a laid-back vibe that captures the essence of Westside summer, all year long.",
      ctaText: "Visit Caravan",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop"
    },
    journalPosts: [
      {
        date: "West LA | February 21, 2025",
        title: "Health and Wellness: Yoga, Spas, and Fitness on the West Side",
        excerpt: "Los Angeles is a haven for health and wellness enthusiasts, and nowhere is this more evident than in West LA, Santa Monica, and Venice. Whether you're a local looking...",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
      },
      {
        date: "Malibu | February 21, 2025", 
        title: "Hotel June by Chelsea Cutler",
        excerpt: "Once a historic hideaway for wayfaring writers, musicians, and artists nestled in Point Dume, Hotel June remains a beacon of inspiration for a fresh generation of creatives. We're excited to share that Hotel...",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
      },
      {
        date: "West LA | February 21, 2025",
        title: "The Best of Santa Monica: A Guide to Restaurants, Shopping, Wellness, and Outdoor Activities",
        excerpt: "Santa Monica, with its beautiful beaches and vibrant atmosphere, offers a plethora of activities for visitors and locals alike.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
      }
    ],
    pressFeatures: [
      {
        publication: "Travel + Leisure",
        title: "11 Best Boutique Hotels in Los Angeles",
        thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=100&fit=crop"
      },
      {
        publication: "Fathom", 
        title: "The Best New Hotels",
        thumbnail: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop"
      },
      {
        publication: "Condé Nast Traveler",
        title: "The Aura of Relaxed Beach Living", 
        thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&h=100&fit=crop"
      }
    ]
  };

  // Load content (same logic as before)
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
    <div className="min-h-screen" style={{ backgroundColor: '#fff7e9' }}>
      {/* Hero Section - Following Figma Specs */}
      <section 
        className="relative flex flex-col text-white text-center min-h-screen"
        style={{
          backgroundColor: '#ebd8cc',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${data.hero.heroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        
        {/* Navigation Bar - Exact Figma Positioning */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between" style={{ padding: '60px' }}>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 text-white" 
               style={{ 
                 fontFamily: 'var(--font-inter)',
                 fontSize: '18px',
                 fontWeight: 500,
                 letterSpacing: '0.9px'
               }}>
            hotel june
          </div>
          
          <div className="relative">
            <button className="text-white hover:text-gray-300 transition-colors flex items-center"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '18px',
                      fontWeight: 500,
                      letterSpacing: '0.9px'
                    }}>
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

        {/* Hero Content - Exact Typography from Figma */}
        <div className="flex-1 flex items-center justify-center" style={{ padding: '60px' }}>
          <div className="max-w-4xl px-6">
            <p className="mb-6 text-white"
               style={{
                 fontFamily: 'var(--font-inter)',
                 fontSize: '36px',
                 fontWeight: 500,
                 lineHeight: '42px',
                 letterSpacing: '0.72px'
               }}>
              {data.hero.subtitle}
            </p>
            <h1 className="text-white mb-12 leading-tight"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '80px',
                  fontWeight: 700,
                  lineHeight: '88px',
                  letterSpacing: '1.6px'
                }}>
              {data.hero.title?.split('\n').map((line: string, index: number) => (
                <span key={index}>
                  {line}
                  {index < data.hero.title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
          </div>
        </div>
        
        {/* Booking Widget - Exact Figma Styling */}
        <div className="px-6 pb-8">
          <div className="max-w-4xl mx-auto" 
               style={{ 
                 background: 'rgba(26, 24, 21, 0.5)',
                 backdropFilter: 'blur(12px)',
                 borderRadius: '8px',
                 padding: '24px'
               }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center text-left" style={{ gap: '40px' }}>
                <MapPin className="w-5 h-5" />
                <div>
                  <div className="text-white text-xs opacity-75" 
                       style={{
                         fontFamily: 'var(--font-inter)',
                         fontSize: '18px',
                         fontWeight: 500,
                         letterSpacing: '0.9px'
                       }}>
                    Select Location
                  </div>
                  <div className="text-white font-medium">West LA & Malibu</div>
                </div>
              </div>
              
              <div className="flex items-center text-left" style={{ gap: '40px' }}>
                <Calendar className="w-5 h-5" />
                <div>
                  <div className="text-white text-xs opacity-75"
                       style={{
                         fontFamily: 'var(--font-inter)',
                         fontSize: '18px',
                         fontWeight: 500,
                         letterSpacing: '0.9px'
                       }}>
                    Add Dates
                  </div>
                  <div className="text-white font-medium">Check availability</div>
                </div>
              </div>
              
              <div className="flex items-center text-left" style={{ gap: '40px' }}>
                <Users className="w-5 h-5" />
                <div>
                  <div className="text-white text-xs opacity-75"
                       style={{
                         fontFamily: 'var(--font-inter)',
                         fontSize: '18px',
                         fontWeight: 500,
                         letterSpacing: '0.9px'
                       }}>
                    Total Guests
                  </div>
                  <div className="text-white font-medium">2 guests</div>
                </div>
              </div>
              
              <button className="transition-colors"
                      style={{
                        background: '#e1bc4d',
                        color: '#1a1815',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '18px',
                        fontWeight: 500,
                        letterSpacing: '0.9px',
                        padding: '16px 40px',
                        borderRadius: '4px',
                        border: 'none'
                      }}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section - Figma Typography */}
      <section style={{ padding: '120px 24px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: '60px' }}>
            <div>
              <h2 className="mb-8"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '48px',
                    fontWeight: 500,
                    lineHeight: '54px',
                    letterSpacing: '0.96px',
                    color: '#1a1815'
                  }}>
                {data.hero.welcomeTitle}
              </h2>
              <p style={{
                   fontFamily: 'var(--font-hanken-grotesk)',
                   fontSize: '18px',
                   fontWeight: 400,
                   lineHeight: '28px',
                   color: '#1a1815'
                 }}>
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

      {/* Locations Section - Exact Figma Styling */}
      <section style={{ padding: '120px 24px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 style={{
                 fontFamily: 'var(--font-inter)',
                 fontSize: '48px',
                 fontWeight: 500,
                 lineHeight: '54px',
                 letterSpacing: '0.96px',
                 color: '#1a1815'
               }}>
              Locations
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '60px' }}>
            {/* West LA */}
            <div className="group cursor-pointer text-center">
              <img 
                src={data.locations?.westLA?.image}
                alt="West LA location"
                className="w-full h-64 object-cover mb-4 group-hover:opacity-90 transition-opacity"
              />
              <h4 className="mb-4"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '30px',
                    fontWeight: 500,
                    lineHeight: '36px',
                    letterSpacing: '0.6px',
                    color: '#1a1815'
                  }}>
                {data.locations?.westLA?.title}
              </h4>
              <p className="mb-6 max-w-md mx-auto"
                 style={{
                   fontFamily: 'var(--font-hanken-grotesk)',
                   fontSize: '18px',
                   fontWeight: 400,
                   lineHeight: '28px',
                   color: '#1a1815'
                 }}>
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
              <h4 className="mb-4"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '30px',
                    fontWeight: 500,
                    lineHeight: '36px',
                    letterSpacing: '0.6px',
                    color: '#1a1815'
                  }}>
                {data.locations?.malibu?.title}
              </h4>
              <p className="mb-6 max-w-md mx-auto"
                 style={{
                   fontFamily: 'var(--font-hanken-grotesk)',
                   fontSize: '18px',
                   fontWeight: 400,
                   lineHeight: '28px',
                   color: '#1a1815'
                 }}>
                {data.locations?.malibu?.description}
              </p>
              <button className="btn-accent">
                {data.locations?.malibu?.ctaText}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Golden Hour Section */}
      <section style={{ padding: '120px 24px', backgroundColor: '#fff7e9' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: '60px' }}>
            <div>
              <img 
                src={data.goldenHour?.image}
                alt="Golden Hour dining"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="mb-6"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '36px',
                    fontWeight: 500,
                    lineHeight: '42px',
                    letterSpacing: '0.72px',
                    color: '#1a1815'
                  }}>
                {data.goldenHour?.title}
              </h3>
              <p className="mb-8 max-w-md mx-auto"
                 style={{
                   fontFamily: 'var(--font-hanken-grotesk)',
                   fontSize: '18px',
                   fontWeight: 400,
                   lineHeight: '28px',
                   color: '#1a1815'
                 }}>
                {data.goldenHour?.description}
              </p>
              <button className="btn-primary">
                {data.goldenHour?.ctaText}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* In the Press Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#fff7e9' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 style={{
                 fontFamily: 'var(--font-inter)',
                 fontSize: '48px',
                 fontWeight: 500,
                 lineHeight: '54px',
                 letterSpacing: '0.96px',
                 color: '#1a1815'
               }}>
              In The Press
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '30px' }}>
            {(data.pressFeatures || []).map((feature: any, index: number) => (
              <div key={index} className="text-center">
                <div className="press-card">
                  <h4 className="mb-2"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '30px',
                        fontWeight: 500,
                        lineHeight: '36px',
                        letterSpacing: '0.6px',
                        color: '#1a1815'
                      }}>
                    "{feature.title}"
                  </h4>
                  <p className="mb-3"
                     style={{
                       fontFamily: 'var(--font-hanken-grotesk)',
                       fontSize: '18px',
                       fontWeight: 400,
                       lineHeight: '28px',
                       color: '#1a1815'
                     }}>
                    — {feature.publication}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* June Journal Section */}
      <section style={{ padding: '120px 24px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="mb-4"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '48px',
                  fontWeight: 500,
                  lineHeight: '54px',
                  letterSpacing: '0.96px',
                  color: '#1a1815'
                }}>
              June Journal
            </h3>
            <p style={{
                 fontFamily: 'var(--font-hanken-grotesk)',
                 fontSize: '18px',
                 fontWeight: 400,
                 lineHeight: '28px',
                 color: '#1a1815'
               }}>
              Feels like June — what's inspiring us right now, from local art to live music to neighborhood discoveries and everything in between.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '30px' }}>
            {(data.journalPosts || []).map((post: any, index: number) => (
              <div key={index} className="group cursor-pointer">
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover mb-4 group-hover:opacity-90 transition-opacity"
                />
                <div className="mb-2"
                     style={{
                       fontFamily: 'var(--font-inter)',
                       fontSize: '18px',
                       fontWeight: 500,
                       lineHeight: '24px',
                       letterSpacing: '1.08px',
                       color: '#1a1815'
                     }}>
                  {post.date}
                </div>
                <h4 className="mb-4 group-hover:text-gray-600 transition-colors"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '28px',
                      fontWeight: 500,
                      lineHeight: '34px',
                      letterSpacing: '0.56px',
                      color: '#1a1815'
                    }}>
                  {post.title}
                </h4>
                <p className="mb-4"
                   style={{
                     fontFamily: 'var(--font-hanken-grotesk)',
                     fontSize: '18px',
                     fontWeight: 400,
                     lineHeight: '28px',
                     color: '#1a1815'
                   }}>
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

      {/* Social Media Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#fff7e9' }}>
        <div className="max-w-6xl mx-auto text-center">
          <h4 className="mb-8"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '36px',
                fontWeight: 500,
                lineHeight: '42px',
                letterSpacing: '0.72px',
                color: '#1a1815'
              }}>
            Follow us @hoteljunemalibu and @hoteljunewestla
          </h4>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSocialIndex * 20}%)` }}
              >
                {[
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
                  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop", 
                  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
                  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
                  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=400&fit=crop"
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

      {/* Newsletter Section */}
      <section style={{ padding: '80px 24px' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h4 className="mb-6"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '28px',
                fontWeight: 500,
                lineHeight: '34px',
                letterSpacing: '0.56px',
                color: '#1a1815'
              }}>
            Be the first to know everything about Hotel June.
          </h4>
          <div className="flex gap-3" style={{ backgroundColor: '#fff7e9', padding: '16px 40px', borderRadius: '4px' }}>
            <input 
              type="email" 
              placeholder="Email Address"
              className="flex-1 px-4 py-2 border-0 bg-transparent focus:outline-none"
              style={{
                fontFamily: 'var(--font-hanken-grotesk)',
                fontSize: '18px',
                color: '#1a1815'
              }}
            />
            <button className="btn-primary">
              Submit
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#fff7e9', padding: '60px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div>
              <h5 className="mb-3"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '14px',
                    fontWeight: 500,
                    letterSpacing: '0.84px',
                    color: '#1a1815'
                  }}>
                Offers Contact Colleagues Careers Gift Cards
              </h5>
            </div>
            <div>
              <h5 className="mb-3"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '14px',
                    fontWeight: 500,
                    letterSpacing: '0.84px',
                    color: '#1a1815'
                  }}>
                Accessibility Terms of Use Privacy Policy Sitemap Select Language
              </h5>
            </div>
            <div>
              <p style={{
                   fontFamily: 'var(--font-hanken-grotesk)',
                   fontSize: '16px',
                   fontWeight: 400,
                   lineHeight: '26px',
                   color: '#1a1815'
                 }}>
                A Proper Hospitality Hotel
              </p>
            </div>
            <div>
              <p style={{
                   fontFamily: 'var(--font-inter)',
                   fontSize: '14px',
                   fontWeight: 500,
                   letterSpacing: '0.84px',
                   color: '#1a1815'
                 }}>
                Proper Hotels Hotel June The Collective
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}